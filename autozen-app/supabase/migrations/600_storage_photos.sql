-- Políticas de Storage para o bucket os-photos
-- Permite usuário autenticado enviar/ler/excluir fotos. Leitura pública (bucket public).

DROP POLICY IF EXISTS "os_photos_auth_insert" ON storage.objects;
CREATE POLICY "os_photos_auth_insert" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'os-photos');

DROP POLICY IF EXISTS "os_photos_auth_select" ON storage.objects;
CREATE POLICY "os_photos_auth_select" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'os-photos');

DROP POLICY IF EXISTS "os_photos_public_select" ON storage.objects;
CREATE POLICY "os_photos_public_select" ON storage.objects FOR SELECT TO anon
  USING (bucket_id = 'os-photos');

DROP POLICY IF EXISTS "os_photos_auth_delete" ON storage.objects;
CREATE POLICY "os_photos_auth_delete" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'os-photos');
