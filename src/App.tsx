import React, { useState } from 'react';
import { TaskProvider, useTaskContext } from './context/TaskContext';
import { AppShell } from './components/layout/AppShell';
import { Dashboard } from './components/dashboard/Dashboard';
import { TasksView } from './components/tasks/TasksView';
import { CalendarPlaceholderView } from './components/calendar/CalendarPlaceholderView';
import { MoreView } from './components/more/MoreView';
import { QuickCaptureModal } from './components/capture/QuickCaptureModal';
import { TaskFormModal } from './components/tasks/TaskFormModal';
import type { NavTab, Task, TaskStatus } from './types';

const MainLayout: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<NavTab>('inicio');
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [defaultStatusForNew, setDefaultStatusForNew] = useState<TaskStatus>('pendiente');

  const { addTask, updateTask, setIsQuickCaptureOpen } = useTaskContext();

  const handleOpenCreateTask = (status: TaskStatus = 'pendiente') => {
    setEditingTask(null);
    setDefaultStatusForNew(status);
    setIsTaskModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const handleSaveTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    if (editingTask) {
      updateTask(editingTask.id, taskData);
    } else {
      addTask(taskData);
    }
    setIsTaskModalOpen(false);
    setEditingTask(null);
  };

  return (
    <AppShell
      currentTab={currentTab}
      onTabChange={(tab) => {
        if (tab === 'capturar') {
          setIsQuickCaptureOpen(true);
        } else {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }}
      onOpenQuickCapture={() => setIsQuickCaptureOpen(true)}
    >
      {/* Dynamic View Content */}
      {currentTab === 'inicio' && (
        <Dashboard
          onNavigateTab={setCurrentTab}
          onOpenCreateTask={() => handleOpenCreateTask('pendiente')}
          onEditTask={handleEditTask}
        />
      )}

      {currentTab === 'tareas' && (
        <TasksView
          onOpenCreateTask={(status) => handleOpenCreateTask(status || 'pendiente')}
          onEditTask={handleEditTask}
        />
      )}

      {currentTab === 'calendario' && <CalendarPlaceholderView />}

      {currentTab === 'mas' && <MoreView />}

      {/* Modals */}
      <QuickCaptureModal />

      <TaskFormModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setEditingTask(null);
        }}
        onSubmit={handleSaveTask}
        initialTask={editingTask}
        defaultStatus={defaultStatusForNew}
      />
    </AppShell>
  );
};

export default function App() {
  return (
    <TaskProvider>
      <MainLayout />
    </TaskProvider>
  );
}
