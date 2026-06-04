'use client'

import { useEffect, useState } from 'react'
import { Plus, Search, Edit, Trash2, Phone, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getSupabaseClient } from '@/lib/supabase/client'
import { formatDate } from '@/lib/utils'

type Customer = {
  id: string
  name: string
  phone: string | null
  email: string | null
  notes: string | null
  created_at: string
}

type Props = {
  companyId: string
}

export function ClientesTable({ companyId }: Props) {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    notes: '',
  })

  useEffect(() => {
    loadCustomers()
  }, [companyId])

  useEffect(() => {
    if (search) {
      const filtered = customers.filter(
        (customer) =>
          customer.name.toLowerCase().includes(search.toLowerCase()) ||
          customer.phone?.includes(search) ||
          customer.email?.toLowerCase().includes(search.toLowerCase())
      )
      setFilteredCustomers(filtered)
    } else {
      setFilteredCustomers(customers)
    }
  }, [search, customers])

  async function loadCustomers() {
    try {
      const supabase = getSupabaseClient()
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('company_id', companyId)
        .order('created_at', { ascending: false })

      if (error) throw error
      setCustomers((data as any) || [])
      setFilteredCustomers((data as any) || [])
    } catch (error) {
      console.error('Error loading customers:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const supabase = getSupabaseClient()

    try {
      if (editingId) {
        // Update
        const { error } = await (supabase as any)
          .from('customers')
          .update(formData)
          .eq('id', editingId)

        if (error) throw error
      } else {
        // Create
        const { error } = await (supabase as any)
          .from('customers')
          .insert({ ...formData, company_id: companyId })

        if (error) throw error
      }

      setFormData({ name: '', phone: '', email: '', notes: '' })
      setShowForm(false)
      setEditingId(null)
      loadCustomers()
    } catch (error) {
      console.error('Error saving customer:', error)
      alert('Erro ao salvar cliente')
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Deseja realmente excluir este cliente?')) return

    try {
      const supabase = getSupabaseClient()
      const { error } = await supabase.from('customers').delete().eq('id', id)

      if (error) throw error
      loadCustomers()
    } catch (error) {
      console.error('Error deleting customer:', error)
      alert('Erro ao excluir cliente')
    }
  }

  function handleEdit(customer: Customer) {
    setFormData({
      name: customer.name,
      phone: customer.phone || '',
      email: customer.email || '',
      notes: customer.notes || '',
    })
    setEditingId(customer.id)
    setShowForm(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Clientes</h1>
          <p className="text-slate-400">Gerencie seus clientes</p>
        </div>
        <Button
          onClick={() => {
            setFormData({ name: '', phone: '', email: '', notes: '' })
            setEditingId(null)
            setShowForm(!showForm)
          }}
          className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Cliente
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <Card className="glass border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">
              {editingId ? 'Editar Cliente' : 'Novo Cliente'}
            </CardTitle>
            <CardDescription className="text-slate-400">
              Preencha os dados do cliente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-300 mb-2 block">Nome *</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Nome completo"
                    required
                    className="bg-slate-900/50 border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-300 mb-2 block">Telefone</label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="(11) 99999-9999"
                    className="bg-slate-900/50 border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-300 mb-2 block">Email</label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@exemplo.com"
                    className="bg-slate-900/50 border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-300 mb-2 block">Observações</label>
                  <Input
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Notas sobre o cliente"
                    className="bg-slate-900/50 border-slate-700 text-white"
                  />
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

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nome, telefone ou email..."
          className="pl-10 bg-slate-900/50 border-slate-700 text-white"
        />
      </div>

      {/* Table */}
      <Card className="glass border-slate-800">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="text-left p-4 text-slate-400 font-medium">Nome</th>
                  <th className="text-left p-4 text-slate-400 font-medium">Contato</th>
                  <th className="text-left p-4 text-slate-400 font-medium">Cadastro</th>
                  <th className="text-right p-4 text-slate-400 font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={4} className="text-center p-8 text-slate-400">
                      Carregando...
                    </td>
                  </tr>
                ) : filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center p-8 text-slate-400">
                      {search ? 'Nenhum cliente encontrado' : 'Nenhum cliente cadastrado'}
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((customer) => (
                    <tr key={customer.id} className="border-b border-slate-800 hover:bg-slate-800/50">
                      <td className="p-4">
                        <div className="text-white font-medium">{customer.name}</div>
                        {customer.notes && (
                          <div className="text-sm text-slate-400">{customer.notes}</div>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="space-y-1">
                          {customer.phone && (
                            <div className="flex items-center gap-2 text-slate-300 text-sm">
                              <Phone className="w-4 h-4" />
                              {customer.phone}
                            </div>
                          )}
                          {customer.email && (
                            <div className="flex items-center gap-2 text-slate-300 text-sm">
                              <Mail className="w-4 h-4" />
                              {customer.email}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-slate-400 text-sm">{formatDate(customer.created_at)}</td>
                      <td className="p-4">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEdit(customer)}
                            className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(customer.id)}
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

      {/* Stats */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="glass border-slate-800">
            <CardContent className="p-6">
              <div className="text-sm text-slate-400">Total de Clientes</div>
              <div className="text-3xl font-bold text-white mt-2">{customers.length}</div>
            </CardContent>
          </Card>
          <Card className="glass border-slate-800">
            <CardContent className="p-6">
              <div className="text-sm text-slate-400">Com Telefone</div>
              <div className="text-3xl font-bold text-white mt-2">
                {customers.filter((c) => c.phone).length}
              </div>
            </CardContent>
          </Card>
          <Card className="glass border-slate-800">
            <CardContent className="p-6">
              <div className="text-sm text-slate-400">Com Email</div>
              <div className="text-3xl font-bold text-white mt-2">
                {customers.filter((c) => c.email).length}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
