import React, { useState, useEffect } from 'react';
import { TaskProvider, useTaskContext } from './context/TaskContext';
import { AppShell } from './components/layout/AppShell';
import { Dashboard } from './components/dashboard/Dashboard';
import { TasksView } from './components/tasks/TasksView';
import { CalendarView } from './components/calendar/CalendarView';
import { TransmissionsView } from './components/transmissions/TransmissionsView';
import { RecordsView } from './components/records/RecordsView';
import { ArchiveView } from './components/archive/ArchiveView';
import { LibraryView } from './components/books/LibraryView';
import { MoreView } from './components/more/MoreView';
import { QuickCaptureModal } from './components/capture/QuickCaptureModal';
import { TaskFormModal } from './components/tasks/TaskFormModal';
import { DharmaCoreModal } from './components/dharmaCore/DharmaCoreModal';
import { AudioCaptureModal } from './components/audio/AudioCaptureModal';
import { OmniSearchModal } from './components/search/OmniSearchModal';
import { PwaInstallBanner } from './components/common/PwaInstallBanner';
import type { NavTab, Task } from './types';

const MainLayout: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<NavTab>('inicio');
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [defaultStatusForNew, setDefaultStatusForNew] = useState<string>('por_hacer');

  const { 
    addTask, 
    updateTask, 
    setIsQuickCaptureOpen, 
    openDharmaCore,
    isDharmaCoreModalOpen, 
    closeDharmaCore, 
    dharmaCoreInitialText,
    openAudioCapture,
    isAudioCaptureOpen,
    closeAudioCapture,
    isOmniSearchOpen,
    closeOmniSearch
  } = useTaskContext();

  // Soporte para accesos directos nativos de Android (PWA Shortcuts en pantalla de inicio)
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const action = params.get('action');
      const tabParam = params.get('tab') as NavTab | null;

      if (tabParam) setCurrentTab(tabParam);
      if (action === 'capture') setIsQuickCaptureOpen(true);
      if (action === 'audio') openAudioCapture();
      if (action === 'core') openDharmaCore();
      if (action === 'new') handleOpenCreateTask('por_hacer');
    } catch (_) {}
  }, []);

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
      {/* Banner de instalación Android PWA */}
      <PwaInstallBanner />

      {/* Dynamic View Content */}
      {currentTab === 'inicio' && (
        <Dashboard
          onNavigateTab={setCurrentTab}
          onOpenCreateTask={() => handleOpenCreateTask('por_hacer')}
          onEditTask={handleEditTask}
        />
      )}

      {currentTab === 'transmisiones' && <TransmissionsView onNavigateTab={setCurrentTab} />}

      {currentTab === 'tareas' && (
        <TasksView
          onOpenCreateTask={(statusId) => handleOpenCreateTask(statusId || 'por_hacer')}
          onEditTask={handleEditTask}
        />
      )}

      {currentTab === 'calendario' && <CalendarView onEditTask={handleEditTask} />}

      {currentTab === 'registros' && <RecordsView onNavigateTab={setCurrentTab} />}

      {currentTab === 'archivo' && <ArchiveView onNavigateTab={setCurrentTab} />}

      {currentTab === 'biblioteca' && <LibraryView onNavigateTab={setCurrentTab} />}

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

      <DharmaCoreModal
        isOpen={isDharmaCoreModalOpen}
        onClose={closeDharmaCore}
        initialText={dharmaCoreInitialText}
      />

      <AudioCaptureModal
        isOpen={isAudioCaptureOpen}
        onClose={closeAudioCapture}
      />

      <OmniSearchModal
        isOpen={isOmniSearchOpen}
        onClose={closeOmniSearch}
        onNavigateTab={setCurrentTab}
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
