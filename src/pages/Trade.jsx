import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { getStockBySymbol } from '../data/stocks';
import { getBalance, getPortfolio } from '../utils/storage';
import { buyStock, sellStock, formatINR } from '../utils/trading';
import { ArrowDownUp } from 'lucide-react';

export default function Trade() {
  const [searchParams] = useSearchParams();
  const symbolParam = searchParams.get('symbol');
  const actionParam = searchParams.get('action') || 'buy';
  
  const { user } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();
  
  const [symbol, setSymbol] = useState(symbolParam || '');
  const [action, setAction] = useState(actionParam);
  const [quantity, setQuantity] = useState('');
  const [stock, setStock] = useState(null);
  
  const balance = getBalance(user.id);
  const portfolio = getPortfolio(user.id);
  
  useEffect(() => {
    if (symbol) {
      const s = getStockBySymbol(symbol);
      setStock(s);
    } else {
      setStock(null);
    }
  }, [symbol]);

  const ownedShares = portfolio.find(p => p.symbol === stock?.symbol)?.quantity || 0;
  const totalValue = stock ? stock.price * (Number(quantity) || 0) : 0;

  const handleTrade = (e) => {
    e.preventDefault();
    if (!stock) return addToast('Please select a valid stock.', 'error');
    if (!quantity || quantity <= 0) return addToast('Please enter a valid quantity.', 'error');

    let result;
    if (action === 'buy') {
      result = buyStock(user.id, stock.symbol, quantity);
    } else {
      result = sellStock(user.id, stock.symbol, quantity);
    }

    if (result.success) {
      addToast(result.message, 'success');
      navigate('/portfolio');
    } else {
      addToast(result.message, 'error');
    }
  };

  return (
    <div className="page">
      <h1 className="page-title">Trade</h1>
      <p className="page-subtitle">Buy and sell stocks.</p>

      <div className="trade-container" style={{maxWidth: 500, margin: '0 auto'}}>
        <div className="card">
          <div className="trade-tabs" style={{display: 'flex', marginBottom: 20, gap: 10}}>
            <button 
              className={`btn-primary ${action !== 'buy' ? 'btn-outline' : ''}`} 
              style={{flex: 1}} 
              onClick={() => setAction('buy')}
            >
              Buy
            </button>
            <button 
              className={`btn-primary ${action !== 'sell' ? 'btn-outline' : ''}`} 
              style={{flex: 1}} 
              onClick={() => setAction('sell')}
            >
              Sell
            </button>
          </div>

          <form onSubmit={handleTrade} className="auth-form">
            <div className="form-group">
              <label>Stock Symbol</label>
              <input 
                type="text" 
                value={symbol} 
                onChange={(e) => setSymbol(e.target.value.toUpperCase())} 
                placeholder="e.g. AAPL" 
                required 
              />
            </div>
            
            {stock && (
              <div className="info-grid" style={{background: 'var(--bg)', padding: 12, borderRadius: 8}}>
                <div className="info-row"><span className="info-label">Current Price</span><span className="info-value">{formatINR(stock.price)}</span></div>
                <div className="info-row"><span className="info-label">Available Balance</span><span className="info-value">{formatINR(balance)}</span></div>
                <div className="info-row"><span className="info-label">Owned Shares</span><span className="info-value">{ownedShares}</span></div>
              </div>
            )}

            <div className="form-group">
              <label>Quantity</label>
              <input 
                type="number" 
                value={quantity} 
                onChange={(e) => setQuantity(e.target.value)} 
                min="1"
                placeholder="0" 
                required 
              />
            </div>

            <div className="form-group" style={{borderTop: '1px solid var(--border)', paddingTop: 16, marginTop: 8}}>
              <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 600}}>
                <span>Estimated Total:</span>
                <span>{formatINR(totalValue)}</span>
              </div>
            </div>

            <button type="submit" className={`auth-submit ${action === 'sell' ? 'btn-danger' : ''}`} style={{width: '100%', marginTop: 10}}>
              <ArrowDownUp size={18} /> {action === 'buy' ? 'Buy Stock' : 'Sell Stock'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
