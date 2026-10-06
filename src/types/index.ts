export type StationId = 'personal' | 'trabajo' | 'enfoque' | 'bienestar' | 'protocolos';

export interface Station {
  id: StationId;
  name: string;
  code: string; // e.g. "EST-01", subtle station identifier
  iconName: string;
  color: string;
  bgSoft: string;
  borderColor: string;
  textColor: string;
  description: string;
}

export type TaskStatus = 'pendiente' | 'en_curso' | 'completada' | 'archivada';

export type TaskPriority = 'baja' | 'media' | 'alta' | 'vital';

export interface Task {
  id: string;
  title: string;
  description?: string;
  stationId: StationId;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  createdAt: string;
  completedAt?: string;
  estimatedMinutes?: number;
  tags?: string[];
  protocolCode?: string; // e.g. "DHR-108", "PRT-42"
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
