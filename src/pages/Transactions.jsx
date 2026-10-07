import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getTransactions } from '../utils/storage';
import { formatINR } from '../utils/trading';

export default function Transactions() {
  const { user } = useAuth();
  const allTransactions = getTransactions(user.id);
  const [filter, setFilter] = useState('ALL');

  const filtered = filter === 'ALL' ? allTransactions : allTransactions.filter(t => t.type === filter);

  return (
    <div className="page">
      <h1 className="page-title">Transactions</h1>
      <p className="page-subtitle">Your financial transactions.</p>

      <div className="market-controls">
        <div className="filter-chips">
          <button className={`chip ${filter === 'ALL' ? 'chip-active' : ''}`} onClick={() => setFilter('ALL')}>All</button>
          <button className={`chip ${filter === 'BUY' ? 'chip-active' : ''}`} onClick={() => setFilter('BUY')}>Buy</button>
          <button className={`chip ${filter === 'SELL' ? 'chip-active' : ''}`} onClick={() => setFilter('SELL')}>Sell</button>
        </div>
      </div>

      <div className="card">
        {filtered.length === 0 ? (
          <div className="empty-state"><p>No transactions found.</p></div>
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Stock</th>
                  <th>Quantity</th>
                  <th>Amount</th>
                  <th>Balance After</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(t => (
                  <tr key={t.id}>
                    <td>{new Date(t.date).toLocaleString()}</td>
                    <td><span className={`txn-badge ${t.type === 'BUY' ? 'badge-red' : 'badge-green'}`}>{t.type}</span></td>
                    <td><span className="table-symbol">{t.symbol}</span></td>
                    <td>{t.quantity}</td>
                    <td className={t.type === 'BUY' ? 'text-red' : 'text-green'}>
                      {t.type === 'BUY' ? '-' : '+'}{formatINR(t.amount)}
                    </td>
                    <td>{formatINR(t.balanceAfter)}</td>
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
