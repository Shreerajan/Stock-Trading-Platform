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