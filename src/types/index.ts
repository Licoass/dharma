export interface Category {
  id: string;
  name: string;
  color: string;
  bgSoft: string;
  borderColor: string;
  textColor: string;
  description?: string;
}

export interface TaskStatusItem {
  id: string;
  name: string;
  color: string;
  bgSoft: string;
  textColor: string;
  order: number;
}

export type TaskPriority = 'baja' | 'media' | 'alta' | 'vital';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  categoryId: string; // Referencia configurable a Category.id
  statusId: string;   // Referencia configurable a TaskStatusItem.id
  priority: TaskPriority;
  dueDate?: string;
  dueTime?: string;
  tags?: string[];
  subtasks?: Subtask[];
  notes?: string;
  origin?: string; // 'manual' | 'captura_rapida' | etc.
  createdAt: string;
  completedAt?: string;
  estimatedMinutes?: number;
  protocolCode?: string;
}

export type ActivityType = 'tarea' | 'evento' | 'recordatorio';

export interface AgendaEvent {
  id: string;
  title: string;
  description?: string;
  time: string;
  date: string;
  location?: string;
  categoryId?: string;
  type?: 'evento' | 'recordatorio';
  isCompleted?: boolean;
}

export interface CalendarActivity {
  id: string;
  title: string;
  description?: string;
  date: string; // ISO YYYY-MM-DD
  time?: string;
  type: ActivityType;
  categoryId: string;
  location?: string;
  isCompleted?: boolean;
  priority?: TaskPriority;
  taskId?: string;
  eventId?: string;
  // Integración Google Calendar (FASE 10)
  source?: 'local' | 'google';
  isReadOnly?: boolean;
  googleEventId?: string;
  googleHtmlLink?: string;
  googleMeetLink?: string;
}

export * from './googleCalendar';

export interface NoteChecklistItem {
  id: string;
  title: string;
  completed: boolean;
}

export interface NoteLink {
  id: string;
  title: string;
  url: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  categoryId: string; // Referencia configurable a Category.id
  tags?: string[];
  links?: NoteLink[];
  checklist?: NoteChecklistItem[];
  isFavorite?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ArchiveItem {
  id: string;
  title: string;
  url: string;
  domain: string;
  description: string;
  imageUrl?: string;
  categoryId: string; // Referencia configurable a Category.id
  tags?: string[];
  isFavorite?: boolean;
  createdAt: string;
}

export type BookStatus = 'quiero_leer' | 'leyendo' | 'terminado' | 'abandonado';

export interface Book {
  id: string;
  title: string;
  author: string;
  coverUrl?: string;
  status: BookStatus;
  tags?: string[];
  pages?: number;
  currentPage?: number;
  rating?: number;
  notes?: string;
  isFavorite?: boolean;
  startedAt?: string;
  finishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type TransmissionType = 'texto' | 'audio' | 'enlace' | 'imagen';

export type TransmissionStatus = 'nueva' | 'procesando' | 'procesada' | 'archivada';

export interface Transmission {
  id: string;
  type: TransmissionType;
  title?: string;
  content: string;
  url?: string;
  durationSeconds?: number;
  status: TransmissionStatus;
  frequencyCode?: string;
  signalStrength?: number;
  createdAt: string;
  processedAt?: string;
}

export type NavTab = 'inicio' | 'transmisiones' | 'tareas' | 'capturar' | 'calendario' | 'registros' | 'archivo' | 'biblioteca' | 'mas';

export type ViewMode = 'lista' | 'kanban';

export type CalendarViewMode = 'mes' | 'semana' | 'agenda';

export type DharmaCoreMood = 'calm' | 'focus' | 'celebrate' | 'syncing' | 'idle';

export interface TaskFilters {
  search: string;
  categoryId: string | 'todas';
  statusId: string | 'todas' | 'activas';
  priority: TaskPriority | 'todas';
}

