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