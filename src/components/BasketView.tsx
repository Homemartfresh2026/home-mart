import React, { useState } from 'react';
import { Product, CartItem } from '../types';

interface BasketViewProps {
  products: Product[];
  cart: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onClearCart: () => void;
  onProceedToCheckout: () => void;
  onStartShopping: () => void;
}

export const BasketView: React.FC<BasketViewProps> = ({
  products,
  cart,
  onUpdateQuantity,
  onClearCart,
  onProceedToCheckout,
  onStartShopping,
}) => {
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>('FRESH10');
  const [couponError, setCouponError] = useState('');

  const cartDetails = cart
    .map((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) return null;
      return {
        ...item,
        product,
        lineTotal: item.quantity * item.pricePerUnit,
      };
    })
    .filter(Boolean) as {
    productId: string;
    quantity: number;
    selectedWeight?: string;
    pricePerUnit: number;
    product: Product;
    lineTotal: number;
  }[];

  const subtotal = cartDetails.reduce((acc, item) => acc + item.lineTotal, 0);
  const discount = appliedCoupon && subtotal > 300 ? 50 : 0;
  const packagingFee = subtotal > 0 ? 6 : 0;
  const total = subtotal > 0 ? Math.max(0, subtotal - discount + packagingFee) : 0;

  const handleApplyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (code === 'FRESH10' || code === 'HARVEST35') {
      setAppliedCoupon(code);
      setCouponError('');
    } else {
      setCouponError('Invalid coupon code. Try FRESH10');
    }
  };

  return (
    <div className="flex flex-col w-full pb-24 max-w-md mx-auto p-4 space-y-4">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-1 border-b border-[#eaedff]">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#006b2c] text-[22px]">shopping_bag</span>
          <h2 className="font-extrabold text-[17px] text-[#131b2e]">Review Basket</h2>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#eaedff] text-[#006b2c] font-inter">
            {cart.reduce((a, b) => a + b.quantity, 0)} items
          </span>
        </div>

        {cartDetails.length > 0 && (
          <button
            onClick={onClearCart}
            className="text-xs text-[#ba1a1a] font-bold flex items-center gap-1 hover:underline active:scale-95"
          >
            <span className="material-symbols-outlined text-[15px]">delete_sweep</span>
            <span>Clear</span>
          </button>
        )}
      </div>

      {/* Basket Items List */}
      {cartDetails.length === 0 ? (
        <div className="text-center py-16 space-y-3 bg-white rounded-2xl border border-[#dae2fd]/60 p-6 shadow-xs">
          <div className="w-16 h-16 bg-[#006b2c]/10 text-[#006b2c] rounded-full flex items-center justify-center text-3xl mx-auto shadow-inner">
            <span className="material-symbols-outlined text-[32px]">shopping_basket</span>
          </div>
          <h3 className="font-extrabold text-[#131b2e] text-[15px]">Your basket is empty</h3>
          <p className="text-xs text-[#6e7b6c] max-w-xs mx-auto">
            Add farm-fresh produce, summer berries, and daily cooking essentials from the storefront.
          </p>
          <button
            onClick={onStartShopping}
            className="mt-2 inline-flex items-center gap-1.5 bg-[#006b2c] text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md active:scale-95 transition"
          >
            <span className="material-symbols-outlined text-[16px]">storefront</span>
            <span>Start Shopping</span>
          </button>
        </div>
      ) : (
        <div className="space-y-2.5">
          {cartDetails.map((item) => (
            <div
              key={item.productId}
              className="bg-white border border-[#dae2fd]/50 rounded-2xl p-3 shadow-xs flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-13 h-13 rounded-xl object-cover bg-[#f2f3ff] shrink-0 border border-[#dae2fd]/40"
                />
                <div className="min-w-0">
                  <h4 className="font-bold text-xs text-[#131b2e] truncate">{item.product.name}</h4>
                  <div className="text-[10px] text-[#6e7b6c] mt-0.5 font-inter">
                    ₹{item.pricePerUnit} • {item.selectedWeight || item.product.unit}
                  </div>
                  <span className="text-[9px] font-bold text-[#006b2c] bg-[#acf847]/30 px-1.5 py-0.2 rounded mt-0.5 inline-block">
                    In Stock
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                {/* Stepper */}
                <div className="flex items-center bg-[#f2f3ff] rounded-xl px-1.5 py-1 border border-[#dae2fd]">
                  <button
                    onClick={() => onUpdateQuantity(item.productId, -1)}
                    className="w-6 h-6 flex items-center justify-center font-black text-xs text-[#131b2e] hover:bg-white rounded-lg active:scale-90"
                    aria-label="Decrease"
                  >
                    －
                  </button>
                  <span className="text-xs font-black text-[#131b2e] px-2 font-inter">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => onUpdateQuantity(item.productId, 1)}
                    className="w-6 h-6 flex items-center justify-center font-black text-xs text-[#131b2e] hover:bg-white rounded-lg active:scale-90"
                    aria-label="Increase"
                  >
                    ＋
                  </button>
                </div>

                {/* Line Total */}
                <div className="text-xs font-black text-[#131b2e] font-inter text-right w-12">
                  ₹{item.lineTotal}
                </div>
              </div>
            </div>
          ))}

          {/* Coupon Code Input */}
          <div className="bg-white border border-[#dae2fd]/50 rounded-2xl p-3 shadow-xs space-y-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#006b2c] text-[18px]">loyalty</span>
              <span className="text-xs font-bold text-[#131b2e]">Have a Promo Code?</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Try FRESH10"
                className="flex-1 text-xs uppercase px-3 py-2 bg-[#f2f3ff] rounded-xl border border-[#dae2fd] outline-none font-inter font-bold"
              />
              <button
                onClick={handleApplyCoupon}
                className="px-3.5 py-2 bg-[#006b2c] text-white rounded-xl text-xs font-bold active:scale-95"
              >
                Apply
              </button>
            </div>
            {couponError && <p className="text-[10px] text-[#ba1a1a]">{couponError}</p>}
            {appliedCoupon && (
              <div className="flex items-center justify-between text-[11px] text-[#006b2c] font-bold bg-[#acf847]/20 p-2 rounded-lg">
                <span>Code '{appliedCoupon}' applied (₹50 discount &gt; ₹300)</span>
                <button
                  onClick={() => setAppliedCoupon(null)}
                  className="text-[10px] text-[#ba1a1a] underline"
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          {/* Bill Breakdown Card */}
          <div className="bg-white border border-[#dae2fd]/60 rounded-2xl p-4 shadow-xs space-y-2.5">
            <h3 className="font-extrabold text-[#131b2e] text-[11px] uppercase tracking-wider">
              Bill Breakdown
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-[#3e4a3d]">
                <span>Items Subtotal</span>
                <span className="font-bold text-[#131b2e] font-inter">₹{subtotal}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-[#006b2c]">
                  <span>Fresh Promo Discount</span>
                  <span className="font-bold font-inter">-₹{discount}</span>
                </div>
              )}

              <div className="flex justify-between text-[#3e4a3d]">
                <span>Delivery Partner Fee</span>
                <span className="text-[#006b2c] font-bold uppercase text-[10px] bg-[#acf847]/30 px-2 py-0.5 rounded-full">
                  FREE (Express 15-20 mins)
                </span>
              </div>

              <div className="flex justify-between text-[#3e4a3d]">
                <span>Eco Packaging & Handling</span>
                <span className="font-bold text-[#131b2e] font-inter">₹{packagingFee}</span>
              </div>

              <div className="border-t border-[#eaedff] pt-2.5 flex justify-between text-[15px] font-extrabold text-[#131b2e]">
                <span>Total Payable</span>
                <span className="text-[#006b2c] font-inter font-black">₹{total}</span>
              </div>
            </div>
          </div>

          {/* Proceed Button */}
          <div className="pt-2">
            <button
              onClick={onProceedToCheckout}
              className="w-full bg-[#006b2c] hover:bg-[#005320] text-white font-extrabold py-3.5 px-4 rounded-2xl shadow-lg flex items-center justify-between text-sm transition-all active:scale-[0.99]"
            >
              <span className="font-inter font-black">Pay ₹{total}</span>
              <span className="flex items-center gap-1.5">
                <span>Proceed to Checkout</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
