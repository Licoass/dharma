import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import type { 
  Task, 
  TaskFilters, 
  ViewMode, 
  CalendarViewMode, 
  DharmaCoreMood, 
  AgendaEvent, 
  CalendarActivity,
  Category, 
  TaskStatusItem 
} from '../types';
import { INITIAL_TASKS } from '../data/initialTasks';
import { INITIAL_CATEGORIES } from '../data/initialCategories';
import { INITIAL_STATUSES } from '../data/initialStatuses';
import { INITIAL_AGENDA_EVENTS } from '../data/agendaEvents';
import { normalizeDateToISO, getTodayISO } from '../utils/dateUtils';

interface TaskContextType {
  tasks: Task[];
  filteredTasks: Task[];
  categories: Category[];
  statuses: TaskStatusItem[];
  agendaEvents: AgendaEvent[];
  calendarActivities: CalendarActivity[];
  filters: TaskFilters;
  viewMode: ViewMode;
  calendarViewMode: CalendarViewMode;
  selectedCalendarDate: string;
  dharmaMood: DharmaCoreMood;
  isQuickCaptureOpen: boolean;
  setFilters: React.Dispatch<React.SetStateAction<TaskFilters>>;
  setViewMode: (mode: ViewMode) => void;
  setCalendarViewMode: (mode: CalendarViewMode) => void;
  setSelectedCalendarDate: (date: string) => void;
  setDharmaMood: (mood: DharmaCoreMood) => void;
  setIsQuickCaptureOpen: (open: boolean) => void;
  
  // Task operations
  addTask: (taskData: Omit<Task, 'id' | 'createdAt'>) => Task;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskComplete: (id: string) => void;
  changeTaskStatus: (id: string, newStatusId: string) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  
  // Event & Reminder operations
  addEvent: (eventData: Omit<AgendaEvent, 'id'>) => AgendaEvent;
  updateEvent: (id: string, updates: Partial<AgendaEvent>) => void;
  deleteEvent: (id: string) => void;
  toggleEventComplete: (id: string) => void;

  // Configurable Category operations
  addCategory: (category: Omit<Category, 'id'>) => Category;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  
  // Configurable Status operations
  addStatus: (status: Omit<TaskStatusItem, 'id'>) => TaskStatusItem;
  updateStatus: (id: string, updates: Partial<TaskStatusItem>) => void;
  deleteStatus: (id: string) => void;
  
  resetToDefaults: () => void;
  getCategoryById: (id: string) => Category | undefined;
  getStatusById: (id: string) => TaskStatusItem | undefined;
  
  metrics: {
    total: number;
    completed: number;
    pending: number;
    inProgress: number;
    waiting: number;
    vital: number;
    completionPercentage: number;
    byStatus: Record<string, number>;
  };
}

const STORAGE_KEY_TASKS = 'dharma_tasks_v3';
const STORAGE_KEY_CATEGORIES = 'dharma_categories_v3';
const STORAGE_KEY_STATUSES = 'dharma_statuses_v3';
const STORAGE_KEY_EVENTS = 'dharma_events_v3';

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Configurable Categories
  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CATEGORIES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load categories', e);
    }
    return INITIAL_CATEGORIES;
  });

  // 2. Configurable Statuses
  const [statuses, setStatuses] = useState<TaskStatusItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_STATUSES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load statuses', e);
    }
    return INITIAL_STATUSES;
  });

  // 3. Tasks
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TASKS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load tasks', e);
    }
    return INITIAL_TASKS;
  });

  // 4. Agenda Events & Reminders
  const [agendaEvents, setAgendaEvents] = useState<AgendaEvent[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_EVENTS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load events', e);
    }
    return INITIAL_AGENDA_EVENTS;
  });

  const [filters, setFilters] = useState<TaskFilters>({
    search: '',
    categoryId: 'todas',
    statusId: 'todas',
    priority: 'todas',
  });

  const [viewMode, setViewMode] = useState<ViewMode>('lista');
  const [calendarViewMode, setCalendarViewMode] = useState<CalendarViewMode>(() => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 768) return 'agenda';
      if (window.innerWidth < 1024) return 'semana';
    }
    return 'mes';
  });
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<string>(getTodayISO);

  const [dharmaMood, setDharmaMood] = useState<DharmaCoreMood>('calm');
  const [isQuickCaptureOpen, setIsQuickCaptureOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(tasks));
      localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(categories));
      localStorage.setItem(STORAGE_KEY_STATUSES, JSON.stringify(statuses));
      localStorage.setItem(STORAGE_KEY_EVENTS, JSON.stringify(agendaEvents));
    } catch (e) {
      console.warn('Failed to save to localStorage', e);
    }
  }, [tasks, categories, statuses, agendaEvents]);

  const fireCelebration = () => {
    confetti({
      particleCount: 38,
      spread: 65,
      origin: { y: 0.8 },
      colors: ['#0D9488', '#5EEAD4', '#8B5CF6', '#FBBF24', '#38BDF8', '#10B981'],
      ticks: 180,
      gravity: 1.1,
      scalar: 0.85,
    });
  };

  const getCategoryById = (id: string) => {
    return categories.find((c) => c.id === id) || categories[0];
  };

  const getStatusById = (id: string) => {
    return statuses.find((s) => s.id === id) || statuses[0];
  };

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt'>): Task => {
    const newTask: Task = {
      ...taskData,
      id: `dhr-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      createdAt: new Date().toISOString(),
      protocolCode: taskData.protocolCode || `DHR-${Math.floor(10 + Math.random() * 90)}`,
      origin: taskData.origin || 'Manual',
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
          const isNowCompleted = t.statusId !== 'completado';
          if (isNowCompleted) {
            fireCelebration();
            setDharmaMood('celebrate');
            setTimeout(() => setDharmaMood('calm'), 3000);
          }
          return {
            ...t,
            statusId: isNowCompleted ? 'completado' : 'por_hacer',
            completedAt: isNowCompleted ? new Date().toISOString() : undefined,
          };
        }
        return t;
      })
    );
  };

  const changeTaskStatus = (id: string, newStatusId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          if (newStatusId === 'completado' && t.statusId !== 'completado') {
            fireCelebration();
            setDharmaMood('celebrate');
            setTimeout(() => setDharmaMood('calm'), 3000);
          }
          return {
            ...t,
            statusId: newStatusId,
            completedAt: newStatusId === 'completado' ? new Date().toISOString() : undefined,
          };
        }
        return t;
      })
    );
  };

  const toggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId && t.subtasks) {
          const updatedSubtasks = t.subtasks.map((st) =>
            st.id === subtaskId ? { ...st, completed: !st.completed } : st
          );
          return { ...t, subtasks: updatedSubtasks };
        }
        return t;
      })
    );
  };

  // Category operations
  const addCategory = (categoryData: Omit<Category, 'id'>): Category => {
    const newCategory: Category = {
      ...categoryData,
      id: `cat-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    };
    setCategories((prev) => [...prev, newCategory]);
    return newCategory;
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
  };

  const deleteCategory = (id: string) => {
    if (categories.length <= 1) return;
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  // Status operations
  const addStatus = (statusData: Omit<TaskStatusItem, 'id'>): TaskStatusItem => {
    const newStatus: TaskStatusItem = {
      ...statusData,
      id: `st-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    };
    setStatuses((prev) => [...prev, newStatus]);
    return newStatus;
  };

  const updateStatus = (id: string, updates: Partial<TaskStatusItem>) => {
    setStatuses((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
  };

  const deleteStatus = (id: string) => {
    if (statuses.length <= 1) return;
    setStatuses((prev) => prev.filter((s) => s.id !== id));
  };

  // Event and Reminder operations
  const addEvent = (eventData: Omit<AgendaEvent, 'id'>): AgendaEvent => {
    const newEvent: AgendaEvent = {
      ...eventData,
      id: `evt-${Date.now()}-${Math.random().toString(36).substr(2, 3)}`,
      type: eventData.type || 'evento',
    };
    setAgendaEvents((prev) => [newEvent, ...prev]);
    return newEvent;
  };

  const updateEvent = (id: string, updates: Partial<AgendaEvent>) => {
    setAgendaEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...updates } : e))
    );
  };

  const deleteEvent = (id: string) => {
    setAgendaEvents((prev) => prev.filter((e) => e.id !== id));
  };

  const toggleEventComplete = (id: string) => {
    setAgendaEvents((prev) =>
      prev.map((e) => {
        if (e.id === id) {
          const isNowDone = !e.isCompleted;
          if (isNowDone) {
            fireCelebration();
            setDharmaMood('celebrate');
            setTimeout(() => setDharmaMood('calm'), 2500);
          }
          return { ...e, isCompleted: isNowDone };
        }
        return e;
      })
    );
  };

  const resetToDefaults = () => {
    setTasks(INITIAL_TASKS);
    setCategories(INITIAL_CATEGORIES);
    setStatuses(INITIAL_STATUSES);
    setAgendaEvents(INITIAL_AGENDA_EVENTS);
    setSelectedCalendarDate(getTodayISO());
    setFilters({
      search: '',
      categoryId: 'todas',
      statusId: 'todas',
      priority: 'todas',
    });
    setDharmaMood('calm');
  };

  // Unified Calendar Activities (Tasks with date + Agenda Events + Reminders)
  const calendarActivities: CalendarActivity[] = useMemo(() => {
    const taskActivities: CalendarActivity[] = tasks
      .filter((t) => !!t.dueDate)
      .map((t) => ({
        id: `act-task-${t.id}`,
        title: t.title,
        description: t.description,
        date: normalizeDateToISO(t.dueDate),
        time: t.dueTime,
        type: 'tarea' as const,
        categoryId: t.categoryId,
        isCompleted: t.statusId === 'completado',
        priority: t.priority,
        taskId: t.id,
      }));

    const eventActivities: CalendarActivity[] = agendaEvents.map((e) => ({
      id: `act-evt-${e.id}`,
      title: e.title,
      description: e.description,
      date: normalizeDateToISO(e.date),
      time: e.time,
      type: e.type || 'evento',
      categoryId: e.categoryId || 'cat-personal',
      location: e.location,
      isCompleted: !!e.isCompleted,
      eventId: e.id,
    }));

    return [...taskActivities, ...eventActivities].sort((a, b) => {
      if (a.date !== b.date) return a.date.localeCompare(b.date);
      const timeA = a.time || '23:59';
      const timeB = b.time || '23:59';
      return timeA.localeCompare(timeB);
    });
  }, [tasks, agendaEvents]);

  // Filter tasks based on search, categoryId, statusId, priority
  const filteredTasks = tasks.filter((t) => {
    if (filters.search.trim()) {
      const q = filters.search.toLowerCase().trim();
      const matchTitle = t.title.toLowerCase().includes(q);
      const matchDesc = t.description?.toLowerCase().includes(q);
      const matchTag = t.tags?.some((tag) => tag.toLowerCase().includes(q));
      const matchProtocol = t.protocolCode?.toLowerCase().includes(q);
      const matchNotes = t.notes?.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchTag && !matchProtocol && !matchNotes) {
        return false;
      }
    }

    if (filters.categoryId !== 'todas' && t.categoryId !== filters.categoryId) {
      return false;
    }

    if (filters.statusId === 'activas') {
      if (t.statusId === 'completado') return false;
    } else if (filters.statusId !== 'todas' && t.statusId !== filters.statusId) {
      return false;
    }

    if (filters.priority !== 'todas' && t.priority !== filters.priority) {
      return false;
    }

    return true;
  });

  // Calculate metrics
  const total = tasks.length;
  const completed = tasks.filter((t) => t.statusId === 'completado').length;
  const pending = tasks.filter((t) => t.statusId === 'por_hacer').length;
  const inProgress = tasks.filter((t) => t.statusId === 'en_proceso').length;
  const waiting = tasks.filter((t) => t.statusId === 'en_espera').length;
  const vital = tasks.filter((t) => t.priority === 'vital' && t.statusId !== 'completado').length;
  const completionPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  const byStatus: Record<string, number> = {};
  statuses.forEach((s) => {
    byStatus[s.id] = tasks.filter((t) => t.statusId === s.id).length;
  });

  return (
    <TaskContext.Provider
      value={{
        tasks,
        filteredTasks,
        categories,
        statuses,
        agendaEvents,
        calendarActivities,
        filters,
        viewMode,
        calendarViewMode,
        selectedCalendarDate,
        dharmaMood,
        isQuickCaptureOpen,
        setFilters,
        setViewMode,
        setCalendarViewMode,
        setSelectedCalendarDate,
        setDharmaMood,
        setIsQuickCaptureOpen,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskComplete,
        changeTaskStatus,
        toggleSubtask,
        addEvent,
        updateEvent,
        deleteEvent,
        toggleEventComplete,
        addCategory,
        updateCategory,
        deleteCategory,
        addStatus,
        updateStatus,
        deleteStatus,
        resetToDefaults,
        getCategoryById,
        getStatusById,
        metrics: {
          total,
          completed,
          pending,
          inProgress,
          waiting,
          vital,
          completionPercentage,
          byStatus,
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
