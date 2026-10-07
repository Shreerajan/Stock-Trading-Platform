import { useAuth } from '../context/AuthContext';
import { Menu, Sun, Moon } from 'lucide-react';
export default function Navbar({ onMenuClick }) {
  const { user, settings, updateSettings } = useAuth();
  return (
    <header style={{height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', background: 'var(--card-bg)', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 50}}>
      <button onClick={onMenuClick} style={{background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', display: window.innerWidth <= 768 ? 'block' : 'none'}}><Menu size={20} /></button>
      <div style={{marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 16}}>
        <button onClick={() => updateSettings({...settings, darkMode: !settings.darkMode})} style={{background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer'}}>
          {settings.darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
          <div style={{width: 32, height: 32, borderRadius: '50%', background: 'var(--accent)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: '0.9rem'}}>{user?.name?.[0] || 'U'}</div>
          <span style={{fontWeight: 500, display: window.innerWidth <= 768 ? 'none' : 'block'}}>{user?.name}</span>
        </div>
      </div>
    </header>
  );
}