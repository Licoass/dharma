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
    <div className="min-h-screen bg-[#F8F4E8] text-[#171717] flex flex-col antialiased selection:bg-[#FFD84D]/40 selection:text-[#171717]">
      {/* 1. Desktop & Tablet Sidebar */}
      <Sidebar currentTab={currentTab} onTabChange={onTabChange} />

      {/* 2. Main Content Container */}
      <div className="flex-1 flex flex-col md:pl-20 desktop:pl-64 transition-all duration-300">
        {/* Header */}
        <Header currentTab={currentTab} onOpenQuickCapture={onOpenQuickCapture} />

        {/* Dynamic Page Content (Optimized for Mobile, Tablet, and Desktop) */}
        <main className="flex-1 px-4 sm:px-6 md:px-7 desktop:px-8 py-5 sm:py-7 max-w-5xl md:max-w-6xl desktop:max-w-7xl w-full mx-auto pb-28 md:pb-12">
          {children}
        </main>
      </div>

      {/* 3. Mobile Bottom Navigation */}
      <BottomNavigation currentTab={currentTab} onTabChange={onTabChange} />
    </div>
  );
};
