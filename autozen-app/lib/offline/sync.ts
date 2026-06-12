'use client';

import { getPendingSyncs, markSynced } from './db';
import { getSupabaseClient } from '../supabaseClient';

export async function syncPendingActions() {
  const pending = await getPendingSyncs();
  if (pending.length === 0) return;

  const supabase = getSupabaseClient();
  if (!supabase) return;

  for (const action of pending) {
    try {
      switch (action.action) {
        case 'insert': {
          const { error } = await supabase.from(action.table).insert(action.data);
          if (!error) await markSynced(action.id);
          break;
        }
        case 'update': {
          const { id, ...rest } = action.data as { id: string; [key: string]: unknown };
          const { error } = await supabase.from(action.table).update(rest).eq('id', id);
          if (!error) await markSynced(action.id);
          break;
        }
        case 'delete': {
          const { error } = await supabase.from(action.table).delete().eq('id', action.data.id);
          if (!error) await markSynced(action.id);
          break;
        }
      }
    } catch {
      // Will retry on next sync cycle
      console.warn(`Sync failed for action ${action.id}, will retry`);
    }
  }
}

// Auto-sync when online
export function initAutoSync() {
  if (typeof window === 'undefined') return;

  window.addEventListener('online', () => {
    syncPendingActions();
  });

  // Periodic sync every 30 seconds when online
  setInterval(() => {
    if (navigator.onLine) {
      syncPendingActions();
    }
  }, 30000);
}
