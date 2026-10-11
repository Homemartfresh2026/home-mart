import { useState, useEffect } from 'react';
import { Product, CartItem, OrderRecord, AppNotification, DispatchState } from './types';
import {
  INITIAL_PRODUCTS,
  INITIAL_DISPATCH,
} from './data/initialData';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { MarketView } from './components/MarketView';
import { BasketView } from './components/BasketView';
import { CheckoutView } from './components/CheckoutView';
import { ReceiptView } from './components/ReceiptView';
import { DispatchView } from './components/DispatchView';
import { AdminView } from './components/AdminView';
import { Toast } from './components/Toast';

export default function App() {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('hm_products');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return INITIAL_PRODUCTS;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('hm_cart_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    // Every new customer starts with an empty basket
    return [];
  });

  const [favorites, setFavorites] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('hm_favs');
    if (saved) {
      try {
        return new Set(JSON.parse(saved));
      } catch {
        // fallback
      }
    }
    return new Set<string>();
  });

  const [currentAddress, setCurrentAddress] = useState<string>('');

  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [activeTab, setActiveTab] = useState<string>('market');
  const [activeOrder, setActiveOrder] = useState<OrderRecord | null>(null);
  const [dispatchState, setDispatchState] = useState<DispatchState>(INITIAL_DISPATCH);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync products and cart to localStorage
  useEffect(() => {
    localStorage.setItem('hm_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('hm_cart_v2', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('hm_favs', JSON.stringify(Array.from(favorites)));
  }, [favorites]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 2400);
  };

  const handleToggleFavorite = (productId: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(productId)) next.delete(productId);
      else next.add(productId);
      return next;
    });
  };

  const handleAddToCart = (productId: string, selectedWeight?: string) => {
    const prod = products.find((p) => p.id === productId);
    if (!prod) return;

    setCart((prev) => {
      const existing = prev.find((item) => item.productId === productId);
      if (existing) {
        return prev.map((item) =>
          item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...prev,
        {
          productId,
          quantity: 1,
          selectedWeight: selectedWeight || prod.unit,
          pricePerUnit: prod.price,
        },
      ];
    });
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.productId === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const handleClearCart = () => {
    setCart([]);
    showToast('Basket cleared');
  };

  const handleUpdateProductPrice = (id: string, newPrice: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, price: newPrice } : p))
    );
    // Also update price in cart if present
    setCart((prev) =>
      prev.map((item) => (item.productId === id ? { ...item, pricePerUnit: newPrice } : item))
    );
  };

  const handleToggleProductStock = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, inStock: !p.inStock } : p))
    );
  };

  const handleAddNewProduct = (newProduct: Product) => {
    setProducts((prev) => [newProduct, ...prev]);
  };

  const handleArchiveProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const handlePlaceOrderSuccess = (order: OrderRecord) => {
    setActiveOrder(order);
    setActiveTab('receipt');
    setCart([]);
    showToast(`Order #${order.id} placed via WhatsApp!`);
  };

  const handleMarkNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleClearNotifications = () => {
    setNotifications([]);
    showToast('Notifications cleared');
  };

  const totalCartCount = cart.reduce((acc, c) => acc + c.quantity, 0);

  return (
    <div className="min-h-screen bg-[#faf8ff] text-[#131b2e] flex flex-col font-sans select-none">
      {/* Top Fixed App Bar */}
      <Header
        currentAddress={currentAddress}
        onAddressChange={(newAddr) => {
          setCurrentAddress(newAddr);
          showToast('Delivery address updated!');
        }}
        notifications={notifications}
        onMarkNotificationRead={handleMarkNotificationRead}
        onClearNotifications={handleClearNotifications}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Screen Content View */}
      <main className="flex-1 w-full pt-20">
        {activeTab === 'market' && (
          <MarketView
            products={products}
            cart={cart}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onAddToCart={handleAddToCart}
            onUpdateQuantity={handleUpdateQuantity}
            onNavigateToBasket={() => setActiveTab('basket')}
            onShowToast={showToast}
          />
        )}

        {activeTab === 'basket' && (
          <BasketView
            products={products}
            cart={cart}
            onUpdateQuantity={handleUpdateQuantity}
            onClearCart={handleClearCart}
            onProceedToCheckout={() => setActiveTab('checkout')}
            onStartShopping={() => setActiveTab('market')}
          />
        )}

        {activeTab === 'checkout' && (
          <CheckoutView
            products={products}
            cart={cart}
            currentAddress={currentAddress}
            onPlaceOrderSuccess={handlePlaceOrderSuccess}
            onShowToast={showToast}
          />
        )}

        {activeTab === 'receipt' && (
          <ReceiptView
            order={activeOrder}
            onBackToMarket={() => setActiveTab('market')}
            onTrackInDispatch={() => setActiveTab('dispatch')}
          />
        )}

        {activeTab === 'dispatch' && (
          <DispatchView
            dispatchState={dispatchState}
            onUpdateDispatchState={setDispatchState}
            onShowToast={showToast}
          />
        )}

        {activeTab === 'admin' && (
          <AdminView
            products={products}
            onUpdateProductPrice={handleUpdateProductPrice}
            onToggleProductStock={handleToggleProductStock}
            onAddNewProduct={handleAddNewProduct}
            onArchiveProduct={handleArchiveProduct}
            onShowToast={showToast}
          />
        )}
      </main>

      {/* Bottom Tab Navigation */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartCount={totalCartCount}
      />

      {/* Transient Action Feedback Toast */}
      <Toast message={toastMessage} />
    </div>
  );
}
