import { Link } from 'lucide-react';
import type { Product } from '../lib/supabase';
import { formatNaira } from '../lib/supabase';
import { useCart } from '../lib/cart';
import { navigate } from '../App';

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();

  return (
    <div className="card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'all .25s ease', cursor: 'pointer' }}
      onClick={() => navigate({ name: 'product', id: product.id })}
      onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
    >
      <div style={{ position: 'relative', aspectRatio: '1', background: 'var(--neutral-50)', overflow: 'hidden' }}>
        <img src={product.image} alt={product.name} loading="lazy"
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .4s ease' }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = ''; }}
          onError={(e) => { e.currentTarget.style.opacity = .3; }}
        />
        {product.stock === 0 && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(20,24,22,.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span className="badge badge-error" style={{ fontSize: 14, padding: '6px 16px' }}>Out of stock</span>
          </div>
        )}
        {product.stock > 0 && product.stock <= 5 && (
          <span className="badge badge-warning" style={{ position: 'absolute', top: 10, left: 10 }}>Only {product.stock} left</span>
        )}
      </div>

      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
        <span className="badge badge-primary" style={{ alignSelf: 'flex-start' }}>{product.category}</span>
        <h3 style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.3, minHeight: '2.6em', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{product.name}</h3>
        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, color: 'var(--primary-600)' }}>
            {formatNaira(product.price)}
          </span>
          <button
            className="btn btn-primary"
            style={{ padding: '8px 14px', fontSize: 13 }}
            disabled={product.stock === 0 || product.price == null}
            onClick={(e) => { e.stopPropagation(); add(product); }}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
