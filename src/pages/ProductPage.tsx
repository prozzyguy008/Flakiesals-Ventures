import { useState } from 'react';
import { ArrowLeft, Minus, Plus, ShoppingBag, Check } from 'lucide-react';
import type { Product } from '../lib/supabase';
import { formatNaira } from '../lib/supabase';
import { useCart } from '../lib/cart';
import { navigate } from '../App';
import { ProductCard } from '../components/ProductCard';

export function ProductPage({ products, loading }: { products: Product[]; loading: boolean }) {
  const id = window.location.hash.replace(/^#\/product\//, '').split('?')[0];
  const product = products.find((p) => p.id === id);
  const { add } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (loading) {
    return <div className="container" style={{ padding: '64px 24px' }}><div className="skeleton" style={{ height: 400, borderRadius: 'var(--radius-lg)' }} /></div>;
  }

  if (!product) {
    return (
      <div className="container" style={{ padding: '64px 24px', textAlign: 'center' }}>
        <h1 style={{ marginBottom: 16 }}>Product not found</h1>
        <button className="btn btn-primary" onClick={() => navigate({ name: 'shop' })}>Back to Shop</button>
      </div>
    );
  }

  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  const handleAdd = () => {
    add(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="container animate-fade" style={{ padding: '32px 24px 64px' }}>
      <button className="btn btn-ghost" style={{ marginBottom: 24, padding: '8px 0' }} onClick={() => navigate({ name: 'shop' })}>
        <ArrowLeft size={18} /> Back to Shop
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48 }} className="product-detail-layout">
        <div className="card" style={{ overflow: 'hidden', aspectRatio: '1', background: 'var(--neutral-50)' }}>
          <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.currentTarget.style.opacity = .3; }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <span className="badge badge-primary" style={{ alignSelf: 'flex-start' }}>{product.category}</span>
          <h1 style={{ fontSize: 28, lineHeight: 1.2 }}>{product.name}</h1>
          <p style={{ fontSize: 18, color: 'var(--text-muted)', lineHeight: 1.6 }}>{product.description}</p>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 32, color: 'var(--primary-600)' }}>
              {formatNaira(product.price)}
            </span>
            {product.stock > 0 ? (
              <span className="badge badge-success">In stock ({product.stock})</span>
            ) : (
              <span className="badge badge-error">Out of stock</span>
            )}
          </div>

          {product.stock > 0 && product.price != null && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid var(--border)', borderRadius: 'var(--radius)' }}>
                  <button style={{ padding: '12px 16px' }} disabled={quantity <= 1} onClick={() => setQuantity(quantity - 1)}><Minus size={16} /></button>
                  <span style={{ padding: '0 20px', fontWeight: 600, minWidth: 40, textAlign: 'center' }}>{quantity}</span>
                  <button style={{ padding: '12px 16px' }} disabled={quantity >= product.stock} onClick={() => setQuantity(quantity + 1)}><Plus size={16} /></button>
                </div>
                <button className="btn btn-primary" style={{ flex: 1, padding: '14px 24px', fontSize: 16 }} onClick={handleAdd} disabled={added}>
                  {added ? <><Check size={18} /> Added to cart</> : <><ShoppingBag size={18} /> Add to cart</>}
                </button>
              </div>
              <button className="btn btn-accent" style={{ padding: '14px 24px', fontSize: 16 }} onClick={() => { add(product, quantity); navigate({ name: 'checkout' }); }}>
                Buy now
              </button>
            </>
          )}

          <div style={{ marginTop: 16, padding: 20, borderRadius: 'var(--radius)', background: 'var(--primary-50)', border: '1px solid var(--primary-100)' }}>
            <h4 style={{ fontSize: 14, marginBottom: 8, color: 'var(--primary-700)' }}>Payment & Pickup</h4>
            <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>
              Pay via bank transfer to Wema Bank · 0231534026 · Flakiesals Ventures. Pick up your order in-store at OWO NI BOYS, Ilorin. No delivery available.
            </p>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section style={{ marginTop: 64 }}>
          <h2 style={{ fontSize: 24, marginBottom: 24 }}>You may also like</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20 }} className="product-grid">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

      <style>{`
        @media (max-width: 768px) {
          .product-detail-layout { grid-template-columns: 1fr !important; gap: 24px !important; }
        }
      `}</style>
    </div>
  );
}
