import React from 'react';
import { Sidebar } from '../navigation/Sidebar';
import { BottomNavigation } from '../navigation/BottomNavigation';
import { Header } from '../navigation/Header';
import type { NavTab } from '../../types';

export interface AppShellProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  onOpenQuickCapture: () => void;
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({
  currentTab,
  onTabChange,
  onOpenQuickCapture,
  children,
}) => {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#24292F] flex flex-col antialiased selection:bg-[#E8F6F4] selection:text-[#177468]">
      {/* 1. Desktop & Tablet Sidebar */}
      <Sidebar currentTab={currentTab} onTabChange={onTabChange} />

      {/* 2. Main Content Container */}
      <div className="flex-1 flex flex-col md:pl-20 lg:pl-64 transition-all duration-300">
        {/* Header */}
        <Header currentTab={currentTab} onOpenQuickCapture={onOpenQuickCapture} />

        {/* Dynamic Page Content */}
        <main className="flex-1 px-4 sm:px-8 py-5 sm:py-7 max-w-5xl w-full mx-auto pb-28 md:pb-12">
          {children}
        </main>
      </div>

      {/* 3. Mobile Bottom Navigation */}
      <BottomNavigation currentTab={currentTab} onTabChange={onTabChange} />
    </div>
  );
};
