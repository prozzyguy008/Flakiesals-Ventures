import { MapPin, Phone, Clock } from 'lucide-react';
import { navigate } from '../App';

export function Footer() {
  return (
    <footer style={{ background: 'var(--neutral-900)', color: 'var(--neutral-300)', marginTop: 64 }}>
      <div className="container" style={{ padding: '48px 24px', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 40 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--primary-500)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: 'var(--accent-300)', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22 }}>F</span>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 16, color: '#fff' }}>FLAKIESALS</div>
              <div style={{ fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--neutral-400)' }}>Ventures</div>
            </div>
          </div>
          <p style={{ fontSize: 14, color: 'var(--neutral-400)', maxWidth: 320 }}>
            Your trusted countertop store and souvenir business in Ilorin. Quality kitchen, cookware, and home essentials at fair prices.
          </p>
        </div>

        <div>
          <h4 style={{ color: '#fff', fontSize: 14, marginBottom: 16 }}>Shop</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button className="btn btn-ghost" style={{ justifyContent: 'flex-start', padding: 0, color: 'var(--neutral-400)' }} onClick={() => navigate({ name: 'shop' })}>All Products</button>
            <button className="btn btn-ghost" style={{ justifyContent: 'flex-start', padding: 0, color: 'var(--neutral-400)' }} onClick={() => navigate({ name: 'shop', category: 'Kitchen & Cookware' })}>Kitchen & Cookware</button>
            <button className="btn btn-ghost" style={{ justifyContent: 'flex-start', padding: 0, color: 'var(--neutral-400)' }} onClick={() => navigate({ name: 'shop', category: 'Water Bottles & Flasks' })}>Water Bottles & Flasks</button>
            <button className="btn btn-ghost" style={{ justifyContent: 'flex-start', padding: 0, color: 'var(--neutral-400)' }} onClick={() => navigate({ name: 'shop', category: 'Gifts & Souvenirs' })}>Gifts & Souvenirs</button>
          </div>
        </div>

        <div>
          <h4 style={{ color: '#fff', fontSize: 14, marginBottom: 16 }}>Business</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 14, color: 'var(--neutral-400)' }}>
            <div>Countertop Store / Kitchen Supply Store</div>
            <div>Payment: Bank Transfer</div>
            <div>Pickup: In-store</div>
            <button className="btn btn-ghost" style={{ justifyContent: 'flex-start', padding: 0, color: 'var(--accent-300)' }} onClick={() => navigate({ name: 'admin' })}>Admin Panel</button>
          </div>
        </div>

        <div>
          <h4 style={{ color: '#fff', fontSize: 14, marginBottom: 16 }}>Contact</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 14, color: 'var(--neutral-400)' }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
              <MapPin size={16} style={{ flexShrink: 0, marginTop: 2 }} />
              <span>OWO NI BOYS, 157 Off Otunola Adebayo Rd, Ilorin 240101, Kwara</span>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <Phone size={16} />
              <span>0814 507 9572</span>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <Clock size={16} />
              <span>Mon – Sat: 9am – 7pm</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ borderTop: '1px solid var(--neutral-800)' }}>
        <div className="container" style={{ padding: '20px 24px', fontSize: 13, color: 'var(--neutral-500)', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
          <span>© {new Date().getFullYear()} FLAKIESALS Ventures. All rights reserved.</span>
          <span>Wema Bank · 0231534026 · Flakiesals Ventures</span>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .container > div[style*="grid-template-columns: 2fr 1fr 1fr 1fr"] {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 480px) {
          .container > div[style*="grid-template-columns: 2fr 1fr 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
}
