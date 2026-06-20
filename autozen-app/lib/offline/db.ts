'use client';

import { openDB, type IDBPDatabase } from 'idb';

const DB_NAME = 'autozen-offline';
const DB_VERSION = 1;

export interface OfflineAction {
  id: string;
  table: string;
  action: 'insert' | 'update' | 'delete';
  data: Record<string, unknown>;
  timestamp: number;
  synced: boolean;
}

let dbInstance: IDBPDatabase | null = null;

export async function getOfflineDB() {
  if (dbInstance) return dbInstance;

  dbInstance = await openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Pending sync queue
      if (!db.objectStoreNames.contains('sync_queue')) {
        const syncStore = db.createObjectStore('sync_queue', { keyPath: 'id' });
        syncStore.createIndex('by_timestamp', 'timestamp');
        syncStore.createIndex('by_synced', 'synced');
      }

      // Local cache stores
      const stores = [
        'clients',
        'vehicles',
        'services',
        'orders',
        'appointments',
        'inventory',
        'financial_entries',
      ];

      for (const storeName of stores) {
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName, { keyPath: 'id' });
        }
      }
    },
  });

  return dbInstance;
}

export async function addToSyncQueue(action: Omit<OfflineAction, 'id' | 'timestamp' | 'synced'>) {
  const db = await getOfflineDB();
  const entry: OfflineAction = {
    ...action,
    id: crypto.randomUUID(),
    timestamp: Date.now(),
    synced: false,
  };
  await db.put('sync_queue', entry);
  return entry;
}

export async function getPendingSyncs(): Promise<OfflineAction[]> {
  const db = await getOfflineDB();
  const index = db.transaction('sync_queue').store.index('by_synced');
  return index.getAll(IDBKeyRange.only(false));
}

export async function markSynced(id: string) {
  const db = await getOfflineDB();
  const tx = db.transaction('sync_queue', 'readwrite');
  const entry = await tx.store.get(id);
  if (entry) {
    entry.synced = true;
    await tx.store.put(entry);
  }
  await tx.done;
}

export async function cacheData(storeName: string, data: Record<string, unknown>[]) {
  const db = await getOfflineDB();
  const tx = db.transaction(storeName, 'readwrite');
  for (const item of data) {
    await tx.store.put(item);
  }
  await tx.done;
}

export async function getCachedData<T>(storeName: string): Promise<T[]> {
  const db = await getOfflineDB();
  return db.getAll(storeName) as Promise<T[]>;
}
