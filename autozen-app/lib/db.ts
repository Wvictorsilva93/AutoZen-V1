'use client';

import { getSupabaseClient } from './supabaseClient';

/**
 * Camada de dados client-side do AutoZen.
 * - Todas as leituras já são isoladas por empresa via RLS (company_id).
 * - Inserts recebem company_id explícito (injetado pela página a partir do profile).
 * - Tratamento de erro padronizado + logs detalhados.
 */

export interface DbResult<T> {
  data: T | null;
  error: string | null;
}

function logError(op: string, table: string, error: unknown) {
  const msg = error instanceof Error ? error.message : JSON.stringify(error);
  console.error(`[db:${op}] ${table} ->`, msg);
  return msg;
}

export async function listRows<T>(
  table: string,
  options?: { orderBy?: string; ascending?: boolean }
): Promise<DbResult<T[]>> {
  const supabase = getSupabaseClient();
  if (!supabase) return { data: null, error: 'Supabase não configurado' };

  try {
    let query = supabase.from(table).select('*');
    if (options?.orderBy) {
      query = query.order(options.orderBy, { ascending: options.ascending ?? false });
    }
    const { data, error } = await query;
    if (error) return { data: null, error: logError('list', table, error) };
    return { data: (data as T[]) ?? [], error: null };
  } catch (e) {
    return { data: null, error: logError('list', table, e) };
  }
}

export async function insertRow<T>(
  table: string,
  values: Record<string, unknown>
): Promise<DbResult<T>> {
  const supabase = getSupabaseClient();
  if (!supabase) return { data: null, error: 'Supabase não configurado' };

  try {
    const { data, error } = await supabase.from(table).insert(values).select().single();
    if (error) return { data: null, error: logError('insert', table, error) };
    return { data: data as T, error: null };
  } catch (e) {
    return { data: null, error: logError('insert', table, e) };
  }
}

export async function updateRow<T>(
  table: string,
  id: string,
  values: Record<string, unknown>
): Promise<DbResult<T>> {
  const supabase = getSupabaseClient();
  if (!supabase) return { data: null, error: 'Supabase não configurado' };

  try {
    const { data, error } = await supabase
      .from(table)
      .update(values)
      .eq('id', id)
      .select()
      .single();
    if (error) return { data: null, error: logError('update', table, error) };
    return { data: data as T, error: null };
  } catch (e) {
    return { data: null, error: logError('update', table, e) };
  }
}

export async function deleteRow(table: string, id: string): Promise<DbResult<true>> {
  const supabase = getSupabaseClient();
  if (!supabase) return { data: null, error: 'Supabase não configurado' };

  try {
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (error) return { data: null, error: logError('delete', table, error) };
    return { data: true, error: null };
  } catch (e) {
    return { data: null, error: logError('delete', table, e) };
  }
}
