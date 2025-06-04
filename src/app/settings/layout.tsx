import React from 'react'
import SettingsSidebar from '@/components/settings/SettingsSidebar';

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <SettingsSidebar />
      <main className="flex-1 overflow-y-auto bg-white p-6">
        {children}
      </main>
    </div>
  );
}