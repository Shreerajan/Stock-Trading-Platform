const fs = require('fs');
const path = require('path');

const files = {
  "src/data/stocks.js": `
const stocks = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: 17845.50, change: 234.75, changePercent: 1.33, high: 17920.00, low: 17580.25, open: 17610.75, previousClose: 17610.75, volume: 54230000, category: 'Technology', description: 'Apple Inc. description' },
  { symbol: 'MSFT', name: 'Microsoft Corp.', price: 34520.00, change: -187.50, changePercent: -0.54, high: 34780.00, low: 34410.50, open: 34707.50, previousClose: 34707.50, volume: 22150000, category: 'Technology', description: 'Microsoft description' },
  { symbol: 'TSLA', name: 'Tesla Inc.', price: 21450.00, change: -532.50, changePercent: -2.42, high: 22050.00, low: 21320.00, open: 21982.50, previousClose: 21982.50, volume: 98700000, category: 'Automotive', description: 'Tesla description' }
];
export function generateChartData(symbol, days = 365) {
  const stock = stocks.find(s => s.symbol === symbol);
  if (!stock) return [];
  const data = [];
  const basePrice = stock.price * 0.7;
  for (let i = 0; i < days; i++) {
    const trend = (i / days) * 0.3;
    const price = basePrice * (1 + trend);
    const date = new Date();
    date.setDate(date.getDate() - (days - i));
    data.push({ date: date.toISOString().split('T')[0], price: Math.round(price * 100) / 100, volume: stock.volume });
  }
  return data;
}
export function getChartDataByPeriod(symbol, period) { return generateChartData(symbol, period === '1W' ? 7 : period === '1M' ? 30 : 365); }
export function getStockBySymbol(symbol) { return stocks.find(s => s.symbol === symbol.toUpperCase()) || null; }
export function searchStocks(query) { return stocks.filter(s => s.symbol.toLowerCase().includes(query.toLowerCase()) || s.name.toLowerCase().includes(query.toLowerCase())); }
export function getStocksByCategory(category) { return category === 'All' ? stocks : stocks.filter(s => s.category === category); }
export function getCategories() { return ['All', ...new Set(stocks.map(s => s.category))]; }
export default stocks;
  `,
  "src/utils/storage.js": `
const KEYS = { USER: 't_user', IS_LOGGED_IN: 't_auth', BALANCE: 't_bal', PORTFOLIO: 't_port', WATCHLIST: 't_watch', ORDERS: 't_ord', TRANSACTIONS: 't_txn', SETTINGS: 't_set', USERS_DB: 't_db' };
const DEFAULT_BALANCE = 1000000;
const DEFAULT_WATCHLIST = ['AAPL', 'MSFT'];
const DEFAULT_SETTINGS = { darkMode: true, currency: 'INR', notifications: true };

export function getItem(key) { try { return JSON.parse(localStorage.getItem(key)); } catch { return null; } }
export function setItem(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
export function removeItem(key) { localStorage.removeItem(key); }
export function getUser() { return getItem(KEYS.USER); }
export function setUser(user) { setItem(KEYS.USER, user); }
export function isLoggedIn() { return getItem(KEYS.IS_LOGGED_IN) === true; }
export function setLoggedIn(value) { setItem(KEYS.IS_LOGGED_IN, value); }
export function getUsersDB() { return getItem(KEYS.USERS_DB) || []; }
export function setUsersDB(users) { setItem(KEYS.USERS_DB, users); }
export function registerUser(name, email, password) {
  const users = getUsersDB();
  if (users.find(u => u.email === email)) return { success: false, message: 'Email exists.' };
  const user = { id: Date.now().toString(), name, email, password, accountType: 'Demo', createdAt: new Date().toISOString() };
  users.push(user); setUsersDB(users); return { success: true, user };
}
export function loginUser(email, password) {
  const users = getUsersDB();
  const user = users.find(u => u.email === email && u.password === password);
  return user ? { success: true, user } : { success: false, message: 'Invalid credentials.' };
}
export function loginDemoUser() { return { id: 'demo_'+Date.now(), name: 'Demo User', email: 'demo@tradex.com', accountType: 'Demo', createdAt: new Date().toISOString() }; }
export function initializeUserData(userId) {
  if (!getItem(KEYS.BALANCE+'_'+userId)) setItem(KEYS.BALANCE+'_'+userId, DEFAULT_BALANCE);
  if (!getItem(KEYS.PORTFOLIO+'_'+userId)) setItem(KEYS.PORTFOLIO+'_'+userId, []);
  if (!getItem(KEYS.WATCHLIST+'_'+userId)) setItem(KEYS.WATCHLIST+'_'+userId, DEFAULT_WATCHLIST);
  if (!getItem(KEYS.ORDERS+'_'+userId)) setItem(KEYS.ORDERS+'_'+userId, []);
  if (!getItem(KEYS.TRANSACTIONS+'_'+userId)) setItem(KEYS.TRANSACTIONS+'_'+userId, []);
  if (!getItem(KEYS.SETTINGS+'_'+userId)) setItem(KEYS.SETTINGS+'_'+userId, DEFAULT_SETTINGS);
}
export function getBalance(userId) { return getItem(KEYS.BALANCE+'_'+userId) ?? DEFAULT_BALANCE; }
export function setBalance(userId, b) { setItem(KEYS.BALANCE+'_'+userId, b); }
export function getPortfolio(userId) { return getItem(KEYS.PORTFOLIO+'_'+userId) || []; }
export function setPortfolio(userId, p) { setItem(KEYS.PORTFOLIO+'_'+userId, p); }
export function getWatchlist(userId) { return getItem(KEYS.WATCHLIST+'_'+userId) || DEFAULT_WATCHLIST; }
export function setWatchlist(userId, w) { setItem(KEYS.WATCHLIST+'_'+userId, w); }
export function addToWatchlist(userId, symbol) { const w = getWatchlist(userId); if(!w.includes(symbol)){ w.push(symbol); setWatchlist(userId, w); return true;} return false;}
export function removeFromWatchlist(userId, symbol) { const w = getWatchlist(userId); setWatchlist(userId, w.filter(s=>s!==symbol)); return true; }
export function isInWatchlist(userId, symbol) { return getWatchlist(userId).includes(symbol); }
export function getOrders(userId) { return getItem(KEYS.ORDERS+'_'+userId) || []; }
export function setOrders(userId, o) { setItem(KEYS.ORDERS+'_'+userId, o); }
export function addOrder(userId, o) { const ords = getOrders(userId); ords.unshift(o); setOrders(userId, ords); }
export function getTransactions(userId) { return getItem(KEYS.TRANSACTIONS+'_'+userId) || []; }
export function setTransactions(userId, t) { setItem(KEYS.TRANSACTIONS+'_'+userId, t); }
export function addTransaction(userId, t) { const txns = getTransactions(userId); txns.unshift(t); setTransactions(userId, txns); }
export function getSettings(userId) { return getItem(KEYS.SETTINGS+'_'+userId) || DEFAULT_SETTINGS; }
export function setSettings(userId, s) { setItem(KEYS.SETTINGS+'_'+userId, s); }
export function resetAccount(userId) {
  setItem(KEYS.BALANCE+'_'+userId, DEFAULT_BALANCE);
  setItem(KEYS.PORTFOLIO+'_'+userId, []);
  setItem(KEYS.WATCHLIST+'_'+userId, DEFAULT_WATCHLIST);
  setItem(KEYS.ORDERS+'_'+userId, []);
  setItem(KEYS.TRANSACTIONS+'_'+userId, []);
}
export function logoutUser() { setLoggedIn(false); removeItem(KEYS.USER); }
  `,
  "src/utils/trading.js": `
import { getStockBySymbol } from '../data/stocks';
import { getBalance, setBalance, getPortfolio, setPortfolio, addOrder, addTransaction } from './storage';

export function formatINR(a) { return a == null || isNaN(a) ? '₹0' : (a<0?'-':'')+'₹'+Math.abs(a).toLocaleString('en-IN', {minimumFractionDigits:2,maximumFractionDigits:2}); }
export function formatNumber(n) { return n == null || isNaN(n) ? '0' : Number(n).toLocaleString('en-IN'); }
export function formatPercent(p) { return p == null || isNaN(p) ? '0.00%' : (p>=0?'+':'')+p.toFixed(2)+'%'; }

export function buyStock(userId, symbol, quantity) {
  const stock = getStockBySymbol(symbol);
  if (!stock) return { success: false, message: 'Invalid stock.' };
  const qty = parseInt(quantity);
  if (!qty || qty <= 0) return { success: false, message: 'Invalid quantity.' };
  const total = stock.price * qty;
  const balance = getBalance(userId);
  if (total > balance) return { success: false, message: 'Insufficient balance.' };
  setBalance(userId, balance - total);
  
  const portfolio = getPortfolio(userId);
  const existing = portfolio.find(p => p.symbol === symbol);
  if (existing) {
    const newQty = existing.quantity + qty;
    existing.avgPrice = ((existing.avgPrice * existing.quantity) + total) / newQty;
    existing.quantity = newQty;
    existing.investedValue = existing.avgPrice * newQty;
  } else {
    portfolio.push({ symbol: stock.symbol, name: stock.name, quantity: qty, avgPrice: stock.price, investedValue: total });
  }
  setPortfolio(userId, portfolio);
  
  const d = new Date().toISOString();
  addOrder(userId, { id: 'ORD'+Date.now(), symbol: stock.symbol, name: stock.name, type: 'BUY', quantity: qty, price: stock.price, total, date: d, status: 'Completed' });
  addTransaction(userId, { id: 'TXN'+Date.now(), type: 'BUY', symbol: stock.symbol, name: stock.name, quantity: qty, price: stock.price, amount: total, date: d, balanceAfter: balance - total });
  return { success: true, message: \`Bought \${qty} \${stock.symbol}\` };
}

export function sellStock(userId, symbol, quantity) {
  const stock = getStockBySymbol(symbol);
  if (!stock) return { success: false, message: 'Invalid stock.' };
  const qty = parseInt(quantity);
  if (!qty || qty <= 0) return { success: false, message: 'Invalid quantity.' };
  const portfolio = getPortfolio(userId);
  const existingIdx = portfolio.findIndex(p => p.symbol === symbol);
  if (existingIdx === -1) return { success: false, message: 'Not owned.' };
  const existing = portfolio[existingIdx];
  if (qty > existing.quantity) return { success: false, message: 'Not enough shares.' };
  
  const total = stock.price * qty;
  const balance = getBalance(userId);
  setBalance(userId, balance + total);
  
  if (qty === existing.quantity) {
    portfolio.splice(existingIdx, 1);
  } else {
    existing.quantity -= qty;
    existing.investedValue = existing.avgPrice * existing.quantity;
  }
  setPortfolio(userId, portfolio);
  
  const d = new Date().toISOString();
  addOrder(userId, { id: 'ORD'+Date.now(), symbol: stock.symbol, name: stock.name, type: 'SELL', quantity: qty, price: stock.price, total, date: d, status: 'Completed' });
  addTransaction(userId, { id: 'TXN'+Date.now(), type: 'SELL', symbol: stock.symbol, name: stock.name, quantity: qty, price: stock.price, amount: total, date: d, balanceAfter: balance + total });
  return { success: true, message: \`Sold \${qty} \${stock.symbol}\` };
}

export function getPortfolioSummary(userId) {
  const portfolio = getPortfolio(userId);
  const balance = getBalance(userId);
  let totalInvested = 0, totalCurrent = 0, todayPL = 0;
  const holdings = portfolio.map(h => {
    const stock = getStockBySymbol(h.symbol);
    const cp = stock ? stock.price : h.avgPrice;
    const cv = cp * h.quantity;
    const iv = h.avgPrice * h.quantity;
    totalInvested += iv; totalCurrent += cv;
    if(stock) todayPL += stock.change * h.quantity;
    return { ...h, currentPrice: cp, currentValue: cv, investedValue: iv, pl: cv - iv, plPercent: iv>0 ? (cv-iv)/iv*100 : 0 };
  });
  return { totalPortfolioValue: balance + totalCurrent, totalInvested, totalCurrent, availableCash: balance, overallPL: totalCurrent - totalInvested, overallPLPercent: totalInvested>0 ? (totalCurrent-totalInvested)/totalInvested*100 : 0, todayPL, holdings };
}
  `,
  "src/context/AuthContext.jsx": `
import { createContext, useContext, useState, useEffect } from 'react';
import { getUser, setUser as saveUser, isLoggedIn as checkLoggedIn, setLoggedIn, registerUser, loginUser, loginDemoUser, initializeUserData, logoutUser as doLogout, getSettings, setSettings as saveSettings } from '../utils/storage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [settings, setSettingsState] = useState({ darkMode: true, currency: 'INR', notifications: true });

  useEffect(() => {
    if (checkLoggedIn()) {
      const u = getUser();
      if (u) { setUser(u); setSettingsState(getSettings(u.id)); }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', settings.darkMode ? 'dark' : 'light');
  }, [settings.darkMode]);

  const handleAuth = (result) => {
    if (result.success) {
      const u = { ...result.user }; delete u.password;
      setUser(u); saveUser(u); setLoggedIn(true);
      initializeUserData(u.id); setSettingsState(getSettings(u.id));
    }
    return result;
  };

  return (
    <AuthContext.Provider value={{
      user, setUser: (u) => { setUser(u); saveUser(u); }, loading,
      login: (e, p) => handleAuth(loginUser(e, p)),
      register: (n, e, p) => handleAuth(registerUser(n, e, p)),
      demoLogin: () => { const u = loginDemoUser(); handleAuth({success:true, user:u}); },
      logout: () => { doLogout(); setUser(null); },
      settings, updateSettings: (s) => { setSettingsState(s); if(user) saveSettings(user.id, s); }
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
  `,
  "src/context/ToastContext.jsx": `
import { createContext, useContext, useState } from 'react';
const ToastContext = createContext(null);
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  return (
    <ToastContext.Provider value={{
      toasts,
      addToast: (msg, type='info') => {
        const id = Date.now();
        setToasts(p => [...p, {id, msg, type}]);
        setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3500);
      },
      removeToast: (id) => setToasts(p => p.filter(t => t.id !== id))
    }}>
      {children}
    </ToastContext.Provider>
  );
}
export const useToast = () => useContext(ToastContext);
  `,
  "src/components/Toast.jsx": `
import { useToast } from '../context/ToastContext';
export default function Toast() {
  const { toasts, removeToast } = useToast();
  if (!toasts.length) return null;
  return (
    <div style={{position:'fixed', top:20, right:20, zIndex:9999, display:'flex', flexDirection:'column', gap:10}}>
      {toasts.map(t => (
        <div key={t.id} style={{padding:'12px 20px', borderRadius:8, color:'white', background: t.type==='error'?'#ef4444':t.type==='success'?'#10b981':'#3b82f6', display:'flex', justifyContent:'space-between', alignItems:'center', gap:20, minWidth:250, boxShadow:'0 4px 12px rgba(0,0,0,0.1)'}}>
          <span>{t.msg}</span>
          <button onClick={() => removeToast(t.id)} style={{background:'none',border:'none',color:'white',cursor:'pointer',fontSize:'1.2rem'}}>&times;</button>
        </div>
      ))}
    </div>
  );
}
  `,
  "src/components/ProtectedRoute.jsx": `
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}
  `,
  "src/components/Sidebar.jsx": `
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
  `,
  "src/components/Navbar.jsx": `
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
  `,
  "src/components/DashboardLayout.jsx": `
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
  `,
  "src/components/StockChart.jsx": `
import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { getChartDataByPeriod } from '../data/stocks';
import { formatINR } from '../utils/trading';
export default function StockChart({ symbol, height = 300 }) {
  const [period, setPeriod] = useState('1M');
  const data = getChartDataByPeriod(symbol, period);
  const color = (data[data.length-1]?.price >= data[0]?.price) ? '#10b981' : '#ef4444';
  return (
    <div style={{width: '100%'}}>
      <div style={{display: 'flex', gap: 8, marginBottom: 16}}>
        {['1W', '1M', '1Y'].map(p => (
          <button key={p} onClick={() => setPeriod(p)} style={{padding: '4px 12px', borderRadius: 16, border: '1px solid var(--border)', background: period === p ? 'var(--accent)' : 'transparent', color: period === p ? 'white' : 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.8rem'}}>{p}</button>
        ))}
      </div>
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data}>
          <XAxis dataKey="date" hide />
          <YAxis hide domain={['dataMin - 100', 'dataMax + 100']} />
          <Tooltip formatter={v => formatINR(v)} labelStyle={{color:'black'}} />
          <Area type="monotone" dataKey="price" stroke={color} fill={color} fillOpacity={0.2} strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
  `,
  "src/components/StockCard.jsx": `
import { useNavigate } from 'react-router-dom';
import { formatINR, formatPercent } from '../utils/trading';
export default function StockCard({ stock }) {
  const navigate = useNavigate();
  return (
    <div className="card" style={{cursor: 'pointer', transition: 'transform 0.2s'}} onClick={() => navigate('/stock/' + stock.symbol)}>
      <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 12}}>
        <div>
          <div style={{fontWeight: 700, fontSize: '1.1rem'}}>{stock.symbol}</div>
          <div style={{fontSize: '0.85rem', color: 'var(--text-secondary)'}}>{stock.name}</div>
        </div>
        <span className="stock-category-tag">{stock.category}</span>
      </div>
      <div>
        <div style={{fontWeight: 700, fontSize: '1.4rem'}}>{formatINR(stock.price)}</div>
        <div className={stock.change >= 0 ? 'text-green' : 'text-red'} style={{fontSize: '0.9rem', fontWeight: 500}}>
          {stock.change >= 0 ? '+' : ''}{formatINR(stock.change)} ({formatPercent(stock.changePercent)})
        </div>
      </div>
    </div>
  );
}
  `,
  "src/pages/Landing.jsx": `
import { useNavigate } from 'react-router-dom';
export default function Landing() {
  const navigate = useNavigate();
  return (
    <div style={{minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 20}}>
      <h1 style={{fontSize: '3rem', marginBottom: 20, color: 'var(--accent)'}}>TradeX</h1>
      <p style={{fontSize: '1.2rem', marginBottom: 40, color: 'var(--text-secondary)', maxWidth: 600}}>Learn to trade stocks completely risk-free with our simulated trading platform. Start with ₹10,00,000 virtual balance.</p>
      <div style={{display: 'flex', gap: 20}}>
        <button className="btn-primary" style={{padding: '12px 24px', fontSize: '1.1rem'}} onClick={() => navigate('/register')}>Start Trading Now</button>
        <button className="btn-outline" style={{padding: '12px 24px', fontSize: '1.1rem'}} onClick={() => navigate('/login')}>Login</button>
      </div>
    </div>
  );
}
  `,
  "src/pages/Login.jsx": `
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
  `,
  "src/pages/Register.jsx": `
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register, demoLogin } = useAuth();
  const navigate = useNavigate();
  return (
    <div style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)'}}>
      <div className="card" style={{width: '100%', maxWidth: 400}}>
        <h2 style={{textAlign: 'center', marginBottom: 20}}>Create Account</h2>
        <form onSubmit={e => { e.preventDefault(); if(register(name, email, password).success) navigate('/dashboard'); }}>
          <div style={{marginBottom: 16}}>
            <label style={{display: 'block', marginBottom: 8}}>Name</label>
            <input type="text" value={name} onChange={e=>setName(e.target.value)} style={{width: '100%', padding: 10, borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-primary)'}} required />
          </div>
          <div style={{marginBottom: 16}}>
            <label style={{display: 'block', marginBottom: 8}}>Email</label>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} style={{width: '100%', padding: 10, borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-primary)'}} required />
          </div>
          <div style={{marginBottom: 24}}>
            <label style={{display: 'block', marginBottom: 8}}>Password</label>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} style={{width: '100%', padding: 10, borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-primary)'}} minLength={6} required />
          </div>
          <button type="submit" className="btn-primary" style={{width: '100%', justifyContent: 'center', marginBottom: 16}}>Register</button>
        </form>
        <button className="btn-outline" style={{width: '100%', justifyContent: 'center', marginBottom: 16}} onClick={() => { demoLogin(); navigate('/dashboard'); }}>Continue as Demo User</button>
        <p style={{textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)'}}>Already have an account? <Link to="/login" style={{color: 'var(--accent)'}}>Login</Link></p>
      </div>
    </div>
  );
}
  `,
  "src/pages/Dashboard.jsx": `
import { useAuth } from '../context/AuthContext';
import { getPortfolioSummary, formatINR, formatPercent } from '../utils/trading';
import { getTransactions } from '../utils/storage';
import { useNavigate } from 'react-router-dom';
import StockChart from '../components/StockChart';
import stocks from '../data/stocks';

export default function Dashboard() {
  const { user } = useAuth();
  const summary = getPortfolioSummary(user.id);
  const txns = getTransactions(user.id).slice(0, 5);
  const navigate = useNavigate();

  return (
    <div className="page">
      <h1 className="page-title">Dashboard</h1>
      <p className="page-subtitle">Welcome back, {user.name}!</p>
      <div className="summary-cards">
        <div className="summary-card"><div className="summary-card-info"><span className="summary-label">Total Value</span><span className="summary-value">{formatINR(summary.totalPortfolioValue)}</span></div></div>
        <div className="summary-card"><div className="summary-card-info"><span className="summary-label">Available Cash</span><span className="summary-value">{formatINR(summary.availableCash)}</span></div></div>
        <div className="summary-card"><div className="summary-card-info"><span className="summary-label">Overall P/L</span><span className={\`summary-value \${summary.overallPL >= 0 ? 'text-green' : 'text-red'}\`}>{formatINR(summary.overallPL)}</span></div></div>
      </div>
      <div className="dashboard-grid">
        <div className="card"><h3 className="card-title" style={{marginBottom: 16}}>Market Overview</h3>
          <div style={{display: 'flex', flexDirection: 'column', gap: 12}}>
            {stocks.slice(0, 5).map(s => (
              <div key={s.symbol} onClick={() => navigate('/stock/'+s.symbol)} style={{display: 'flex', justifyContent: 'space-between', padding: 12, background: 'var(--hover-bg)', borderRadius: 8, cursor: 'pointer'}}>
                <span style={{fontWeight: 700}}>{s.symbol}</span>
                <span style={{fontWeight: 600}}>{formatINR(s.price)}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card"><h3 className="card-title" style={{marginBottom: 16}}>Recent Transactions</h3>
          <div style={{display: 'flex', flexDirection: 'column', gap: 12}}>
            {txns.length ? txns.map(t => (
              <div key={t.id} style={{display: 'flex', justifyContent: 'space-between', padding: 12, background: 'var(--hover-bg)', borderRadius: 8}}>
                <div><span className={\`txn-badge \${t.type === 'BUY' ? 'badge-green' : 'badge-red'}\`}>{t.type}</span> <span style={{fontWeight: 600}}>{t.symbol}</span></div>
                <span>{formatINR(t.amount)}</span>
              </div>
            )) : <p className="text-muted">No transactions yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
  `,
  "src/pages/Markets.jsx": `
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StockCard from '../components/StockCard';
import stocks, { getCategories } from '../data/stocks';
export default function Markets() {
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState('All');
  const filtered = stocks.filter(s => (cat === 'All' || s.category === cat) && (s.symbol.toLowerCase().includes(search.toLowerCase()) || s.name.toLowerCase().includes(search.toLowerCase())));
  return (
    <div className="page">
      <h1 className="page-title">Markets</h1>
      <p className="page-subtitle">Explore stocks to trade.</p>
      <div className="market-controls">
        <input type="text" placeholder="Search stocks..." value={search} onChange={e=>setSearch(e.target.value)} style={{padding: '10px 16px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--card-bg)', color: 'var(--text-primary)', width: 250}} />
        <select value={cat} onChange={e=>setCat(e.target.value)} style={{padding: '10px 16px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--card-bg)', color: 'var(--text-primary)'}}>
          {getCategories().map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div className="dashboard-grid">
        {filtered.map(s => <StockCard key={s.symbol} stock={s} />)}
      </div>
    </div>
  );
}
  `,
  "src/pages/StockDetails.jsx": `
import { useParams, useNavigate } from 'react-router-dom';
import { getStockBySymbol } from '../data/stocks';
import StockChart from '../components/StockChart';
import { formatINR, formatPercent } from '../utils/trading';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { isInWatchlist, addToWatchlist, removeFromWatchlist } from '../utils/storage';
import { useState } from 'react';

export default function StockDetails() {
  const { symbol } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToast();
  const stock = getStockBySymbol(symbol);
  const [inWatch, setInWatch] = useState(stock ? isInWatchlist(user.id, stock.symbol) : false);

  if (!stock) return <div className="page"><h2>Stock not found</h2></div>;

  const toggleWatch = () => {
    if (inWatch) { removeFromWatchlist(user.id, stock.symbol); setInWatch(false); addToast('Removed from watchlist'); }
    else { addToWatchlist(user.id, stock.symbol); setInWatch(true); addToast('Added to watchlist', 'success'); }
  };

  return (
    <div className="page">
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24}}>
        <div>
          <h1 style={{fontSize: '2.5rem', margin: 0}}>{stock.symbol}</h1>
          <p style={{fontSize: '1.2rem', color: 'var(--text-secondary)'}}>{stock.name} &bull; <span className="stock-category-tag">{stock.category}</span></p>
        </div>
        <div style={{textAlign: 'right'}}>
          <div style={{fontSize: '2.2rem', fontWeight: 700}}>{formatINR(stock.price)}</div>
          <div className={stock.change >= 0 ? 'text-green' : 'text-red'} style={{fontSize: '1.2rem', fontWeight: 600}}>{stock.change >= 0 ? '+' : ''}{formatINR(stock.change)} ({formatPercent(stock.changePercent)})</div>
        </div>
      </div>
      <div style={{display: 'flex', gap: 12, marginBottom: 32}}>
        <button className="btn-primary" onClick={() => navigate('/trade?action=buy&symbol='+stock.symbol)}>Buy</button>
        <button className="btn-outline" onClick={() => navigate('/trade?action=sell&symbol='+stock.symbol)}>Sell</button>
        <button className="btn-outline" onClick={toggleWatch}>{inWatch ? 'Remove from Watchlist' : 'Add to Watchlist'}</button>
      </div>
      <div className="card" style={{marginBottom: 24}}>
        <StockChart symbol={stock.symbol} height={400} />
      </div>
      <div className="card">
        <h3 className="card-title" style={{marginBottom: 16}}>About {stock.name}</h3>
        <p style={{color: 'var(--text-secondary)', lineHeight: 1.6}}>{stock.description}</p>
      </div>
    </div>
  );
}
  `
};

for (const [filepath, content] of Object.entries(files)) {
  const dir = path.dirname(filepath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filepath, content.trim());
  console.log('Created ' + filepath);
}
