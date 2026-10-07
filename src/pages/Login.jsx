import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, demoLogin } = useAuth();
  const navigate = useNavigate();
  return (
    <div style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)'}}>
      <div className="card" style={{width: '100%', maxWidth: 400}}>
        <h2 style={{textAlign: 'center', marginBottom: 20}}>Login to TradeX</h2>
        <form onSubmit={e => { e.preventDefault(); if(login(email, password).success) navigate('/dashboard'); }}>
          <div style={{marginBottom: 16}}>
            <label style={{display: 'block', marginBottom: 8}}>Email</label>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} style={{width: '100%', padding: 10, borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-primary)'}} required />
          </div>
          <div style={{marginBottom: 24}}>
            <label style={{display: 'block', marginBottom: 8}}>Password</label>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} style={{width: '100%', padding: 10, borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-primary)'}} required />
          </div>
          <button type="submit" className="btn-primary" style={{width: '100%', justifyContent: 'center', marginBottom: 16}}>Login</button>
        </form>
        <button className="btn-outline" style={{width: '100%', justifyContent: 'center', marginBottom: 16}} onClick={() => { demoLogin(); navigate('/dashboard'); }}>Continue as Demo User</button>
        <p style={{textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)'}}>Don't have an account? <Link to="/register" style={{color: 'var(--accent)'}}>Register</Link></p>
      </div>
    </div>
  );
}