import React from 'react';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  cartCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  setActiveTab,
  cartCount,
}) => {
  const tabs = [
    { id: 'market', label: 'Market', icon: 'storefront' },
    { id: 'basket', label: 'My Basket', icon: 'shopping_bag', badge: cartCount },
    { id: 'checkout', label: 'Pay', icon: 'payment' },
    { id: 'receipt', label: 'Orders', icon: 'receipt_long' },
    { id: 'dispatch', label: 'Dispatch', icon: 'two_wheeler' },
    { id: 'admin', label: 'Admin', icon: 'tune' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 pb-safe bg-[#faf8ff]/95 backdrop-blur-xl border-t border-[#dae2fd]/60 shadow-[0_-4px_20px_-4px_rgba(15,23,42,0.08)]">
      <div className="max-w-md mx-auto flex items-center justify-between h-16 px-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex flex-col items-center justify-center flex-1 h-12 gap-0.5 transition-all ${
                isActive
                  ? 'text-[#006b2c] font-bold scale-105'
                  : 'text-[#3e4a3d]/80 hover:text-[#131b2e]'
              }`}
            >
              <div className="relative flex items-center justify-center">
                <span
                  className="material-symbols-outlined text-[22px]"
                  style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  {tab.icon}
                </span>

                {typeof tab.badge === 'number' && tab.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 px-1 min-w-[17px] h-[17px] flex items-center justify-center rounded-full bg-[#006b2c] text-white text-[10px] leading-none font-black font-inter shadow-xs animate-bounce">
                    {tab.badge}
                  </span>
                )}
              </div>

              <span className="text-[11px] leading-tight font-semibold tracking-tight">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
