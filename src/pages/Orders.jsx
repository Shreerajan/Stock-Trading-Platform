import { useAuth } from '../context/AuthContext';
import { getOrders } from '../utils/storage';
import { formatINR } from '../utils/trading';

export default function Orders() {
  const { user } = useAuth();
  const orders = getOrders(user.id);

  return (
    <div className="page">
      <h1 className="page-title">Orders</h1>
      <p className="page-subtitle">Your order history.</p>

      <div className="card">
        {orders.length === 0 ? (
          <div className="empty-state"><p>No orders found.</p></div>
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Date</th>
                  <th>Stock</th>
                  <th>Type</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o.id}>
                    <td><small className="text-muted">{o.id}</small></td>
                    <td>{new Date(o.date).toLocaleString()}</td>
                    <td>
                      <span className="table-symbol">{o.symbol}</span>
                      <div className="mini-stock-name">{o.name}</div>
                    </td>
                    <td><span className={`txn-badge ${o.type === 'BUY' ? 'badge-green' : 'badge-red'}`}>{o.type}</span></td>
                    <td>{o.quantity}</td>
                    <td>{formatINR(o.price)}</td>
                    <td>{formatINR(o.total)}</td>
                    <td><span className="market-badge badge-green">{o.status}</span></td>
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
