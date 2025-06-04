import React from 'react';

export default function SettingsSidebar() {
  return (
    <div className="fixed w-64 bg-gray-100 p-4 text-sm font-medium border-r border-gray-200 h-full">
      <div className="mb-2">General</div>
      <div className="mb-2">Profile</div>
      <div className="mb-2">Security</div>
      <div className="mb-2">Notifications</div>
    </div>
  );
}
