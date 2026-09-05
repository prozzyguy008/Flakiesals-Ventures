import { useMemo, useState, useEffect } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import type { Product } from '../lib/supabase';
import { CATEGORIES, formatNaira } from '../lib/supabase';
import { ProductCard } from '../components/ProductCard';
import { navigate } from '../App';

export function ShopPage({ products, loading, initialCategory, initialQuery }: {
  products: Product[];
  loading: boolean;
  initialCategory?: string;
  initialQuery?: string;
}) {
  const [category, setCategory] = useState<string | undefined>(initialCategory);
  const [query, setQuery] = useState(initialQuery || '');
  const [sortBy, setSortBy] = useState<'name' | 'price-low' | 'price-high'>('name');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => { setCategory(initialCategory); }, [initialCategory]);
  useEffect(() => { setQuery(initialQuery || ''); }, [initialQuery]);

  const filtered = useMemo(() => {
    let result = products;
    if (category) result = result.filter((p) => p.category === category);
    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
    }
    result = [...result];
    if (sortBy === 'name') result.sort((a, b) => a.name.localeCompare(b.name));
    else if (sortBy === 'price-low') result.sort((a, b) => (a.price ?? 999999) - (b.price ?? 999999));
    else if (sortBy === 'price-high') result.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
    return result;
  }, [products, category, query, sortBy]);

  const selectCategory = (cat: string | undefined) => {
    setCategory(cat);
    navigate({ name: 'shop', category: cat, query: query || undefined });
  };

  return (
    <div className="container animate-fade" style={{ padding: '32px 24px 64px' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 32, marginBottom: 8 }}>
          {category ? category : 'All Products'}
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>{filtered.length} product{filtered.length !== 1 ? 's' : ''}{query && ` matching "${query}"`}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 32 }} className="shop-layout">
        {/* Sidebar */}
        <aside className="shop-sidebar" style={{ position: 'sticky', top: 88, alignSelf: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--neutral-400)' }} />
              <input className="input" placeholder="Search…" value={query} onChange={(e) => setQuery(e.target.value)} style={{ paddingLeft: 38 }} />
            </div>

            <div>
              <h3 style={{ marginBottom: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, fontSize: 12 }}>Categories</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <button className="btn btn-ghost" style={{ justifyContent: 'flex-start', padding: '8px 12px', fontSize: 14, fontWeight: category === undefined ? 600 : 400, color: category === undefined ? 'var(--primary-500)' : 'var(--text)' }} onClick={() => selectCategory(undefined)}>All Products</button>
                {CATEGORIES.map((cat) => {
                  const count = products.filter((p) => p.category === cat).length;
                  if (count === 0) return null;
                  return (
                    <button key={cat} className="btn btn-ghost" style={{ justifyContent: 'flex-start', padding: '8px 12px', fontSize: 14, fontWeight: category === cat ? 600 : 400, color: category === cat ? 'var(--primary-500)' : 'var(--text)' }} onClick={() => selectCategory(cat)}>
                      {cat} <span style={{ marginLeft: 'auto', color: 'var(--neutral-400)', fontSize: 12 }}>{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </aside>

        {/* Products */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, gap: 12, flexWrap: 'wrap' }}>
            <button className="btn btn-outline filter-toggle" style={{ display: 'none' }} onClick={() => setShowFilters(!showFilters)}>
              <SlidersHorizontal size={16} /> Filters
            </button>
            <select className="input" style={{ width: 'auto', marginLeft: 'auto' }} value={sortBy} onChange={(e) => setSortBy(e.target.value as typeof sortBy)}>
              <option value="name">Sort: Name A–Z</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>

          {showFilters && (
            <div className="card animate-scale mobile-filters" style={{ padding: 16, marginBottom: 20, display: 'none' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <h3 style={{ fontSize: 16 }}>Filters</h3>
                <button onClick={() => setShowFilters(false)}><X size={20} /></button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                <button className="badge badge-primary" style={{ cursor: 'pointer' }} onClick={() => selectCategory(undefined)}>All</button>
                {CATEGORIES.filter((c) => products.some((p) => p.category === c)).map((cat) => (
                  <button key={cat} className="badge" style={{ cursor: 'pointer', background: category === cat ? 'var(--primary-50)' : 'var(--neutral-100)', color: category === cat ? 'var(--primary-600)' : 'var(--text)' }} onClick={() => selectCategory(cat)}>{cat}</button>
                ))}
              </div>
            </div>
          )}

          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20 }} className="product-grid">
              {Array.from({ length: 12 }).map((_, i) => <div key={i} className="skeleton" style={{ aspectRatio: '1', borderRadius: 'var(--radius-lg)' }} />)}
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '64px 24px' }}>
              <p style={{ fontSize: 18, color: 'var(--text-muted)', marginBottom: 16 }}>No products found.</p>
              <button className="btn btn-primary" onClick={() => { setQuery(''); selectCategory(undefined); }}>Clear filters</button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20 }} className="product-grid">
              {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .shop-layout { grid-template-columns: 1fr !important; }
          .shop-sidebar { display: none !important; }
          .filter-toggle { display: inline-flex !important; }
          .mobile-filters { display: block !important; }
        }
      `}</style>
    </div>
  );
}
