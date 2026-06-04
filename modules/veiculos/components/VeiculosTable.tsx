'use client'

import { useEffect, useState } from 'react'
import { Plus, Search, Edit, Trash2, Car } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getSupabaseClient } from '@/lib/supabase/client'
import { formatPlate } from '@/lib/utils'

type Vehicle = {
  id: string
  customer_id: string
  plate: string
  brand: string | null
  model: string | null
  color: string | null
  type: 'carro' | 'moto' | 'suv' | 'van'
  customer: { name: string }
}

type Customer = {
  id: string
  name: string
}

type Props = {
  companyId: string
}

export function VeiculosTable({ companyId }: Props) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    customer_id: '',
    plate: '',
    brand: '',
    model: '',
    color: '',
    type: 'carro' as 'carro' | 'moto' | 'suv' | 'van',
  })

  useEffect(() => {
    loadData()
  }, [companyId])

  useEffect(() => {
    if (search) {
      const filtered = vehicles.filter(
        (vehicle) =>
          vehicle.plate.toLowerCase().includes(search.toLowerCase()) ||
          vehicle.brand?.toLowerCase().includes(search.toLowerCase()) ||
          vehicle.model?.toLowerCase().includes(search.toLowerCase()) ||
          vehicle.customer.name.toLowerCase().includes(search.toLowerCase())
      )
      setFilteredVehicles(filtered)
    } else {
      setFilteredVehicles(vehicles)
    }
  }, [search, vehicles])

  async function loadData() {
    try {
      const supabase = getSupabaseClient()

      // Load vehicles
      const { data: vehiclesData, error: vehiclesError } = await supabase
        .from('vehicles')
        .select('*, customer:customers(name)')
        .eq('company_id', companyId)
        .order('created_at', { ascending: false })

      if (vehiclesError) throw vehiclesError
      setVehicles((vehiclesData as any) || [])
      setFilteredVehicles((vehiclesData as any) || [])

      // Load customers
      const { data: customersData, error: customersError } = await supabase
        .from('customers')
        .select('id, name')
        .eq('company_id', companyId)
        .order('name')

      if (customersError) throw customersError
      setCustomers((customersData as any) || [])
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const supabase = getSupabaseClient()

    const payload: Record<string, any> = {
      ...formData,
      plate: formatPlate(formData.plate),
      company_id: companyId,
    }

    try {
      if (editingId) {
        const { company_id, ...updateData } = payload
        const { error } = await (supabase as any).from('vehicles').update(updateData).eq('id', editingId)
        if (error) throw error
      } else {
        const { error } = await (supabase as any).from('vehicles').insert(payload)
        if (error) throw error
      }

      setFormData({
        customer_id: '',
        plate: '',
        brand: '',
        model: '',
        color: '',
        type: 'carro',
      })
      setShowForm(false)
      setEditingId(null)
      loadData()
    } catch (error: any) {
      console.error('Error saving vehicle:', error)
      if (error.message?.includes('unique')) {
        alert('Placa já cadastrada')
      } else {
        alert('Erro ao salvar veículo')
      }
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Deseja realmente excluir este veículo?')) return

    try {
      const supabase = getSupabaseClient()
      const { error } = await supabase.from('vehicles').delete().eq('id', id)
      if (error) throw error
      loadData()
    } catch (error) {
      console.error('Error deleting vehicle:', error)
      alert('Erro ao excluir veículo')
    }
  }

  function handleEdit(vehicle: Vehicle) {
    setFormData({
      customer_id: vehicle.customer_id,
      plate: vehicle.plate,
      brand: vehicle.brand || '',
      model: vehicle.model || '',
      color: vehicle.color || '',
      type: vehicle.type,
    })
    setEditingId(vehicle.id)
    setShowForm(true)
  }

  const typeLabels = {
    carro: 'Carro',
    moto: 'Moto',
    suv: 'SUV',
    van: 'Van',
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Veículos</h1>
          <p className="text-slate-400">Gerencie os veículos dos clientes</p>
        </div>
        <Button
          onClick={() => {
            setFormData({
              customer_id: '',
              plate: '',
              brand: '',
              model: '',
              color: '',
              type: 'carro',
            })
            setEditingId(null)
            setShowForm(!showForm)
          }}
          className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Veículo
        </Button>
      </div>

      {showForm && (
        <Card className="glass border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">
              {editingId ? 'Editar Veículo' : 'Novo Veículo'}
            </CardTitle>
            <CardDescription className="text-slate-400">Preencha os dados do veículo</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-300 mb-2 block">Cliente *</label>
                  <select
                    value={formData.customer_id}
                    onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })}
                    required
                    className="w-full h-9 px-3 rounded-md bg-slate-900/50 border border-slate-700 text-white"
                  >
                    <option value="">Selecione um cliente</option>
                    {customers.map((customer) => (
                      <option key={customer.id} value={customer.id}>
                        {customer.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm text-slate-300 mb-2 block">Placa *</label>
                  <Input
                    value={formData.plate}
                    onChange={(e) => setFormData({ ...formData, plate: e.target.value.toUpperCase() })}
                    placeholder="ABC1234"
                    required
                    maxLength={7}
                    className="bg-slate-900/50 border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-300 mb-2 block">Marca</label>
                  <Input
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    placeholder="Toyota, Honda, etc."
                    className="bg-slate-900/50 border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-300 mb-2 block">Modelo</label>
                  <Input
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    placeholder="Corolla, Civic, etc."
                    className="bg-slate-900/50 border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-300 mb-2 block">Cor</label>
                  <Input
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    placeholder="Preto, Branco, etc."
                    className="bg-slate-900/50 border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-300 mb-2 block">Tipo *</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    required
                    className="w-full h-9 px-3 rounded-md bg-slate-900/50 border border-slate-700 text-white"
                  >
                    <option value="carro">Carro</option>
                    <option value="moto">Moto</option>
                    <option value="suv">SUV</option>
                    <option value="van">Van</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="bg-cyan-500 hover:bg-cyan-600">
                  {editingId ? 'Atualizar' : 'Salvar'}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setShowForm(false)
                    setEditingId(null)
                  }}
                  className="text-slate-400"
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por placa, marca, modelo ou cliente..."
          className="pl-10 bg-slate-900/50 border-slate-700 text-white"
        />
      </div>

      <Card className="glass border-slate-800">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="text-left p-4 text-slate-400 font-medium">Placa</th>
                  <th className="text-left p-4 text-slate-400 font-medium">Veículo</th>
                  <th className="text-left p-4 text-slate-400 font-medium">Cliente</th>
                  <th className="text-left p-4 text-slate-400 font-medium">Tipo</th>
                  <th className="text-right p-4 text-slate-400 font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="text-center p-8 text-slate-400">
                      Carregando...
                    </td>
                  </tr>
                ) : filteredVehicles.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center p-8 text-slate-400">
                      {search ? 'Nenhum veículo encontrado' : 'Nenhum veículo cadastrado'}
                    </td>
                  </tr>
                ) : (
                  filteredVehicles.map((vehicle) => (
                    <tr key={vehicle.id} className="border-b border-slate-800 hover:bg-slate-800/50">
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Car className="w-4 h-4 text-cyan-400" />
                          <span className="text-white font-mono font-bold">{vehicle.plate}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-white">{vehicle.brand || '-'} {vehicle.model || ''}</div>
                        {vehicle.color && <div className="text-sm text-slate-400">{vehicle.color}</div>}
                      </td>
                      <td className="p-4 text-slate-300">{vehicle.customer.name}</td>
                      <td className="p-4">
                        <span className="px-2 py-1 rounded-full text-xs bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                          {typeLabels[vehicle.type]}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEdit(vehicle)}
                            className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(vehicle.id)}
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {!loading && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(typeLabels).map(([type, label]) => (
            <Card key={type} className="glass border-slate-800">
              <CardContent className="p-6">
                <div className="text-sm text-slate-400">{label}</div>
                <div className="text-3xl font-bold text-white mt-2">
                  {vehicles.filter((v) => v.type === type).length}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
