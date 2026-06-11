'use client';

export const dynamic = 'force-dynamic';

import { Camera, Upload, Image as ImageIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function FotosPage() {
  const mockPhotos = [
    { id: '1', os: 1001, vehicle: 'Corolla - ABC-1234', type: 'antes', url: '' },
    { id: '2', os: 1001, vehicle: 'Corolla - ABC-1234', type: 'depois', url: '' },
    { id: '3', os: 1003, vehicle: 'MT-07 - GHI-9012', type: 'antes', url: '' },
    { id: '4', os: 1003, vehicle: 'MT-07 - GHI-9012', type: 'depois', url: '' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-white">Registro Fotográfico</h1>
        <Button className="bg-blue-600 hover:bg-blue-500 text-white">
          <Upload className="w-4 h-4 mr-2" />
          Upload Fotos
        </Button>
      </div>

      <p className="text-sm text-slate-400">
        Fotos antes e depois associadas às Ordens de Serviço. Compressão automática e armazenamento no Supabase Storage.
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {mockPhotos.map((photo) => (
          <Card key={photo.id} className="bg-card border-border hover:border-blue-500/30 transition-colors cursor-pointer">
            <CardContent className="p-3">
              <div className="aspect-square rounded-lg bg-slate-800/50 flex items-center justify-center mb-2">
                <ImageIcon className="w-12 h-12 text-slate-600" />
              </div>
              <p className="text-xs text-white font-medium">OS #{photo.os}</p>
              <p className="text-xs text-slate-500">{photo.vehicle}</p>
              <span className={`text-xs px-2 py-0.5 rounded mt-1 inline-block ${
                photo.type === 'antes' ? 'bg-amber-500/10 text-amber-400' : 'bg-emerald-500/10 text-emerald-400'
              }`}>
                {photo.type}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
