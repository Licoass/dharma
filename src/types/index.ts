export type StationId = 'personal' | 'trabajo' | 'enfoque' | 'bienestar' | 'protocolos';

export interface Station {
  id: StationId;
  name: string;
  code: string;
  iconName: string;
  color: string;
  bgSoft: string;
  borderColor: string;
  textColor: string;
  description: string;
}

export type TaskStatus = 'pendiente' | 'en_curso' | 'en_espera' | 'completada' | 'archivada';

export type TaskPriority = 'baja' | 'media' | 'alta' | 'vital';

export interface Task {
  id: string;
  title: string;
  description?: string;
  stationId: StationId;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  dueTime?: string;
  createdAt: string;
  completedAt?: string;
  estimatedMinutes?: number;
  tags?: string[];
  protocolCode?: string;
}

export interface AgendaEvent {
  id: string;
  title: string;
  time: string;
  date: string;
  location?: string;
  stationId: StationId;
}

export type NavTab = 'inicio' | 'tareas' | 'capturar' | 'calendario' | 'mas';

export type ViewMode = 'lista' | 'kanban';

export type DharmaCoreMood = 'calm' | 'focus' | 'celebrate' | 'syncing' | 'idle';

export interface TaskFilters {
  search: string;
  stationId: StationId | 'todas';
  status: TaskStatus | 'activas' | 'todas';
  priority: TaskPriority | 'todas';
}
