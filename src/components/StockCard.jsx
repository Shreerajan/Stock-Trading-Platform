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