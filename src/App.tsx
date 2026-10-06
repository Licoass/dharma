import React, { useState } from 'react';
import { TaskProvider, useTaskContext } from './context/TaskContext';
import { AppShell } from './components/layout/AppShell';
import { Dashboard } from './components/dashboard/Dashboard';
import { TasksView } from './components/tasks/TasksView';
import { CalendarView } from './components/calendar/CalendarView';
import { RecordsView } from './components/records/RecordsView';
import { ArchiveView } from './components/archive/ArchiveView';
import { MoreView } from './components/more/MoreView';
import { QuickCaptureModal } from './components/capture/QuickCaptureModal';
import { TaskFormModal } from './components/tasks/TaskFormModal';
import type { NavTab, Task } from './types';

const MainLayout: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<NavTab>('inicio');
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [defaultStatusForNew, setDefaultStatusForNew] = useState<string>('por_hacer');

  const { addTask, updateTask, setIsQuickCaptureOpen } = useTaskContext();

  const handleOpenCreateTask = (statusId: string = 'por_hacer') => {
    setEditingTask(null);
    setDefaultStatusForNew(statusId);
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
          onOpenCreateTask={() => handleOpenCreateTask('por_hacer')}
          onEditTask={handleEditTask}
        />
      )}

      {currentTab === 'tareas' && (
        <TasksView
          onOpenCreateTask={(statusId) => handleOpenCreateTask(statusId || 'por_hacer')}
          onEditTask={handleEditTask}
        />
      )}

      {currentTab === 'calendario' && <CalendarView onEditTask={handleEditTask} />}

      {currentTab === 'registros' && <RecordsView onNavigateTab={setCurrentTab} />}

      {currentTab === 'archivo' && <ArchiveView onNavigateTab={setCurrentTab} />}

      {currentTab === 'mas' && <MoreView onNavigateTab={setCurrentTab} />}

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
        defaultStatusId={defaultStatusForNew}
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
