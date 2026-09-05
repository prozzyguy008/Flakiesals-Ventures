import { useEffect, useState } from 'react';
import { Check, Copy, MapPin, Phone, Loader2 } from 'lucide-react';
import { supabase, formatNaira, type Order, type OrderItem } from '../lib/supabase';
import { navigate } from '../App';

export function OrderConfirmationPage({ orderId }: { orderId: string }) {
  const [order, setOrder] = useState<Order | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: orderData } = await supabase
        .from('store_orders')
        .select('*')
        .eq('id', orderId)
        .maybeSingle();
      if (orderData) {
        setOrder(orderData as Order);
        const { data: itemsData } = await supabase
          .from('store_order_items')
          .select('*')
          .eq('order_id', orderId);
        setItems((itemsData as OrderItem[]) || []);
      }
      setLoading(false);
    })();
  }, [orderId]);

  const copyAccount = () => {
    navigator.clipboard?.writeText('0231534026');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '64px 24px', textAlign: 'center' }}>
        <Loader2 size={32} className="spin" style={{ color: 'var(--primary-500)' }} />
        <style>{`.spin { animation: spin 1s linear infinite; } @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container animate-fade" style={{ padding: '64px 24px', textAlign: 'center' }}>
        <h1 style={{ fontSize: 28, marginBottom: 16 }}>Order not found</h1>
        <button className="btn btn-primary" onClick={() => navigate({ name: 'shop' })}>Back to Shop</button>
      </div>
    );
  }

  return (
    <div className="container animate-fade" style={{ padding: '32px 24px 64px', maxWidth: 720 }}>
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--success-500)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <Check size={36} color="#fff" />
        </div>
        <h1 style={{ fontSize: 30, marginBottom: 8 }}>Order Placed Successfully!</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 16 }}>Your order has been received. Please complete the bank transfer to confirm.</p>
        <p style={{ marginTop: 12, fontSize: 14, color: 'var(--text-muted)' }}>
          Order ID: <strong style={{ fontFamily: 'var(--font-display)', color: 'var(--text)' }}>{order.id.slice(0, 8).toUpperCase()}</strong>
        </p>
      </div>

      <div className="card" style={{ padding: 24, marginBottom: 24, background: 'var(--primary-50)', border: '1px solid var(--primary-100)' }}>
        <h3 style={{ fontSize: 18, marginBottom: 16, color: 'var(--primary-700)' }}>Complete Your Payment</h3>
        <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 16 }}>
          Transfer <strong style={{ color: 'var(--primary-600)' }}>{formatNaira(order.total)}</strong> to:
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 16, borderRadius: 'var(--radius)', background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)' }}>Bank</span><span style={{ fontWeight: 600 }}>Wema Bank</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)' }}>Account Name</span><span style={{ fontWeight: 600 }}>Flakiesals Ventures</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-muted)' }}>Account Number</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontWeight: 700, fontFamily: 'var(--font-display)', fontSize: 16 }}>0231534026</span>
              <button className="btn btn-ghost" style={{ padding: '4px 8px', fontSize: 12 }} onClick={copyAccount}>
                {copied ? <><Check size={14} /> Copied</> : <><Copy size={14} /> Copy</>}
              </button>
            </div>
          </div>
        </div>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 12 }}>
          After payment, contact us at 0814 507 9572 to confirm. Stock is reserved once payment is verified.
        </p>
      </div>

      <div className="card" style={{ padding: 24, marginBottom: 24 }}>
        <h3 style={{ fontSize: 18, marginBottom: 16 }}>Order Details</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {items.map((item) => (
            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
              <div>
                <p style={{ fontWeight: 500, fontSize: 15 }}>{item.product_name}</p>
                <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Qty {item.quantity} × {formatNaira(item.unit_price)}</p>
              </div>
              <span style={{ fontWeight: 600 }}>{formatNaira(item.unit_price * item.quantity)}</span>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16, paddingTop: 16, borderTop: '2px solid var(--border)' }}>
          <span style={{ fontWeight: 700, fontSize: 18 }}>Total</span>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22, color: 'var(--primary-600)' }}>{formatNaira(order.total)}</span>
        </div>
      </div>

      <div className="card" style={{ padding: 24, marginBottom: 24 }}>
        <h3 style={{ fontSize: 18, marginBottom: 16 }}>Pickup Information</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 14 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <MapPin size={18} style={{ color: 'var(--primary-500)', flexShrink: 0, marginTop: 2 }} />
            <span>OWO NI BOYS, 157 Off Otunola Adebayo Rd, Ilorin 240101, Kwara</span>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <Phone size={18} style={{ color: 'var(--primary-500)' }} />
            <span>0814 507 9572</span>
          </div>
        </div>
        <div style={{ marginTop: 16 }}>
          <span className="badge badge-warning">Status: Awaiting Transfer</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
        <button className="btn btn-primary" onClick={() => navigate({ name: 'shop' })}>Continue Shopping</button>
        <button className="btn btn-outline" onClick={() => navigate({ name: 'home' })}>Back to Home</button>
      </div>
    </div>
  );
}
