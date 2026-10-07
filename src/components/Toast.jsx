import { useToast } from '../context/ToastContext';
export default function Toast() {
  const { toasts, removeToast } = useToast();
  if (!toasts.length) return null;
  return (
    <div style={{position:'fixed', top:20, right:20, zIndex:9999, display:'flex', flexDirection:'column', gap:10}}>
      {toasts.map(t => (
        <div key={t.id} style={{padding:'12px 20px', borderRadius:8, color:'white', background: t.type==='error'?'#ef4444':t.type==='success'?'#10b981':'#3b82f6', display:'flex', justifyContent:'space-between', alignItems:'center', gap:20, minWidth:250, boxShadow:'0 4px 12px rgba(0,0,0,0.1)'}}>
          <span>{t.msg}</span>
          <button onClick={() => removeToast(t.id)} style={{background:'none',border:'none',color:'white',cursor:'pointer',fontSize:'1.2rem'}}>&times;</button>
        </div>
      ))}
    </div>
  );
}