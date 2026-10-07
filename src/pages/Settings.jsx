import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { resetAccount } from '../utils/storage';
import { Moon, Sun, Bell, AlertTriangle } from 'lucide-react';

export default function Settings() {
  const { user, settings, updateSettings } = useAuth();
  const { addToast } = useToast();

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset your demo account? All portfolio data, orders, and transactions will be deleted. Balance will be reset to ₹10,00,000.')) {
      resetAccount(user.id);
      addToast('Account reset successfully. Refreshing...', 'success');
      setTimeout(() => window.location.reload(), 1500);
    }
  };

  return (
    <div className="page">
      <h1 className="page-title">Settings</h1>
      <p className="page-subtitle">Configure your trading experience.</p>

      <div className="card" style={{maxWidth: 600, marginBottom: 24}}>
        <h3 className="card-title">Preferences</h3>
        
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid var(--border)'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
            {settings.darkMode ? <Moon size={20} /> : <Sun size={20} />}
            <div>
              <div style={{fontWeight: 600}}>Dark Mode</div>
              <div className="text-muted" style={{fontSize: '0.85rem'}}>Toggle dark/light theme</div>
            </div>
          </div>
          <label className="switch">
            <input type="checkbox" checked={settings.darkMode} onChange={e => updateSettings({...settings, darkMode: e.target.checked})} />
            <span className="slider round"></span>
          </label>
        </div>

        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
            <Bell size={20} />
            <div>
              <div style={{fontWeight: 600}}>Notifications</div>
              <div className="text-muted" style={{fontSize: '0.85rem'}}>Enable toast notifications</div>
            </div>
          </div>
          <label className="switch">
            <input type="checkbox" checked={settings.notifications} onChange={e => updateSettings({...settings, notifications: e.target.checked})} />
            <span className="slider round"></span>
          </label>
        </div>
      </div>

      <div className="card" style={{maxWidth: 600, border: '1px solid #ef4444'}}>
        <h3 className="card-title" style={{color: '#ef4444', display: 'flex', alignItems: 'center', gap: 8}}><AlertTriangle size={20} /> Danger Zone</h3>
        <p className="text-muted" style={{marginBottom: 16}}>Resetting your account will erase all your trading history and reset your virtual balance to ₹10,00,000.</p>
        <button className="btn-danger" onClick={handleReset}>Reset Demo Account</button>
      </div>
    </div>
  );
}
