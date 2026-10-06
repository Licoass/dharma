import React, { useState } from 'react';
import { TaskProvider, useTaskContext } from './context/TaskContext';
import { Navbar } from './components/navigation/Navbar';
import { Header } from './components/navigation/Header';
import { DashboardView } from './components/dashboard/DashboardView';
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
    <div className="min-h-screen bg-[#FAF9F6] text-[#1E293B] flex flex-col antialiased">
      {/* Navigation (Sidebar on Desktop/Tablet, Bottom Bar on Mobile) */}
      <Navbar
        currentTab={currentTab}
        onTabChange={(tab) => {
          if (tab === 'capturar') {
            setIsQuickCaptureOpen(true);
          } else {
            setCurrentTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
      />

      {/* Main Container adjusted for navigation offsets */}
      <div className="flex-1 flex flex-col md:pl-20 lg:pl-64 transition-all duration-300">
        {/* Top Header */}
        <Header
          currentTab={currentTab}
          onOpenQuickCapture={() => setIsQuickCaptureOpen(true)}
        />

        {/* Dynamic View Content */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-5 sm:py-7 max-w-6xl w-full mx-auto pb-28 md:pb-12">
          {currentTab === 'inicio' && (
            <DashboardView
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
        </main>
      </div>

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
    </div>
  );
};

export default function App() {
  return (
    <TaskProvider>
      <MainLayout />
    </TaskProvider>
  );
}
