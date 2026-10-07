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