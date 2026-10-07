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
        <div className="summary-card"><div className="summary-card-info"><span className="summary-label">Overall P/L</span><span className={`summary-value ${summary.overallPL >= 0 ? 'text-green' : 'text-red'}`}>{formatINR(summary.overallPL)}</span></div></div>
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
                <div><span className={`txn-badge ${t.type === 'BUY' ? 'badge-green' : 'badge-red'}`}>{t.type}</span> <span style={{fontWeight: 600}}>{t.symbol}</span></div>
                <span>{formatINR(t.amount)}</span>
              </div>
            )) : <p className="text-muted">No transactions yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}