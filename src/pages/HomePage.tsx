import { useMemo } from 'react';
import { ArrowRight, Truck, ShieldCheck, Store } from 'lucide-react';
import type { Product } from '../lib/supabase';
import { CATEGORIES } from '../lib/supabase';
import { ProductCard } from '../components/ProductCard';
import { navigate } from '../App';

export function HomePage({ products, loading }: { products: Product[]; loading: boolean }) {
  const featured = useMemo(() => products.slice(0, 8), [products]);
  const bestSellers = useMemo(() => products.filter((p) => p.price != null).slice(0, 4), [products]);

  return (
    <div className="animate-fade">
      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, var(--primary-700) 0%, var(--primary-500) 50%, var(--primary-600) 100%)', color: '#fff', overflow: 'hidden', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: .08, backgroundImage: 'radial-gradient(circle at 20% 50%, var(--accent-300) 0%, transparent 50%), radial-gradient(circle at 80% 80%, var(--accent-300) 0%, transparent 40%)' }} />
        <div className="container" style={{ position: 'relative', padding: '80px 24px', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 48, alignItems: 'center' }}>
          <div>
            <span className="badge" style={{ background: 'rgba(232,181,71,.2)', color: 'var(--accent-300)', marginBottom: 20 }}>Countertop Store & Souvenirs · Ilorin</span>
            <h1 style={{ fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 800, lineHeight: 1.1, marginBottom: 20 }}>
              Quality kitchen & home essentials for every Nigerian home
            </h1>
            <p style={{ fontSize: 18, color: 'rgba(255,255,255,.85)', maxWidth: 480, marginBottom: 32, lineHeight: 1.6 }}>
              From cookware and blenders to water bottles and storage solutions — FLAKIESALS Ventures brings you durable, affordable products with in-store pickup in Ilorin.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button className="btn btn-accent" style={{ padding: '14px 28px', fontSize: 16 }} onClick={() => navigate({ name: 'shop' })}>
                Shop All Products <ArrowRight size={18} />
              </button>
              <button className="btn btn-outline" style={{ padding: '14px 28px', fontSize: 16, color: '#fff', borderColor: 'rgba(255,255,255,.3)' }} onClick={() => navigate({ name: 'shop', category: 'Kitchen & Cookware' })}>
                Browse Kitchen
              </button>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }} className="hero-grid">
            {bestSellers.map((p, i) => (
              <div key={p.id} style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', aspectRatio: '1', border: '2px solid rgba(255,255,255,.15)', transform: i % 2 === 0 ? 'translateY(-12px)' : 'translateY(12px)' }} onClick={() => navigate({ name: 'product', id: p.id })}>
                <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }} onError={(e) => { e.currentTarget.style.opacity = .3; }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust badges */}
      <section className="container" style={{ padding: '40px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }} className="trust-grid">
          {[
            { icon: Store, title: 'In-Store Pickup', desc: 'No delivery — pick up your order at our Ilorin store.' },
            { icon: ShieldCheck, title: 'Quality Guaranteed', desc: 'Durable, trusted brands like RAF and GDTIMES.' },
            { icon: Truck, title: 'Bank Transfer Payment', desc: 'Pay easily via bank transfer to our Wema Bank account.' },
          ].map((item) => (
            <div key={item.title} style={{ display: 'flex', gap: 16, alignItems: 'flex-start', padding: 24, borderRadius: 'var(--radius-lg)', background: 'var(--surface)', border: '1px solid var(--border)' }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--primary-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <item.icon size={24} style={{ color: 'var(--primary-500)' }} />
              </div>
              <div>
                <h3 style={{ fontSize: 16, marginBottom: 4 }}>{item.title}</h3>
                <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="container" style={{ padding: '24px 24px 48px' }}>
        <h2 style={{ fontSize: 28, marginBottom: 24 }}>Shop by Category</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }} className="cat-grid">
          {CATEGORIES.map((cat) => {
            const count = products.filter((p) => p.category === cat).length;
            if (count === 0) return null;
            return (
              <button key={cat} className="card" style={{ padding: 20, textAlign: 'left', transition: 'all .2s', display: 'flex', flexDirection: 'column', gap: 4 }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary-500)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = ''; e.currentTarget.style.transform = ''; }}
                onClick={() => navigate({ name: 'shop', category: cat })}
              >
                <span style={{ fontWeight: 600, fontSize: 15 }}>{cat}</span>
                <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{count} product{count !== 1 ? 's' : ''}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Featured */}
      <section className="container" style={{ padding: '24px 24px 48px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <h2 style={{ fontSize: 28 }}>Featured Products</h2>
          <button className="btn btn-ghost" onClick={() => navigate({ name: 'shop' })}>View all <ArrowRight size={16} /></button>
        </div>
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 20 }} className="product-grid">
            {Array.from({ length: 8 }).map((_, i) => <div key={i} className="skeleton" style={{ aspectRatio: '1', borderRadius: 'var(--radius-lg)' }} />)}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 20 }} className="product-grid">
            {featured.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>

      <style>{`
        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr 1fr !important; transform: none !important; }
          .trust-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 900px) {
          .container[style*="grid-template-columns: 1.2fr 1fr"] { grid-template-columns: 1fr !important; }
          .hero-grid { display: none !important; }
        }
      `}</style>
    </div>
  );
}
