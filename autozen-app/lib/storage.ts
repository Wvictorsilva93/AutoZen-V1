'use client';

import { getSupabaseClient } from './supabaseClient';

const BUCKET = 'os-photos';

/** Comprime/redimensiona a imagem no browser antes do upload (máx 1280px, JPEG ~0.8). */
export async function compressImage(file: File, maxSize = 1280, quality = 0.8): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      let { width, height } = img;
      if (width > height && width > maxSize) { height = (height * maxSize) / width; width = maxSize; }
      else if (height > maxSize) { width = (width * maxSize) / height; height = maxSize; }
      const canvas = document.createElement('canvas');
      canvas.width = width; canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error('Canvas indisponível'));
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error('Falha ao comprimir')), 'image/jpeg', quality);
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Imagem inválida')); };
    img.src = url;
  });
}

export interface UploadResult { url: string | null; error: string | null }

export async function uploadOsPhoto(
  companyId: string, osId: string, type: 'before' | 'after', file: File
): Promise<UploadResult> {
  const supabase = getSupabaseClient();
  if (!supabase) return { url: null, error: 'Supabase não configurado' };

  try {
    const blob = await compressImage(file);
    const path = `${companyId}/${osId}/${type}-${Date.now()}.jpg`;
    const { error: upErr } = await supabase.storage.from(BUCKET).upload(path, blob, {
      contentType: 'image/jpeg', upsert: false,
    });
    if (upErr) return { url: null, error: upErr.message };

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    return { url: data.publicUrl, error: null };
  } catch (e) {
    return { url: null, error: e instanceof Error ? e.message : 'Erro no upload' };
  }
}

export async function deleteStorageByUrl(publicUrl: string): Promise<void> {
  const supabase = getSupabaseClient();
  if (!supabase) return;
  const marker = `/${BUCKET}/`;
  const idx = publicUrl.indexOf(marker);
  if (idx === -1) return;
  const path = publicUrl.slice(idx + marker.length);
  await supabase.storage.from(BUCKET).remove([path]);
}
