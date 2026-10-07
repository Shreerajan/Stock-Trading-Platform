import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div style={{display: 'flex', minHeight: '100vh'}}>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div style={{flex: 1, marginLeft: window.innerWidth > 768 ? 250 : 0, display: 'flex', flexDirection: 'column'}}>
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <main style={{flex: 1, padding: 24, overflowY: 'auto'}}><Outlet /></main>
      </div>
    </div>
  );
}