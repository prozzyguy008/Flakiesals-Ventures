import { useEffect, useState } from 'react';
import { supabase, type Product } from './lib/supabase';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductPage } from './pages/ProductPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { AdminPage } from './pages/AdminPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';

type Route =
  | { name: 'home' }
  | { name: 'shop'; category?: string; query?: string }
  | { name: 'product'; id: string }
  | { name: 'cart' }
  | { name: 'checkout' }
  | { name: 'confirmation'; orderId: string }
  | { name: 'admin' };

function parseHash(): Route {
  const hash = window.location.hash.replace(/^#\/?/, '');
  const [path, queryString] = hash.split('?');
  const segments = path.split('/').filter(Boolean);
  const params = new URLSearchParams(queryString || '');

  if (segments.length === 0) return { name: 'home' };
  if (segments[0] === 'shop') {
    return { name: 'shop', category: params.get('category') || undefined, query: params.get('q') || undefined };
  }
  if (segments[0] === 'product' && segments[1]) return { name: 'product', id: segments[1] };
  if (segments[0] === 'cart') return { name: 'cart' };
  if (segments[0] === 'checkout') return { name: 'checkout' };
  if (segments[0] === 'confirmation' && segments[1]) return { name: 'confirmation', orderId: segments[1] };
  if (segments[0] === 'admin') return { name: 'admin' };
  return { name: 'home' };
}

export function navigate(route: Omit<Route, never>) {
  let hash = '#/';
  if (route.name === 'shop') {
    const params = new URLSearchParams();
    if (route.category) params.set('category', route.category);
    if (route.query) params.set('q', route.query);
    const qs = params.toString();
    hash = `#/shop${qs ? '?' + qs : ''}`;
  } else if (route.name === 'product') hash = `#/product/${route.id}`;
  else if (route.name === 'cart') hash = '#/cart';
  else if (route.name === 'checkout') hash = '#/checkout';
  else if (route.name === 'confirmation') hash = `#/confirmation/${route.orderId}`;
  else if (route.name === 'admin') hash = '#/admin';
  window.location.hash = hash;
  window.scrollTo(0, 0);
}

export function App() {
  const [route, setRoute] = useState<Route>(parseHash());
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const onHash = () => setRoute(parseHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from('store_products')
        .select('*')
        .order('id', { ascending: true });
      if (!cancelled) {
        if (error) {
          console.error('Failed to load products:', error.message);
        }
        setProducts((data as Product[]) || []);
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const refreshProducts = async () => {
    const { data } = await supabase.from('store_products').select('*').order('id', { ascending: true });
    setProducts((data as Product[]) || []);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <main style={{ flex: 1 }}>
        {route.name === 'home' && <HomePage products={products} loading={loading} />}
        {route.name === 'shop' && <ShopPage products={products} loading={loading} initialCategory={route.category} initialQuery={route.query} />}
        {route.name === 'product' && <ProductPage products={products} loading={loading} />}
        {route.name === 'cart' && <CartPage />}
        {route.name === 'checkout' && <CheckoutPage onOrderPlaced={refreshProducts} />}
        {route.name === 'confirmation' && <OrderConfirmationPage orderId={route.orderId} />}
        {route.name === 'admin' && <AdminPage products={products} loading={loading} onRefresh={refreshProducts} />}
      </main>
      <Footer />
    </div>
  );
}
