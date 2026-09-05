import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../lib/cart';
import { formatNaira } from '../lib/supabase';
import { navigate } from '../App';

export function CartPage() {
  const { items, setQuantity, remove, total, count } = useCart();

  if (count === 0) {
    return (
      <div className="container animate-fade" style={{ padding: '64px 24px', textAlign: 'center' }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--neutral-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
          <ShoppingBag size={36} style={{ color: 'var(--neutral-400)' }} />
        </div>
        <h1 style={{ fontSize: 28, marginBottom: 8 }}>Your cart is empty</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>Browse our products and add items to your cart.</p>
        <button className="btn btn-primary" onClick={() => navigate({ name: 'shop' })}>Start Shopping</button>
      </div>
    );
  }

  return (
    <div className="container animate-fade" style={{ padding: '32px 24px 64px' }}>
      <h1 style={{ fontSize: 32, marginBottom: 24 }}>Shopping Cart ({count})</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 32 }} className="cart-layout">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {items.map((item) => (
            <div key={item.product.id} className="card" style={{ padding: 16, display: 'flex', gap: 16 }}>
              <div style={{ width: 96, height: 96, borderRadius: 'var(--radius)', overflow: 'hidden', background: 'var(--neutral-50)', flexShrink: 0 }}>
                <img src={item.product.image} alt={item.product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.currentTarget.style.opacity = .3; }} />
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 600 }} onClick={() => navigate({ name: 'product', id: item.product.id })} >{item.product.name}</h3>
                  <button onClick={() => remove(item.product.id)} style={{ color: 'var(--neutral-400)', padding: 4 }}><Trash2 size={18} /></button>
                </div>
                <span className="badge badge-primary" style={{ alignSelf: 'flex-start' }}>{item.product.category}</span>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                  <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid var(--border)', borderRadius: 'var(--radius)' }}>
                    <button style={{ padding: '6px 12px' }} disabled={item.quantity <= 1} onClick={() => setQuantity(item.product.id, item.quantity - 1)}><Minus size={14} /></button>
                    <span style={{ padding: '0 16px', fontWeight: 600, fontSize: 14 }}>{item.quantity}</span>
                    <button style={{ padding: '6px 12px' }} onClick={() => setQuantity(item.product.id, item.quantity + 1)}><Plus size={14} /></button>
                  </div>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, color: 'var(--primary-600)' }}>
                    {formatNaira(item.product.price)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <aside style={{ position: 'sticky', top: 88, alignSelf: 'start' }}>
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 20, marginBottom: 20 }}>Order Summary</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Subtotal</span>
                <span style={{ fontWeight: 600 }}>{formatNaira(total)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Pickup</span>
                <span style={{ fontWeight: 600, color: 'var(--success-500)' }}>Free (In-store)</span>
              </div>
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12, display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 700 }}>Total</span>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22, color: 'var(--primary-600)' }}>{formatNaira(total)}</span>
              </div>
            </div>
            <button className="btn btn-primary" style={{ width: 100, padding: '14px', fontSize: 16 }} onClick={() => navigate({ name: 'checkout' })}>
              Checkout <ArrowRight size={18} />
            </button>
            <button className="btn btn-ghost" style={{ width: '100%', marginTop: 8 }} onClick={() => navigate({ name: 'shop' })}>Continue Shopping</button>
          </div>
        </aside>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .cart-layout { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
