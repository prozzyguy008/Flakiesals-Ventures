import { useState } from 'react';
import { ArrowLeft, Check, CreditCard, Loader2 } from 'lucide-react';
import { useCart } from '../lib/cart';
import { supabase, formatNaira } from '../lib/supabase';
import { navigate } from '../App';

const BANK_DETAILS = {
  bank: 'Wema Bank',
  accountName: 'Flakiesals Ventures',
  accountNumber: '0231534026',
};

export function CheckoutPage({ onOrderPlaced }: { onOrderPlaced: () => void }) {
  const { items, total, clear, count } = useCart();
  const [form, setForm] = useState({ name: '', phone: '', email: '', notes: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  if (count === 0) {
    return (
      <div className="container animate-fade" style={{ padding: '64px 24px', textAlign: 'center' }}>
        <h1 style={{ fontSize: 28, marginBottom: 16 }}>Your cart is empty</h1>
        <button className="btn btn-primary" onClick={() => navigate({ name: 'shop' })}>Start Shopping</button>
      </div>
    );
  }

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Please enter your name';
    if (!form.phone.trim()) e.phone = 'Please enter your phone number';
    if (!form.email.trim()) e.email = 'Please enter your email';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Please enter a valid email';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const { data: order, error: orderError } = await supabase
        .from('store_orders')
        .insert({
          customer_name: form.name.trim(),
          customer_phone: form.phone.trim(),
          customer_email: form.email.trim(),
          notes: form.notes.trim(),
          total,
          payment_status: 'awaiting_transfer',
        })
        .select()
        .single();

      if (orderError) throw new Error(orderError.message);

      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.product.id,
        product_name: item.product.name,
        quantity: item.quantity,
        unit_price: item.product.price ?? 0,
      }));

      const { error: itemsError } = await supabase.from('store_order_items').insert(orderItems);
      if (itemsError) throw new Error(itemsError.message);

      clear();
      onOrderPlaced();
      navigate({ name: 'confirmation', orderId: order.id });
    } catch (err) {
      setErrors({ submit: err instanceof Error ? err.message : 'Failed to place order. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  const copyAccount = () => {
    navigator.clipboard?.writeText(BANK_DETAILS.accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="container animate-fade" style={{ padding: '32px 24px 64px' }}>
      <button className="btn btn-ghost" style={{ marginBottom: 24, padding: '8px 0' }} onClick={() => navigate({ name: 'cart' })}>
        <ArrowLeft size={18} /> Back to Cart
      </button>

      <h1 style={{ fontSize: 32, marginBottom: 24 }}>Checkout</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 32 }} className="checkout-layout">
        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 18, marginBottom: 16 }}>Contact Information</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="form-grid">
              <div>
                <label style={{ fontSize: 14, fontWeight: 500, marginBottom: 6, display: 'block' }}>Full Name *</label>
                <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="John Doe" />
                {errors.name && <span style={{ fontSize: 13, color: 'var(--error-500)', marginTop: 4, display: 'block' }}>{errors.name}</span>}
              </div>
              <div>
                <label style={{ fontSize: 14, fontWeight: 500, marginBottom: 6, display: 'block' }}>Phone *</label>
                <input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="0801 234 5678" />
                {errors.phone && <span style={{ fontSize: 13, color: 'var(--error-500)', marginTop: 4, display: 'block' }}>{errors.phone}</span>}
              </div>
            </div>
            <div style={{ marginTop: 16 }}>
              <label style={{ fontSize: 14, fontWeight: 500, marginBottom: 6, display: 'block' }}>Email *</label>
              <input className="input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
              {errors.email && <span style={{ fontSize: 13, color: 'var(--error-500)', marginTop: 4, display: 'block' }}>{errors.email}</span>}
            </div>
            <div style={{ marginTop: 16 }}>
              <label style={{ fontSize: 14, fontWeight: 500, marginBottom: 6, display: 'block' }}>Order Notes (optional)</label>
              <textarea className="input" rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Any special instructions for pickup..." />
            </div>
          </div>

          <div className="card" style={{ padding: 24, background: 'var(--primary-50)', border: '1px solid var(--primary-100)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <CreditCard size={24} style={{ color: 'var(--primary-500)' }} />
              <h3 style={{ fontSize: 18, color: 'var(--primary-700)' }}>Payment — Bank Transfer</h3>
            </div>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 16 }}>
              Transfer <strong style={{ color: 'var(--primary-600)' }}>{formatNaira(total)}</strong> to the account below, then place your order. We'll confirm payment before pickup.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 16, borderRadius: 'var(--radius)', background: 'var(--surface)', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)' }}>Bank</span><span style={{ fontWeight: 600 }}>{BANK_DETAILS.bank}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)' }}>Account Name</span><span style={{ fontWeight: 600 }}>{BANK_DETAILS.accountName}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-muted)' }}>Account Number</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontWeight: 700, fontFamily: 'var(--font-display)', fontSize: 16 }}>{BANK_DETAILS.accountNumber}</span>
                  <button type="button" className="btn btn-ghost" style={{ padding: '4px 8px', fontSize: 12 }} onClick={copyAccount}>
                    {copied ? <><Check size={14} /> Copied</> : 'Copy'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {errors.submit && (
            <div className="badge badge-error" style={{ alignSelf: 'flex-start', padding: '8px 16px' }}>{errors.submit}</div>
          )}

          <button type="submit" className="btn btn-primary" style={{ padding: '16px 32px', fontSize: 16 }} disabled={submitting}>
            {submitting ? <><Loader2 size={18} className="spin" /> Placing order...</> : <>Place Order — {formatNaira(total)}</>}
          </button>
        </form>

        <aside style={{ position: 'sticky', top: 88, alignSelf: 'start' }}>
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 18, marginBottom: 16 }}>Order Summary</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
              {items.map((item) => (
                <div key={item.product.id} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-sm)', overflow: 'hidden', background: 'var(--neutral-50)', flexShrink: 0 }}>
                    <img src={item.product.image} alt={item.product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.currentTarget.style.opacity = .3; }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.product.name}</p>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Qty {item.quantity} × {formatNaira(item.product.price)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16, display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 700 }}>Total</span>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22, color: 'var(--primary-600)' }}>{formatNaira(total)}</span>
            </div>
            <div style={{ marginTop: 16, padding: 12, borderRadius: 'var(--radius)', background: 'var(--neutral-50)', fontSize: 13, color: 'var(--text-muted)' }}>
              Pickup at: OWO NI BOYS, 157 Off Otunola Adebayo Rd, Ilorin. No delivery.
            </div>
          </div>
        </aside>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .checkout-layout { grid-template-columns: 1fr !important; }
          .form-grid { grid-template-columns: 1fr !important; }
        }
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
