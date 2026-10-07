import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, TrendingUp, Star, Briefcase, ArrowLeftRight, ClipboardList, Receipt, User, Settings, LogOut, BarChart3 } from 'lucide-react';

export default function Sidebar({ isOpen, onClose }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const links = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/markets', icon: TrendingUp, label: 'Markets' },
    { to: '/watchlist', icon: Star, label: 'Watchlist' },
    { to: '/portfolio', icon: Briefcase, label: 'Portfolio' },
    { to: '/trade', icon: ArrowLeftRight, label: 'Trade' },
    { to: '/orders', icon: ClipboardList, label: 'Orders' },
    { to: '/transactions', icon: Receipt, label: 'Transactions' },
    { to: '/profile', icon: User, label: 'Profile' },
    { to: '/settings', icon: Settings, label: 'Settings' }
  ];

  return (
    <aside style={{width: 250, height: '100vh', position: 'fixed', left: 0, top: 0, background: 'var(--card-bg)', borderRight: '1px solid var(--border)', display: isOpen || window.innerWidth > 768 ? 'flex' : 'none', flexDirection: 'column', zIndex: 100}}>
      <div style={{padding: 20, display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid var(--border)'}}>
        <BarChart3 size={24} color="var(--accent)" />
        <span style={{fontSize: '1.2rem', fontWeight: 700}}>TradeX</span>
        {window.innerWidth <= 768 && <button onClick={onClose} style={{marginLeft:'auto',background:'none',border:'none',color:'var(--text-primary)',fontSize:20}}>&times;</button>}
      </div>
      <nav style={{padding: 10, flex: 1, display: 'flex', flexDirection: 'column', gap: 5, overflowY: 'auto'}}>
        {links.map(l => (
          <NavLink key={l.to} to={l.to} onClick={onClose} style={({isActive}) => ({display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 8, textDecoration: 'none', color: isActive ? 'var(--accent)' : 'var(--text-secondary)', background: isActive ? 'var(--accent-bg)' : 'transparent', fontWeight: 500})}>
            <l.icon size={18} /> {l.label}
          </NavLink>
        ))}
        <button onClick={() => { logout(); navigate('/'); }} style={{marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 8, border: 'none', background: 'transparent', color: '#ef4444', fontWeight: 500, cursor: 'pointer', textAlign: 'left'}}>
          <LogOut size={18} /> Logout
        </button>
      </nav>
    </aside>
  );
}