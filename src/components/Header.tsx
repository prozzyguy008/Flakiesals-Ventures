import { useState } from 'react';
import { ShoppingBag, Search, Menu, X } from 'lucide-react';
import { useCart } from '../lib/cart';
import { navigate } from '../App';
import { CATEGORIES } from '../lib/supabase';

export function Header() {
  const { count } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ name: 'shop', query: searchQuery || undefined });
    setMobileOpen(false);
  };

  const go = (route: Parameters<typeof navigate>[0]) => {
    navigate(route);
    setMobileOpen(false);
  };

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(255,255,255,.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border)' }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', gap: 24, height: 72 }}>
        <button onClick={() => go({ name: 'home' })} style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--primary-500)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: 'var(--accent-300)', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 24 }}>F</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18, color: 'var(--text)' }}>FLAKIESALS</span>
            <span style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: 1, textTransform: 'uppercase' }}>Ventures</span>
          </div>
        </button>

        <nav style={{ display: 'flex', gap: 4, flex: 1, marginLeft: 8 }} className="nav-desktop">
          <button className="btn btn-ghost" onClick={() => go({ name: 'home' })}>Home</button>
          <div className="nav-category" style={{ position: 'relative' }}>
            <button className="btn btn-ghost">Shop ▾</button>
            <div className="nav-dropdown" style={{ position: 'absolute', top: '100%', left: 0, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-lg)', padding: 8, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, minWidth: 420, opacity: 0, visibility: 'hidden', transition: 'all .2s' }}>
              {CATEGORIES.map((cat) => (
                <button key={cat} className="btn btn-ghost" style={{ justifyContent: 'flex-start', padding: '8px 12px', fontSize: 14 }} onClick={() => go({ name: 'shop', category: cat })}>{cat}</button>
              ))}
            </div>
          </div>
          <button className="btn btn-ghost" onClick={() => go({ name: 'shop' })}>All Products</button>
        </nav>

        <form onSubmit={submitSearch} className="search-bar" style={{ flex: 1, maxWidth: 280, position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--neutral-400)' }} />
          <input className="input" placeholder="Search products…" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ paddingLeft: 38 }} />
        </form>

        <button onClick={() => go({ name: 'cart' })} style={{ position: 'relative', padding: 10, borderRadius: 'var(--radius)', border: '1.5px solid var(--border)', transition: 'all .2s' }} className="cart-btn">
          <ShoppingBag size={20} />
          {count > 0 && (
            <span style={{ position: 'absolute', top: -6, right: -6, background: 'var(--accent-300)', color: 'var(--neutral-900)', fontSize: 11, fontWeight: 700, minWidth: 20, height: 20, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px' }}>{count}</span>
          )}
        </button>

        <button onClick={() => setMobileOpen(!mobileOpen)} className="mobile-toggle" style={{ display: 'none', padding: 8 }}>
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="container mobile-menu" style={{ paddingBottom: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button className="btn btn-outline" onClick={() => go({ name: 'home' })}>Home</button>
          <button className="btn btn-outline" onClick={() => go({ name: 'shop' })}>All Products</button>
          {CATEGORIES.map((cat) => (
            <button key={cat} className="btn btn-ghost" style={{ justifyContent: 'flex-start', textAlign: 'left' }} onClick={() => go({ name: 'shop', category: cat })}>{cat}</button>
          ))}
        </div>
      )}

      <style>{`
        .nav-category:hover .nav-dropdown { opacity: 1 !important; visibility: visible !important; }
        @media (max-width: 900px) {
          .nav-desktop { display: none !important; }
          .search-bar { display: none !important; }
          .mobile-toggle { display: block !important; }
          .mobile-menu { display: flex !important; }
        }
      `}</style>
    </header>
  );
}
