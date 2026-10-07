import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getPortfolioSummary, formatINR, formatPercent } from '../utils/trading';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Briefcase, TrendingUp, TrendingDown } from 'lucide-react';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#f43f5e'];

export default function Portfolio() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const summary = getPortfolioSummary(user.id);
  const holdings = summary.holdings;

  const chartData = holdings.map(h => ({
    name: h.symbol,
    value: h.currentValue
  })).filter(d => d.value > 0);

  return (
    <div className="page">
      <h1 className="page-title">Portfolio</h1>
      <p className="page-subtitle">Manage your investments.</p>

      <div className="summary-cards">
        <div className="summary-card">
          <div className="summary-card-icon" style={{background: 'rgba(99,102,241,0.1)', color: '#6366f1'}}><Briefcase size={22} /></div>
          <div className="summary-card-info">
            <span className="summary-label">Total Portfolio</span>
            <span className="summary-value">{formatINR(summary.totalPortfolioValue)}</span>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-card-info">
            <span className="summary-label">Total Invested</span>
            <span className="summary-value">{formatINR(summary.totalInvested)}</span>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-card-info">
            <span className="summary-label">Current Value</span>
            <span className="summary-value">{formatINR(summary.totalCurrent)}</span>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-card-info">
            <span className="summary-label">Overall P/L</span>
            <span className={`summary-value ${summary.overallPL >= 0 ? 'text-green' : 'text-red'}`}>
              {formatINR(summary.overallPL)} ({formatPercent(summary.overallPLPercent)})
            </span>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <h3 className="card-title">Portfolio Allocation</h3>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={chartData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={v => formatINR(v)} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
             <div className="empty-state"><p>No investments yet.</p></div>
          )}
        </div>
      </div>

      <div className="card">
        <h3 className="card-title">Holdings</h3>
        {holdings.length === 0 ? (
          <div className="empty-state">
            <p>You don't own any stocks yet.</p>
            <button className="btn-primary" onClick={() => navigate('/markets')}>Start Trading</button>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Stock</th>
                  <th>Quantity</th>
                  <th>Avg Price</th>
                  <th>Current Price</th>
                  <th>Invested</th>
                  <th>Current Value</th>
                  <th>P/L</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {holdings.map(h => (
                  <tr key={h.symbol}>
                    <td>
                      <div>
                        <span className="table-symbol">{h.symbol}</span>
                        <div className="mini-stock-name">{h.name}</div>
                      </div>
                    </td>
                    <td>{h.quantity}</td>
                    <td>{formatINR(h.avgPrice)}</td>
                    <td>{formatINR(h.currentPrice)}</td>
                    <td>{formatINR(h.investedValue)}</td>
                    <td>{formatINR(h.currentValue)}</td>
                    <td className={h.pl >= 0 ? 'text-green' : 'text-red'}>
                      {formatINR(h.pl)} <br/>
                      <small>({formatPercent(h.plPercent)})</small>
                    </td>
                    <td>
                      <button className="btn-sm btn-primary" onClick={() => navigate(`/trade?symbol=${h.symbol}&action=sell`)}>Trade</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
