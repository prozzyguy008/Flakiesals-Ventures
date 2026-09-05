import { useEffect, useState } from 'react';
import { Package, ShoppingBag, Plus, Edit2, Trash2, X, Save, Loader2, TrendingUp } from 'lucide-react';
import { supabase, formatNaira, CATEGORIES, type Product, type Order, type OrderItem } from '../lib/supabase';

type Tab = 'products' | 'orders';

export function AdminPage({ products, loading, onRefresh }: {
  products: Product[];
  loading: boolean;
  onRefresh: () => void;
}) {
  const [tab, setTab] = useState<Tab>('products');
  const [orders, setOrders] = useState<(Order & { items?: OrderItem[] })[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [editing, setEditing] = useState<Product | null>(null);
  const [adding, setAdding] = useState(false);

  const loadOrders = async () => {
    setOrdersLoading(true);
    const { data: orderData } = await supabase.from('store_orders').select('*').order('created_at', { ascending: false });
    const orderList = (orderData as Order[]) || [];
    const ordersWithItems = await Promise.all(
      orderList.map(async (o) => {
        const { data: items } = await supabase.from('store_order_items').select('*').eq('order_id', o.id);
        return { ...o, items: (items as OrderItem[]) || [] };
      })
    );
    setOrders(ordersWithItems);
    setOrdersLoading(false);
  };

  useEffect(() => { loadOrders(); }, []);

  const deleteProduct = async (id: string) => {
    if (!confirm('Delete this product? This cannot be undone.')) return;
    await supabase.from('store_products').delete().eq('id', id);
    onRefresh();
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    await supabase.from('store_orders').update({ payment_status: status }).eq('id', orderId);
    loadOrders();
  };

  const confirmOrder = async (order: Order & { items?: OrderItem[] }) => {
    if (!confirm('Confirm this order? Stock will be reduced for each item.')) return;
    for (const item of order.items || []) {
      const product = products.find((p) => p.id === item.product_id);
      if (product) {
        const newStock = Math.max(0, product.stock - item.quantity);
        await supabase.from('store_products').update({ stock: newStock, updated_at: new Date().toISOString() }).eq('id', item.product_id);
      }
    }
    await supabase.from('store_orders').update({ payment_status: 'confirmed' }).eq('id', orderId);
    onRefresh();
    loadOrders();
  };

  return (
    <div className="container animate-fade" style={{ padding: '32px 24px 64px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 32 }}>Admin Panel</h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage products, orders, and inventory</p>
        </div>
        {tab === 'products' && (
          <button className="btn btn-primary" onClick={() => setAdding(true)}><Plus size={18} /> Add Product</button>
        )}
      </div>

      <div style={{ display: 'flex', gap: 4, marginBottom: 24, borderBottom: '2px solid var(--border)' }}>
        <button
          style={{ padding: '12px 20px', fontWeight: 600, borderBottom: '2px solid ' + (tab === 'products' ? 'var(--primary-500)' : 'transparent'), color: tab === 'products' ? 'var(--primary-500)' : 'var(--text-muted)', marginBottom: -2 }}
          onClick={() => setTab('products')}
        >
          <Package size={16} style={{ display: 'inline', marginRight: 6 }} /> Products ({products.length})
        </button>
        <button
          style={{ padding: '12px 20px', fontWeight: 600, borderBottom: '2px solid ' + (tab === 'orders' ? 'var(--primary-500)' : 'transparent'), color: tab === 'orders' ? 'var(--primary-500)' : 'var(--text-muted)', marginBottom: -2 }}
          onClick={() => setTab('orders')}
        >
          <ShoppingBag size={16} style={{ display: 'inline', marginRight: 6 }} /> Orders ({orders.length})
        </button>
      </div>

      {tab === 'products' && (
        loading ? (
          <div style={{ textAlign: 'center', padding: 48 }}><Loader2 size={28} className="spin" style={{ color: 'var(--primary-500)' }} /></div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {products.map((p) => (
              <div key={p.id} className="card" style={{ padding: 16, display: 'flex', gap: 16, alignItems: 'center' }}>
                <div style={{ width: 64, height: 64, borderRadius: 'var(--radius)', overflow: 'hidden', background: 'var(--neutral-50)', flexShrink: 0 }}>
                  <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.currentTarget.style.opacity = .3; }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{p.name}</h3>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <span className="badge badge-primary">{p.category}</span>
                    <span style={{ fontWeight: 700, color: 'var(--primary-600)' }}>{formatNaira(p.price)}</span>
                    <span className="badge" style={{ background: p.stock > 0 ? 'var(--success-500)' : 'var(--error-500)', color: '#fff' }}>Stock: {p.stock}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                  <button className="btn btn-outline" style={{ padding: '8px 12px' }} onClick={() => setEditing(p)}><Edit2 size={16} /></button>
                  <button className="btn btn-outline" style={{ padding: '8px 12px', color: 'var(--error-500)' }} onClick={() => deleteProduct(p.id)}><Trash2 size={16} /></button>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {tab === 'orders' && (
        ordersLoading ? (
          <div style={{ textAlign: 'center', padding: 48 }}><Loader2 size={28} className="spin" style={{ color: 'var(--primary-500)' }} /></div>
        ) : orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 64 }}>
            <ShoppingBag size={40} style={{ color: 'var(--neutral-300)', margin: '0 auto 16px' }} />
            <p style={{ color: 'var(--text-muted)' }}>No orders yet.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {orders.map((o) => (
              <div key={o.id} className="card" style={{ padding: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
                  <div>
                    <h3 style={{ fontSize: 16, marginBottom: 4 }}>Order {o.id.slice(0, 8).toUpperCase()}</h3>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{new Date(o.created_at).toLocaleString('en-NG')}</p>
                  </div>
                  <span className={`badge badge-${o.payment_status === 'confirmed' ? 'success' : o.payment_status === 'awaiting_transfer' ? 'warning' : 'neutral'}`}>
                    {o.payment_status.replace(/_/g, ' ')}
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16, fontSize: 14 }} className="order-info-grid">
                  <div><strong>Customer:</strong> {o.customer_name}</div>
                  <div><strong>Phone:</strong> {o.customer_phone}</div>
                  <div><strong>Email:</strong> {o.customer_email}</div>
                  <div><strong>Total:</strong> <span style={{ color: 'var(--primary-600)', fontWeight: 700 }}>{formatNaira(o.total)}</span></div>
                </div>
                {o.notes && <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 12, padding: 12, background: 'var(--neutral-50)', borderRadius: 'var(--radius)' }}>Notes: {o.notes}</p>}
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12, marginBottom: 12 }}>
                  {o.items?.map((item) => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, padding: '4px 0' }}>
                      <span>{item.product_name} × {item.quantity}</span>
                      <span>{formatNaira(item.unit_price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                {o.payment_status !== 'confirmed' && (
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <button className="btn btn-primary" style={{ padding: '8px 16px', fontSize: 14 }} onClick={() => confirmOrder(o)}>
                      <TrendingUp size={14} /> Confirm & Reduce Stock
                    </button>
                    <select className="input" style={{ width: 'auto', padding: '8px 12px', fontSize: 14 }} value={o.payment_status} onChange={(e) => updateOrderStatus(o.id, e.target.value)}>
                      <option value="awaiting_transfer">Awaiting Transfer</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                )}
              </div>
            ))}
          </div>
        )
      )}

      {(editing || adding) && (
        <ProductEditModal
          product={editing}
          onClose={() => { setEditing(null); setAdding(false); }}
          onSave={async () => { setEditing(null); setAdding(false); onRefresh(); }}
        />
      )}

      <style>{`
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media (max-width: 640px) { .order-info-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}

function ProductEditModal({ product, onClose, onSave }: {
  product: Product | null;
  onClose: () => void;
  onSave: () => void;
}) {
  const [form, setForm] = useState({
    id: product?.id || '',
    name: product?.name || '',
    category: product?.category || CATEGORIES[0],
    description: product?.description || '',
    price: product?.price?.toString() || '',
    image: product?.image || '/images/products/',
    stock: product?.stock?.toString() || '0',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const save = async () => {
    setSaving(true);
    setError('');
    try {
      const payload = {
        id: form.id || crypto.randomUUID().slice(0, 8),
        name: form.name,
        category: form.category,
        description: form.description,
        price: form.price ? parseInt(form.price) : null,
        image: form.image,
        stock: parseInt(form.stock) || 0,
        updated_at: new Date().toISOString(),
      };
      const { error: upsertError } = await supabase.from('store_products').upsert(payload);
      if (upsertError) throw new Error(upsertError.message);
      onSave();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(20,24,22,.5)', backdropFilter: 'blur(4px)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }} onClick={onClose}>
      <div className="card animate-scale" style={{ maxWidth: 560, width: '100%', maxHeight: '90vh', overflow: 'auto', padding: 24 }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontSize: 22 }}>{product ? 'Edit Product' : 'Add Product'}</h2>
          <button onClick={onClose}><X size={24} /></button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ fontSize: 14, fontWeight: 500, marginBottom: 6, display: 'block' }}>Name *</label>
            <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label style={{ fontSize: 14, fontWeight: 500, marginBottom: 6, display: 'block' }}>Category</label>
            <select className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 14, fontWeight: 500, marginBottom: 6, display: 'block' }}>Description</label>
            <textarea className="input" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ fontSize: 14, fontWeight: 500, marginBottom: 6, display: 'block' }}>Price (₦)</label>
              <input className="input" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="Leave empty for price on request" />
            </div>
            <div>
              <label style={{ fontSize: 14, fontWeight: 500, marginBottom: 6, display: 'block' }}>Stock</label>
              <input className="input" type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
            </div>
          </div>
          <div>
            <label style={{ fontSize: 14, fontWeight: 500, marginBottom: 6, display: 'block' }}>Image Path</label>
            <input className="input" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="/images/products/photo_1_2026-09-04_00-41-40.jpg" />
          </div>
          {form.image && (
            <div style={{ width: 100, height: 100, borderRadius: 'var(--radius)', overflow: 'hidden', border: '1px solid var(--border)' }}>
              <img src={form.image} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.currentTarget.style.opacity = .3; }} />
            </div>
          )}
          {error && <div className="badge badge-error" style={{ alignSelf: 'flex-start', padding: '8px 16px' }}>{error}</div>}
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button className="btn btn-outline" onClick={onClose}>Cancel</button>
            <button className="btn btn-primary" onClick={save} disabled={saving || !form.name}>
              {saving ? <Loader2 size={16} className="spin" /> : <><Save size={16} /> Save</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
