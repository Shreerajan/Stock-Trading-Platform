import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getWatchlist, removeFromWatchlist } from '../utils/storage';
import { getStockBySymbol } from '../data/stocks';
import { formatINR, formatPercent } from '../utils/trading';
import { TrendingUp, TrendingDown, Trash2 } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export default function Watchlist() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    loadWatchlist();
  }, []);

  const loadWatchlist = () => {
    const symbols = getWatchlist(user.id);
    const stocks = symbols.map(s => getStockBySymbol(s)).filter(Boolean);
    setWatchlist(stocks);
  };

  const handleRemove = (symbol, name) => {
    removeFromWatchlist(user.id, symbol);
    loadWatchlist();
    addToast(`Removed ${name} from watchlist`, 'info');
  };

  return (
    <div className="page">
      <h1 className="page-title">Watchlist</h1>
      <p className="page-subtitle">Track your favorite stocks.</p>

      {watchlist.length === 0 ? (
        <div className="empty-state">
          <p>Your watchlist is empty.</p>
          <button className="btn-primary" onClick={() => navigate('/markets')}>Explore Markets</button>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Symbol</th>
                <th>Company</th>
                <th>Price</th>
                <th>Change</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {watchlist.map(s => (
                <tr key={s.symbol}>
                  <td><span className="table-symbol">{s.symbol}</span></td>
                  <td>{s.name}</td>
                  <td className="table-price">{formatINR(s.price)}</td>
                  <td className={s.change >= 0 ? 'text-green' : 'text-red'}>
                    <span className="change-with-icon">
                      {s.change >= 0 ? <TrendingUp size={14}/> : <TrendingDown size={14}/>}
                      {formatINR(Math.abs(s.change))} ({formatPercent(s.changePercent)})
                    </span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button className="btn-sm btn-outline" onClick={() => navigate(`/stock/${s.symbol}`)}>View</button>
                      <button className="btn-sm btn-primary" onClick={() => navigate(`/trade?symbol=${s.symbol}`)}>Trade</button>
                      <button className="btn-sm btn-danger" onClick={() => handleRemove(s.symbol, s.name)}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
