'use client'

import { useState, useEffect, useCallback } from 'react'
import { Plus, Search, Edit2, Trash2, Phone, Mail, Car, X, User } from 'lucide-react'
import { formatPhone } from '@/lib/utils'

interface Client {
  id: string; name: string; cpfCnpj: string; phone: string; whatsapp: string
  email: string; address: string; city: string; state: string; notes: string
  active: boolean; createdAt: string
  _count: { vehicles: number; serviceOrders: number }
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({
    name: '', cpfCnpj: '', phone: '', whatsapp: '', email: '',
    address: '', city: '', state: '', notes: '',
  })

  const fetchClients = useCallback(async () => {
    const res = await fetch(`/api/clients?search=${search}`)
    const data = await res.json()
    setClients(data)
    setLoading(false)
  }, [search])

  useEffect(() => { fetchClients() }, [fetchClients])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (editingClient) {
      await fetch('/api/clients', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editingClient.id, ...form }),
      })
    } else {
      await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
    }
    setShowModal(false)
    setEditingClient(null)
    setForm({ name: '', cpfCnpj: '', phone: '', whatsapp: '', email: '', address: '', city: '', state: '', notes: '' })
    fetchClients()
  }

  const handleEdit = (client: Client) => {
    setEditingClient(client)
    setForm({
      name: client.name, cpfCnpj: client.cpfCnpj || '', phone: client.phone || '',
      whatsapp: client.whatsapp || '', email: client.email || '',
      address: client.address || '', city: client.city || '', state: client.state || '',
      notes: client.notes || '',
    })
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este cliente?')) return
    await fetch(`/api/clients?id=${id}`, { method: 'DELETE' })
    fetchClients()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Clientes</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{clients.length} clientes cadastrados</p>
        </div>
        <button onClick={() => { setEditingClient(null); setForm({ name: '', cpfCnpj: '', phone: '', whatsapp: '', email: '', address: '', city: '', state: '', notes: '' }); setShowModal(true) }} className="btn-primary">
          <Plus size={18} /> Novo Cliente
        </button>
      </div>

      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} className="input pl-10" placeholder="Buscar por nome, CPF/CNPJ, telefone..." />
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b" style={{ borderColor: 'var(--border)' }}>
                {['Cliente', 'CPF/CNPJ', 'Contato', 'Veículos', 'OS', 'Ações'].map(h => (
                  <th key={h} className="text-left py-3 px-4 text-xs font-medium uppercase" style={{ color: 'var(--text-muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="border-b animate-pulse" style={{ borderColor: 'var(--border)' }}>
                    <td className="py-3 px-4"><div className="h-4 w-32 rounded" style={{ background: 'var(--bg-input)' }} /></td>
                    <td className="py-3 px-4"><div className="h-4 w-24 rounded" style={{ background: 'var(--bg-input)' }} /></td>
                    <td className="py-3 px-4"><div className="h-4 w-28 rounded" style={{ background: 'var(--bg-input)' }} /></td>
                    <td className="py-3 px-4"><div className="h-4 w-8 rounded" style={{ background: 'var(--bg-input)' }} /></td>
                    <td className="py-3 px-4"><div className="h-4 w-8 rounded" style={{ background: 'var(--bg-input)' }} /></td>
                    <td className="py-3 px-4"><div className="h-4 w-16 rounded" style={{ background: 'var(--bg-input)' }} /></td>
                  </tr>
                ))
              ) : clients.map((client) => (
                <tr key={client.id} className="table-row border-b" style={{ borderColor: 'var(--border)' }}>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'var(--accent)15' }}>
                        <User size={16} style={{ color: 'var(--accent)' }} />
                      </div>
                      <div>
                        <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{client.name}</p>
                        {client.email && <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{client.email}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm" style={{ color: 'var(--text-secondary)' }}>{client.cpfCnpj || '-'}</td>
                  <td className="py-3 px-4">
                    {client.phone && <p className="text-sm flex items-center gap-1" style={{ color: 'var(--text-secondary)' }}><Phone size={12} />{formatPhone(client.phone)}</p>}
                    {client.whatsapp && <p className="text-xs flex items-center gap-1" style={{ color: 'var(--success)' }}>📱 {formatPhone(client.whatsapp)}</p>}
                  </td>
                  <td className="py-3 px-4 text-sm" style={{ color: 'var(--text-secondary)' }}>{client._count.vehicles}</td>
                  <td className="py-3 px-4 text-sm" style={{ color: 'var(--text-secondary)' }}>{client._count.serviceOrders}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleEdit(client)} className="p-1.5 rounded-lg transition-colors hover:bg-[var(--bg-card-hover)]" style={{ color: 'var(--text-muted)' }}>
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDelete(client.id)} className="p-1.5 rounded-lg transition-colors hover:bg-[rgba(239,68,68,0.1)]" style={{ color: 'var(--danger)' }}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowModal(false)} />
          <div className="relative w-full max-w-lg card p-6 animate-scaleIn max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                {editingClient ? 'Editar Cliente' : 'Novo Cliente'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-lg hover:bg-[var(--bg-card-hover)]" style={{ color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Nome *</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>CPF/CNPJ</label>
                  <input type="text" value={form.cpfCnpj} onChange={(e) => setForm({ ...form, cpfCnpj: e.target.value })} className="input" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>E-mail</label>
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Telefone</label>
                  <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>WhatsApp</label>
                  <input type="tel" value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} className="input" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Endereço</label>
                <input type="text" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="input" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Cidade</label>
                  <input type="text" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="input" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Estado</label>
                  <input type="text" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} className="input" maxLength={2} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Observações</label>
                <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="input" rows={3} />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1 justify-center">Cancelar</button>
                <button type="submit" className="btn-primary flex-1 justify-center">{editingClient ? 'Salvar' : 'Criar'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
