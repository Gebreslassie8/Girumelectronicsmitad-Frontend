'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

export default function DashboardLayout({ children, title = 'ዳሽቦርድ' }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={() => setOpen(true)} title={title} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}