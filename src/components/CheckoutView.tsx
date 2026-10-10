import React, { useState } from 'react';
import { Product, CartItem, OrderRecord } from '../types';

interface CheckoutViewProps {
  products: Product[];
  cart: CartItem[];
  currentAddress: string;
  onPlaceOrderSuccess: (order: OrderRecord) => void;
  onShowToast: (msg: string) => void;
}

export const CheckoutView: React.FC<CheckoutViewProps> = ({
  products,
  cart,
  currentAddress,
  onPlaceOrderSuccess,
  onShowToast,
}) => {
  const [custName, setCustName] = useState('Rahul S.');
  const [custPhone, setCustPhone] = useState('+91 98765 43210');
  const [custAddress, setCustAddress] = useState(currentAddress);
  const [payMethod, setPayMethod] = useState<'upi' | 'cod'>('upi');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

  const STORE_UPI = '9082207857@ybl';
  const STORE_WHATSAPP = '917006934064';

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
  const discount = subtotal > 300 ? 50 : 0;
  const packagingFee = subtotal > 0 ? 6 : 0;
  const total = subtotal > 0 ? Math.max(0, subtotal - discount + packagingFee) : 0;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(STORE_UPI);
    setCopiedUpi(true);
    onShowToast(`UPI ID "${STORE_UPI}" copied to clipboard!`);
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  const handlePlaceOrder = () => {
    const orderId = `HM-${Math.floor(10000 + Math.random() * 90000)}`;
    const itemsListText = cartDetails
      .map((item) => `• ${item.product.name} (${item.selectedWeight || item.product.unit}) x ${item.quantity} = ₹${item.lineTotal}`)
      .join('\n');

    const methodLabel = payMethod === 'upi' ? `UPI QR (${STORE_UPI})` : 'Cash on Delivery (COD)';

    const whatsappMessage = `🛒 *NEW ORDER: HOME MART FRESH*\nOrder ID: *#${orderId}*\n\n👤 *Customer:* ${custName}\n📞 *Phone:* ${custPhone}\n📍 *Delivery Address:* ${custAddress}\n\n📦 *Order Items:*\n${itemsListText || '• Fresh Daily Produce Basket'}\n\n💰 *Total Amount:* ₹${total}\n💳 *Payment Method:* ${methodLabel}\n⚡ *Official Store UPI:* ${STORE_UPI}\n\n_Please confirm packing in crate & dispatch rider!_`;

    const newOrder: OrderRecord = {
      id: orderId,
      date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      items: cartDetails.map((item) => ({
        name: item.product.name,
        unit: item.selectedWeight || item.product.unit,
        qty: item.quantity,
        price: item.lineTotal,
      })),
      total,
      customerName: custName,
      customerPhone: custPhone,
      customerAddress: custAddress,
      paymentMethod: methodLabel,
      status: 'packing',
      riderName: 'Ramesh K.',
      riderPhone: '+91 98765 12345',
    };

    onPlaceOrderSuccess(newOrder);

    // Open WhatsApp URL
    const waUrl = `https://api.whatsapp.com/send?phone=${STORE_WHATSAPP}&text=${encodeURIComponent(
      whatsappMessage
    )}`;
    window.open(waUrl, '_blank');
  };

  return (
    <div className="flex flex-col w-full pb-28 max-w-md mx-auto p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-1 border-b border-[#eaedff]">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#006b2c] text-[22px]">credit_card</span>
          <h2 className="font-extrabold text-[17px] text-[#131b2e]">Checkout & Payment</h2>
        </div>
        <span className="text-[10px] font-extrabold text-[#006b2c] bg-[#acf847]/30 px-2 py-0.5 rounded-full flex items-center gap-1">
          <span className="material-symbols-outlined text-[13px]">verified_user</span>
          100% Safe
        </span>
      </div>

      {/* Delivery Address Card */}
      <div className="bg-white border border-[#dae2fd]/60 rounded-2xl p-4 shadow-xs space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold text-[#131b2e] flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#006b2c] text-[18px]">home_pin</span>
            Delivery Address
          </span>
          <span className="text-[10px] font-bold text-[#006b2c] bg-[#eaedff] px-2 py-0.5 rounded-full">
            Primary
          </span>
        </div>

        <div className="space-y-2">
          <input
            type="text"
            value={custName}
            onChange={(e) => setCustName(e.target.value)}
            placeholder="Full Name"
            className="w-full text-xs font-bold text-[#131b2e] border-b border-[#eaedff] pb-1.5 focus:outline-none focus:border-[#006b2c]"
          />
          <textarea
            value={custAddress}
            onChange={(e) => setCustAddress(e.target.value)}
            rows={2}
            placeholder="Complete address with landmark"
            className="w-full text-xs text-[#3e4a3d] border border-[#eaedff] rounded-xl p-2.5 focus:outline-none focus:ring-1 focus:ring-[#006b2c]"
          />
          <input
            type="tel"
            value={custPhone}
            onChange={(e) => setCustPhone(e.target.value)}
            placeholder="Contact phone"
            className="w-full text-xs text-[#131b2e] border border-[#eaedff] rounded-xl p-2.5 focus:outline-none focus:ring-1 focus:ring-[#006b2c]"
          />
        </div>
      </div>

      {/* Official UPI QR Scan & Pay Card */}
      <div className="bg-gradient-to-br from-white to-[#006b2c]/5 border-2 border-[#006b2c]/20 rounded-2xl p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#006b2c] text-white flex items-center justify-center text-sm shadow-xs">
              <span className="material-symbols-outlined text-[18px]">qr_code_2</span>
            </div>
            <div>
              <h3 className="font-extrabold text-xs text-[#131b2e]">Home Mart Official UPI QR</h3>
              <p className="text-[10px] text-[#006b2c] font-bold">0% Surcharge • Instant UPI Scan</p>
            </div>
          </div>
          <span className="bg-[#acf847] text-[#457000] font-black text-[9px] uppercase px-2 py-0.5 rounded-full">
            Recommended
          </span>
        </div>

        {/* UPI Details Box */}
        <div className="bg-white border border-[#006b2c]/20 rounded-xl p-3 flex items-center justify-between shadow-xs">
          <div>
            <div className="text-[10px] text-[#6e7b6c] font-semibold">Store Verified UPI ID</div>
            <div className="text-xs font-black text-[#131b2e] font-inter tracking-tight">
              {STORE_UPI}
            </div>
            <div className="text-[10px] text-[#6e7b6c]">Merchant: Home Mart Fresh Retail</div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setShowQrModal(true)}
              className="bg-[#eaedff] text-[#006b2c] text-[11px] font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1 hover:bg-[#dae2fd]"
            >
              <span className="material-symbols-outlined text-[14px]">qr_code</span>
              <span>QR</span>
            </button>

            <button
              onClick={handleCopyUpi}
              className={`text-[11px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition ${
                copiedUpi
                  ? 'bg-[#006b2c] text-white'
                  : 'bg-[#f2f3ff] text-[#131b2e] hover:bg-[#eaedff]'
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">
                {copiedUpi ? 'done' : 'content_copy'}
              </span>
              <span>{copiedUpi ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Supported UPI Apps */}
        <div className="flex items-center justify-between text-[11px] text-[#6e7b6c] pt-1">
          <span className="flex items-center gap-1 text-[#131b2e] font-semibold">
            <span className="material-symbols-outlined text-[#006b2c] text-[14px]">bolt</span>
            Instant Pay via:
          </span>
          <div className="flex items-center gap-2 font-inter font-bold text-[10px] text-[#3e4a3d]">
            <span className="bg-white px-2 py-0.5 rounded-md border border-[#eaedff]">GPay</span>
            <span className="bg-white px-2 py-0.5 rounded-md border border-[#eaedff]">PhonePe</span>
            <span className="bg-white px-2 py-0.5 rounded-md border border-[#eaedff]">Paytm</span>
            <span className="bg-white px-2 py-0.5 rounded-md border border-[#eaedff]">BHIM</span>
          </div>
        </div>
      </div>

      {/* Payment Method Selector */}
      <div className="bg-white border border-[#dae2fd]/60 rounded-2xl p-4 shadow-xs space-y-2">
        <h3 className="font-extrabold text-xs text-[#131b2e] mb-1">Select Payment Method</h3>

        <label
          onClick={() => setPayMethod('upi')}
          className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition ${
            payMethod === 'upi'
              ? 'border-[#006b2c] bg-[#006b2c]/5'
              : 'border-[#eaedff] bg-white'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <input
              type="radio"
              checked={payMethod === 'upi'}
              onChange={() => setPayMethod('upi')}
              className="text-[#006b2c] focus:ring-[#006b2c]"
            />
            <div>
              <div className="text-xs font-bold text-[#131b2e]">Scan UPI QR / {STORE_UPI}</div>
              <div className="text-[10px] text-[#6e7b6c]">
                Zero transaction charge • Send screenshot to WhatsApp
              </div>
            </div>
          </div>
          <span className="material-symbols-outlined text-[#006b2c] text-[20px]">
            {payMethod === 'upi' ? 'check_circle' : 'radio_button_unchecked'}
          </span>
        </label>

        <label
          onClick={() => setPayMethod('cod')}
          className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition ${
            payMethod === 'cod'
              ? 'border-[#006b2c] bg-[#006b2c]/5'
              : 'border-[#eaedff] bg-white'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <input
              type="radio"
              checked={payMethod === 'cod'}
              onChange={() => setPayMethod('cod')}
              className="text-[#006b2c] focus:ring-[#006b2c]"
            />
            <div>
              <div className="text-xs font-bold text-[#131b2e]">Cash on Delivery (COD)</div>
              <div className="text-[10px] text-[#6e7b6c]">
                Pay cash or scan QR on rider arrival at doorstep
              </div>
            </div>
          </div>
          <span className="material-symbols-outlined text-[#006b2c] text-[20px]">
            {payMethod === 'cod' ? 'check_circle' : 'radio_button_unchecked'}
          </span>
        </label>
      </div>

      {/* Direct WhatsApp Order Action Banner */}
      <div className="bg-gradient-to-r from-[#006b2c] to-[#00873a] rounded-2xl p-4 text-white shadow-md">
        <div className="flex items-start justify-between">
          <div>
            <span className="bg-white/20 text-white font-black text-[9px] uppercase px-2 py-0.5 rounded-full">
              Instant Store Desk
            </span>
            <h3 className="font-extrabold text-sm mt-1">1-Tap Direct WhatsApp Order</h3>
            <p className="text-xs text-[#f7fff2] mt-0.5 opacity-90">
              Dispatches order slip directly to store desk (+91 7006934064)
            </p>
          </div>
          <div className="w-10 h-10 rounded-full bg-white text-[#006b2c] flex items-center justify-center text-xl shadow-xs shrink-0">
            <span className="material-symbols-outlined text-[24px]">send</span>
          </div>
        </div>

        <button
          onClick={handlePlaceOrder}
          className="w-full mt-3 py-3 bg-white text-[#006b2c] hover:bg-[#acf847] rounded-xl text-xs font-black shadow-sm flex items-center justify-center gap-2 transition active:scale-95"
        >
          <span className="material-symbols-outlined text-[18px]">chat</span>
          <span>Send Order via WhatsApp (+91 7006934064)</span>
        </button>
      </div>

      {/* QR Code Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-xs text-center shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-1 border-b border-[#eaedff]">
              <span className="text-xs font-bold text-[#131b2e]">Scan to Pay</span>
              <button
                onClick={() => setShowQrModal(false)}
                className="w-7 h-7 rounded-full bg-[#eaedff] text-[#3e4a3d] flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>

            {/* Generated QR Code Graphic */}
            <div className="p-3 bg-white rounded-2xl border-2 border-[#006b2c] shadow-inner inline-block">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=upi://pay?pa=${STORE_UPI}&pn=Home%20Mart%20Fresh&am=${total}&cu=INR`}
                alt="Home Mart UPI QR"
                className="w-44 h-44 object-contain mx-auto"
              />
            </div>

            <div>
              <div className="text-sm font-black text-[#131b2e] font-inter">₹{total}</div>
              <div className="text-xs font-bold text-[#006b2c] font-inter">{STORE_UPI}</div>
              <p className="text-[10px] text-[#6e7b6c] mt-1">
                Scan with any UPI App: GPay, PhonePe, Paytm, CRED
              </p>
            </div>

            <button
              onClick={() => {
                setShowQrModal(false);
                handlePlaceOrder();
              }}
              className="w-full py-2.5 rounded-xl bg-[#006b2c] text-white text-xs font-extrabold shadow-md"
            >
              I Have Paid / Place Order
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
