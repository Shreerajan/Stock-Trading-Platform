import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { User, Mail, Calendar, Edit2 } from 'lucide-react';

export default function Profile() {
  const { user, setUser } = useAuth();
  const { addToast } = useToast();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');

  const handleSave = () => {
    if (!name.trim()) return addToast('Name cannot be empty', 'error');
    setUser({ ...user, name: name.trim() });
    setEditing(false);
    addToast('Profile updated successfully', 'success');
  };

  return (
    <div className="page">
      <h1 className="page-title">Profile</h1>
      <p className="page-subtitle">Manage your account information.</p>

      <div className="card" style={{maxWidth: 600}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
            <div style={{width: 64, height: 64, borderRadius: '50%', background: 'var(--accent)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 'bold'}}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 style={{margin: 0}}>{user?.name}</h2>
              <span className="market-badge badge-green" style={{marginTop: 4, display: 'inline-block'}}>{user?.accountType} Account</span>
            </div>
          </div>
          <button className="btn-outline" onClick={() => setEditing(!editing)}>
            <Edit2 size={16} /> {editing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        <div className="info-grid">
          {editing ? (
            <div className="form-group" style={{gridColumn: '1 / -1', marginBottom: 16}}>
              <label>Full Name</label>
              <div style={{display: 'flex', gap: 10}}>
                <input type="text" value={name} onChange={e => setName(e.target.value)} style={{flex: 1, padding: 10, borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-primary)'}} />
                <button className="btn-primary" onClick={handleSave}>Save</button>
              </div>
            </div>
          ) : (
            <div className="info-row"><span className="info-label"><User size={16}/> Name</span><span className="info-value">{user?.name}</span></div>
          )}
          <div className="info-row"><span className="info-label"><Mail size={16}/> Email</span><span className="info-value">{user?.email}</span></div>
          <div className="info-row"><span className="info-label"><Calendar size={16}/> Joined</span><span className="info-value">{new Date(user?.createdAt).toLocaleDateString()}</span></div>
        </div>
      </div>
    </div>
  );
}
