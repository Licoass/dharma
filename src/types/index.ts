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
}

export type NavTab = 'inicio' | 'tareas' | 'capturar' | 'calendario' | 'mas';

export type ViewMode = 'lista' | 'kanban';

export type CalendarViewMode = 'mes' | 'semana' | 'agenda';

export type DharmaCoreMood = 'calm' | 'focus' | 'celebrate' | 'syncing' | 'idle';

export interface TaskFilters {
  search: string;
  categoryId: string | 'todas';
  statusId: string | 'todas' | 'activas';
  priority: TaskPriority | 'todas';
}
