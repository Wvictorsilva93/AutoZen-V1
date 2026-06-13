'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { Loader2, Trash2, Upload, ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { listRows, insertRow, deleteRow } from '@/lib/db';
import { uploadOsPhoto, deleteStorageByUrl } from '@/lib/storage';

interface Photo { id: string; os_id: string; company_id: string; photo_url: string; photo_type: string }

export function OsPhotosDialog({
  open, onOpenChange, osId, osNumber, companyId,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  osId: string | null;
  osNumber: number | null;
  companyId: string | null;
}) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState<'before' | 'after'>('before');
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    if (!osId) return;
    setLoading(true);
    const { data } = await listRows<Photo>('os_photos', { orderBy: 'created_at' });
    setPhotos((data ?? []).filter((p) => p.os_id === osId));
    setLoading(false);
  }, [osId]);

  useEffect(() => { if (open && osId) load(); }, [open, osId, load]);

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    const file = fileRef.current?.files?.[0];
    if (!file) { toast.error('Selecione uma imagem'); return; }
    if (!osId || !companyId) { toast.error('OS inválida'); return; }
    setUploading(true);
    const { url, error } = await uploadOsPhoto(companyId, osId, type, file);
    if (error || !url) { toast.error('Erro no upload: ' + (error ?? '')); setUploading(false); return; }
    const { error: insErr } = await insertRow('os_photos', {
      company_id: companyId, os_id: osId, photo_url: url, photo_type: type,
    });
    if (insErr) toast.error('Erro ao salvar: ' + insErr);
    else { toast.success('Foto enviada'); if (fileRef.current) fileRef.current.value = ''; await load(); }
    setUploading(false);
  }

  async function removePhoto(p: Photo) {
    const { error } = await deleteRow('os_photos', p.id);
    if (error) { toast.error('Erro ao excluir: ' + error); return; }
    await deleteStorageByUrl(p.photo_url);
    toast.success('Foto excluída');
    await load();
  }

  const before = photos.filter((p) => p.photo_type === 'before');
  const after = photos.filter((p) => p.photo_type === 'after');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-2xl">
        <DialogHeader><DialogTitle className="text-white">Fotos da OS #{osNumber}</DialogTitle></DialogHeader>

        <form onSubmit={handleUpload} className="flex flex-col sm:flex-row items-end gap-3 border-b border-border pb-4">
          <div className="space-y-2 w-full sm:w-40">
            <Label className="text-slate-300 text-xs">Tipo</Label>
            <Select value={type} onValueChange={(v) => setType((v as 'before' | 'after') ?? 'before')}>
              <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="before">Antes</SelectItem>
                <SelectItem value="after">Depois</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 flex-1 w-full">
            <Label className="text-slate-300 text-xs">Imagem</Label>
            <Input ref={fileRef} type="file" accept="image/*" className="bg-slate-800/50 border-slate-700 text-white file:text-slate-300" />
          </div>
          <Button type="submit" disabled={uploading} className="bg-blue-600 hover:bg-blue-500 text-white">
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Upload className="w-4 h-4 mr-2" /> Enviar</>}
          </Button>
        </form>

        {loading ? (
          <div className="flex items-center justify-center py-10 text-slate-500"><Loader2 className="w-6 h-6 animate-spin" /></div>
        ) : photos.length === 0 ? (
          <div className="text-center py-10 text-slate-500 text-sm flex flex-col items-center gap-2">
            <ImageIcon className="w-10 h-10 opacity-40" /> Nenhuma foto nesta OS.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 max-h-[50vh] overflow-y-auto">
            {[{ label: 'Antes', list: before, color: 'text-amber-400' }, { label: 'Depois', list: after, color: 'text-emerald-400' }].map((col) => (
              <div key={col.label}>
                <p className={`text-xs font-medium mb-2 ${col.color}`}>{col.label}</p>
                <div className="grid grid-cols-2 gap-2">
                  {col.list.map((p) => (
                    <div key={p.id} className="relative aspect-square rounded-lg overflow-hidden bg-slate-800/50 group">
                      <Image src={p.photo_url} alt={col.label} fill className="object-cover" unoptimized />
                      <Button size="icon" variant="ghost"
                        className="absolute top-1 right-1 h-6 w-6 bg-black/50 text-white hover:bg-red-600 opacity-0 group-hover:opacity-100"
                        onClick={() => removePhoto(p)} aria-label="Excluir"><Trash2 className="w-3 h-3" /></Button>
                    </div>
                  ))}
                  {col.list.length === 0 && <p className="text-xs text-slate-600 col-span-2">—</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
