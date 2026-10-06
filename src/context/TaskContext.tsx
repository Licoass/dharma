import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import type { Task, TaskFilters, TaskStatus, ViewMode, DharmaCoreMood, AgendaEvent } from '../types';
import { INITIAL_TASKS } from '../data/initialTasks';
import { INITIAL_AGENDA_EVENTS } from '../data/agendaEvents';

interface TaskContextType {
  tasks: Task[];
  filteredTasks: Task[];
  agendaEvents: AgendaEvent[];
  filters: TaskFilters;
  viewMode: ViewMode;
  dharmaMood: DharmaCoreMood;
  isQuickCaptureOpen: boolean;
  setFilters: React.Dispatch<React.SetStateAction<TaskFilters>>;
  setViewMode: (mode: ViewMode) => void;
  setDharmaMood: (mood: DharmaCoreMood) => void;
  setIsQuickCaptureOpen: (open: boolean) => void;
  addTask: (taskData: Omit<Task, 'id' | 'createdAt'>) => Task;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskComplete: (id: string) => void;
  changeTaskStatus: (id: string, newStatus: TaskStatus) => void;
  resetToDefaults: () => void;
  metrics: {
    total: number;
    completed: number;
    pending: number;
    inProgress: number;
    waiting: number;
    vital: number;
    completionPercentage: number;
  };
}

const STORAGE_KEY = 'dharma_tasks_v1';

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to load tasks from localStorage', e);
    }
    return INITIAL_TASKS;
  });

  const [agendaEvents] = useState<AgendaEvent[]>(INITIAL_AGENDA_EVENTS);

  const [filters, setFilters] = useState<TaskFilters>({
    search: '',
    stationId: 'todas',
    status: 'todas',
    priority: 'todas',
  });

  const [viewMode, setViewMode] = useState<ViewMode>('lista');
  const [dharmaMood, setDharmaMood] = useState<DharmaCoreMood>('calm');
  const [isQuickCaptureOpen, setIsQuickCaptureOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (e) {
      console.warn('Failed to save tasks to localStorage', e);
    }
  }, [tasks]);

  const fireCelebration = () => {
    confetti({
      particleCount: 35,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#0D9488', '#5EEAD4', '#8B5CF6', '#FBBF24', '#38BDF8'],
      ticks: 180,
      gravity: 1.1,
      scalar: 0.85,
    });
  };

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt'>): Task => {
    const newTask: Task = {
      ...taskData,
      id: `dhr-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      createdAt: new Date().toISOString(),
      protocolCode: taskData.protocolCode || `DHR-${Math.floor(10 + Math.random() * 90)}`,
    };

    setTasks((prev) => [newTask, ...prev]);
    setDharmaMood('syncing');
    setTimeout(() => setDharmaMood('calm'), 1500);

    return newTask;
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleTaskComplete = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const isNowCompleted = t.status !== 'completada';
          if (isNowCompleted) {
            fireCelebration();
            setDharmaMood('celebrate');
            setTimeout(() => setDharmaMood('calm'), 3000);
          }
          return {
            ...t,
            status: isNowCompleted ? 'completada' : 'pendiente',
            completedAt: isNowCompleted ? new Date().toISOString() : undefined,
          };
        }
        return t;
      })
    );
  };

  const changeTaskStatus = (id: string, newStatus: TaskStatus) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          if (newStatus === 'completada' && t.status !== 'completada') {
            fireCelebration();
            setDharmaMood('celebrate');
            setTimeout(() => setDharmaMood('calm'), 3000);
          }
          return {
            ...t,
            status: newStatus,
            completedAt: newStatus === 'completada' ? new Date().toISOString() : undefined,
          };
        }
        return t;
      })
    );
  };

  const resetToDefaults = () => {
    setTasks(INITIAL_TASKS);
    setFilters({
      search: '',
      stationId: 'todas',
      status: 'todas',
      priority: 'todas',
    });
    setDharmaMood('calm');
  };

  // Filter tasks based on search, station, status, priority
  const filteredTasks = tasks.filter((t) => {
    if (filters.search.trim()) {
      const q = filters.search.toLowerCase().trim();
      const matchTitle = t.title.toLowerCase().includes(q);
      const matchDesc = t.description?.toLowerCase().includes(q);
      const matchTag = t.tags?.some((tag) => tag.toLowerCase().includes(q));
      const matchProtocol = t.protocolCode?.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchTag && !matchProtocol) {
        return false;
      }
    }

    if (filters.stationId !== 'todas' && t.stationId !== filters.stationId) {
      return false;
    }

    if (filters.status === 'activas') {
      if (t.status === 'completada' || t.status === 'archivada') return false;
    } else if (filters.status !== 'todas' && t.status !== filters.status) {
      return false;
    }

    if (filters.priority !== 'todas' && t.priority !== filters.priority) {
      return false;
    }

    return true;
  });

  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === 'completada').length;
  const pending = tasks.filter((t) => t.status === 'pendiente').length;
  const inProgress = tasks.filter((t) => t.status === 'en_curso').length;
  const waiting = tasks.filter((t) => t.status === 'en_espera').length;
  const vital = tasks.filter((t) => t.priority === 'vital' && t.status !== 'completada').length;
  const completionPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <TaskContext.Provider
      value={{
        tasks,
        filteredTasks,
        agendaEvents,
        filters,
        viewMode,
        dharmaMood,
        isQuickCaptureOpen,
        setFilters,
        setViewMode,
        setDharmaMood,
        setIsQuickCaptureOpen,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskComplete,
        changeTaskStatus,
        resetToDefaults,
        metrics: {
          total,
          completed,
          pending,
          inProgress,
          waiting,
          vital,
          completionPercentage,
        },
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};
