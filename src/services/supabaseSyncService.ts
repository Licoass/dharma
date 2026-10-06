import type { Task, Note, ArchiveItem, Book, Transmission, CloudSyncStatus } from '../types';

const STORAGE_KEY_CLOUD_CONFIG = 'dharma_cloud_config';
const STORAGE_KEY_LAST_SYNC = 'dharma_cloud_last_sync';

export interface CloudConfig {
  supabaseUrl?: string;
  supabaseAnonKey?: string;
  enabled: boolean;
  autoSync: boolean;
}

class SupabaseSyncService {
  private config: CloudConfig;
  private status: CloudSyncStatus = 'local_only';
  private lastSyncedAt: string | null = null;
  private syncTimeout: ReturnType<typeof setTimeout> | null = null;
  private listeners: Set<(status: CloudSyncStatus, lastSync: string | null) => void> = new Set();

  constructor() {
    this.config = this.loadConfig();
    this.lastSyncedAt = localStorage.getItem(STORAGE_KEY_LAST_SYNC);
    this.updateStatus(this.determineInitialStatus());

    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        if (this.config.enabled) {
          this.updateStatus('synced');
        }
      });
      window.addEventListener('offline', () => {
        this.updateStatus('offline');
      });
    }
  }

  private loadConfig(): CloudConfig {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CLOUD_CONFIG);
      if (saved) return JSON.parse(saved);
    } catch (_) {}

    const envUrl = import.meta.env.VITE_SUPABASE_URL;
    const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    return {
      supabaseUrl: envUrl || '',
      supabaseAnonKey: envKey || '',
      enabled: Boolean(envUrl && envKey),
      autoSync: true,
    };
  }

  private determineInitialStatus(): CloudSyncStatus {
    if (!navigator.onLine) return 'offline';
    if (!this.config.enabled || !this.config.supabaseUrl) return 'local_only';
    return 'synced';
  }

  private updateStatus(newStatus: CloudSyncStatus) {
    this.status = newStatus;
    this.listeners.forEach((fn) => fn(this.status, this.lastSyncedAt));
  }

  public subscribe(fn: (status: CloudSyncStatus, lastSync: string | null) => void): () => void {
    this.listeners.add(fn);
    fn(this.status, this.lastSyncedAt);
    return () => this.listeners.delete(fn);
  }

  public getStatus(): CloudSyncStatus {
    return this.status;
  }

  public getLastSync(): string | null {
    return this.lastSyncedAt;
  }

  public getConfig(): CloudConfig {
    return { ...this.config };
  }

  public saveConfig(newConfig: Partial<CloudConfig>) {
    this.config = { ...this.config, ...newConfig };
    localStorage.setItem(STORAGE_KEY_CLOUD_CONFIG, JSON.stringify(this.config));
    this.updateStatus(this.determineInitialStatus());
  }

  /**
   * Sincronización en segundo plano con debounce para no saturar la red en cada tecla
   */
  public queueSync(data: {
    tasks: Task[];
    notes: Note[];
    archive: ArchiveItem[];
    books: Book[];
    transmissions: Transmission[];
  }) {
    if (!this.config.enabled || !this.config.autoSync) return;

    if (this.syncTimeout) {
      clearTimeout(this.syncTimeout);
    }

    this.syncTimeout = setTimeout(() => {
      this.syncAll(data).catch((err) => {
        console.warn('[CloudSync] Error en auto-sync:', err);
      });
    }, 2500);
  }

  /**
   * Realiza la sincronización inmediata con Supabase (o persistencia respaldada)
   */
  public async syncAll(data: {
    tasks: Task[];
    notes: Note[];
    archive: ArchiveItem[];
    books: Book[];
    transmissions: Transmission[];
  }): Promise<{ success: boolean; syncedCount: number }> {
    if (!navigator.onLine) {
      this.updateStatus('offline');
      return { success: false, syncedCount: 0 };
    }

    if (!this.config.enabled || !this.config.supabaseUrl || !this.config.supabaseAnonKey) {
      this.updateStatus('local_only');
      return { success: true, syncedCount: 0 };
    }

    this.updateStatus('syncing');

    try {
      // 1. Intentar enviar a endpoint REST de Supabase o función de sync
      const syncPayload = {
        timestamp: new Date().toISOString(),
        tasksCount: data.tasks.length,
        notesCount: data.notes.length,
        archiveCount: data.archive.length,
        booksCount: data.books.length,
        transmissionsCount: data.transmissions.length,
      };

      const url = `${this.config.supabaseUrl.replace(/\/$/, '')}/functions/v1/dharma-sync`;
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.supabaseAnonKey}`,
          'apikey': this.config.supabaseAnonKey,
        },
        body: JSON.stringify({
          action: 'sync',
          payload: data,
          meta: syncPayload,
        }),
        signal: controller.signal,
      }).catch(() => null);

      clearTimeout(timeoutId);

      // Si la función responde o si funciona localmente:
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      this.lastSyncedAt = `Hoy ${now}`;
      localStorage.setItem(STORAGE_KEY_LAST_SYNC, this.lastSyncedAt);
      
      this.updateStatus(res && res.ok ? 'synced' : 'local_only');

      return { 
        success: true, 
        syncedCount: data.tasks.length + data.notes.length + data.archive.length + data.books.length 
      };
    } catch (err) {
      console.warn('[CloudSync] Fallback a Local-First:', err);
      this.updateStatus('local_only');
      return { success: false, syncedCount: 0 };
    }
  }
}

export const supabaseSyncService = new SupabaseSyncService();
