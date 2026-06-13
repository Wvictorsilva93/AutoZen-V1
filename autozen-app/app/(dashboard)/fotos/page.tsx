'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState, useCallback, useRef } from 'react';
import { Upload, Image as ImageIcon, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { listRows, insertRow, deleteRow } from '@/lib/db';
import { uploadOsPhoto, deleteStorageByUrl } from '@/lib/storage';
import { useProfile } from '@/hooks/useProfile';

interface Photo { id: string; os_id: string; company_id: string; photo_url: string; photo_type: string }
interface Order { id: string; number: number }

export default function FotosPage() {
  const { profile } = useProfile();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [osId, setOsId] = useState('');
  const [type, setType] = useState<'before' | 'after'>('before');
  const [uploading, setUploading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Photo | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const [p, o] = await Promise.all([
      listRows<Photo>('os_photos', { orderBy: 'created_at' }),
      listRows<Order>('orders', { orderBy: 'created_at' }),
    ]);
    if (p.error) toast.error('Erro ao carregar fotos: ' + p.error);
    else setPhotos(p.data ?? []);
    setOrders(o.data ?? []);
    setLoading(false);
  }, []);
  useEffect(() => { load(); }, [load]);

  const osNumber = (id: string) => orders.find((o) => o.id === id)?.number ?? '—';

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    const file = fileRef.current?.files?.[0];
    if (!osId) { toast.error('Selecione a OS'); return; }
    if (!file) { toast.error('Selecione uma imagem'); return; }
    if (!profile?.company_id) { toast.error('Empresa não identificada. Refaça o login.'); return; }
    setUploading(true);
    const { url, error } = await uploadOsPhoto(profile.company_id, osId, type, file);
    if (error || !url) { toast.error('Erro no upload: ' + (error ?? '')); setUploading(false); return; }
    const { error: insErr } = await insertRow('os_photos', {
      company_id: profile.company_id, os_id: osId, photo_url: url, photo_type: type,
    });
    if (insErr) toast.error('Erro ao salvar: ' + insErr);
    else { toast.success('Foto enviada'); setDialogOpen(false); if (fileRef.current) fileRef.current.value = ''; await load(); }
    setUploading(false);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    const { error } = await deleteRow('os_photos', deleteTarget.id);
    if (error) { toast.error('Erro ao excluir: ' + error); return; }
    await deleteStorageByUrl(deleteTarget.photo_url);
    toast.success('Foto excluída');
    setDeleteTarget(null);
    await load();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-white">Registro Fotográfico</h1>
        <Button onClick={() => setDialogOpen(true)} className="bg-blue-600 hover:bg-blue-500 text-white">
          <Upload className="w-4 h-4 mr-2" /> Upload Fotos
        </Button>
      </div>

      <p className="text-sm text-slate-400">
        Fotos antes e depois associadas às Ordens de Serviço. Compressão automática e armazenamento no Supabase Storage.
      </p>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-slate-500"><Loader2 className="w-6 h-6 animate-spin" /></div>
      ) : photos.length === 0 ? (
        <div className="text-center py-16 text-slate-500"><p>Nenhuma foto registrada.</p></div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {photos.map((photo) => (
            <Card key={photo.id} className="bg-card border-border hover:border-blue-500/30 transition-colors group">
              <CardContent className="p-3">
                <div className="relative aspect-square rounded-lg bg-slate-800/50 overflow-hidden mb-2">
                  {photo.photo_url ? (
                    <Image src={photo.photo_url} alt={`OS ${osNumber(photo.os_id)}`} fill className="object-cover" unoptimized />
                  ) : (
                    <div className="flex items-center justify-center h-full"><ImageIcon className="w-12 h-12 text-slate-600" /></div>
                  )}
                  <Button size="icon" variant="ghost"
                    className="absolute top-1 right-1 h-7 w-7 bg-black/50 text-white hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => setDeleteTarget(photo)} aria-label="Excluir">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-white font-medium">OS #{osNumber(photo.os_id)}</p>
                <span className={`text-xs px-2 py-0.5 rounded mt-1 inline-block ${photo.photo_type === 'before' ? 'bg-amber-500/10 text-amber-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                  {photo.photo_type === 'before' ? 'antes' : 'depois'}
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader><DialogTitle className="text-white">Upload de Foto</DialogTitle></DialogHeader>
          <form onSubmit={handleUpload} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-slate-300">Ordem de Serviço *</Label>
              <Select value={osId} onValueChange={(v) => setOsId(v ?? '')}>
                <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white"><SelectValue placeholder="Selecione a OS" /></SelectTrigger>
                <SelectContent>
                  {orders.map((o) => <SelectItem key={o.id} value={o.id}>OS #{o.number}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Tipo</Label>
              <Select value={type} onValueChange={(v) => setType((v as 'before' | 'after') ?? 'before')}>
                <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="before">Antes</SelectItem>
                  <SelectItem value="after">Depois</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Imagem *</Label>
              <Input ref={fileRef} type="file" accept="image/*" className="bg-slate-800/50 border-slate-700 text-white file:text-slate-300" />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={uploading} className="bg-blue-600 hover:bg-blue-500 text-white">
                {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Enviar'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <DialogContent className="bg-card border-border">
          <DialogHeader><DialogTitle className="text-white">Excluir foto</DialogTitle></DialogHeader>
          <p className="text-slate-400 text-sm">Excluir esta foto permanentemente?</p>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeleteTarget(null)} className="text-slate-300">Cancelar</Button>
            <Button onClick={handleDelete} className="bg-red-600 hover:bg-red-500 text-white">Excluir</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
