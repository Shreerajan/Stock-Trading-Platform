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