import React, { useState, useEffect } from 'react';
import { OrderRecord } from '../types';
import { RIDER_AVATAR_URL } from '../data/initialData';

interface ReceiptViewProps {
  order: OrderRecord | null;
  onBackToMarket: () => void;
  onTrackInDispatch: () => void;
}

export const ReceiptView: React.FC<ReceiptViewProps> = ({
  order,
  onBackToMarket,
  onTrackInDispatch,
}) => {
  const [etaMinutes, setEtaMinutes] = useState(19);

  useEffect(() => {
    const timer = setInterval(() => {
      setEtaMinutes((prev) => (prev > 1 ? prev - 1 : 1));
    }, 45000);
    return () => clearInterval(timer);
  }, []);

  const fallbackOrder: OrderRecord = {
    id: 'HM-84920',
    date: 'Just now',
    customerName: 'Rahul S.',
    customerPhone: '+91 98765 43210',
    customerAddress: 'Flat 402, Green Glen Layout, Indiranagar East, Bengaluru',
    items: [
      { name: 'Honeycrisp Apples', unit: '1 kg', qty: 1, price: 180 },
      { name: 'Baby Palak / Spinach', unit: '250g pack', qty: 2, price: 60 },
      { name: 'Ripe Hass Avocados', unit: 'Pack of 2', qty: 1, price: 190 },
      { name: 'Hybrid Tomatoes', unit: '1.5 kg', qty: 1, price: 56 },
    ],
    total: 492,
    paymentMethod: 'UPI QR (9082207857@ybl)',
    status: 'packing',
    riderName: 'Ramesh K.',
    riderPhone: '+91 98765 12345',
  };

  const currentOrder = order || fallbackOrder;

  return (
    <div className="flex flex-col w-full pb-24 max-w-md mx-auto p-4 space-y-4">
      {/* Success Hero */}
      <div className="text-center pt-2 space-y-1.5">
        <div className="w-16 h-16 bg-[#acf847]/30 text-[#006b2c] rounded-full flex items-center justify-center text-3xl mx-auto shadow-inner ring-4 ring-[#006b2c]/10">
          <span
            className="material-symbols-outlined text-[34px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            check_circle
          </span>
        </div>

        <span className="inline-block bg-[#006b2c]/10 text-[#006b2c] font-black text-[10px] px-3 py-1 rounded-full uppercase tracking-wider">
          ● WhatsApp Order Synced
        </span>

        <h2 className="text-[22px] font-black text-[#131b2e] tracking-tight">Order Confirmed!</h2>
        <p className="text-xs text-[#6e7b6c] font-mono font-bold">Order #{currentOrder.id}</p>
      </div>

      {/* ETA & 4-Stage Progress Card */}
      <div className="bg-white border border-[#dae2fd]/60 rounded-2xl p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[11px] text-[#6e7b6c] font-semibold">Estimated Arrival</div>
            <div className="text-[16px] font-black text-[#131b2e] flex items-center gap-1.5">
              <span className="text-[#006b2c]">Arriving in {etaMinutes} mins</span>
            </div>
          </div>
          <span className="bg-[#acf847] text-[#457000] text-[10px] font-black px-2.5 py-1 rounded-full uppercase">
            Express EV
          </span>
        </div>

        {/* 4-Stage Progress Flow */}
        <div className="grid grid-cols-4 gap-1 text-center pt-3 border-t border-[#eaedff]">
          <div>
            <div className="w-7 h-7 rounded-full bg-[#006b2c] text-white flex items-center justify-center text-xs mx-auto mb-1 shadow-xs">
              ✓
            </div>
            <div className="text-[10px] font-black text-[#131b2e]">Placed</div>
            <div className="text-[9px] text-[#6e7b6c]">Confirmed</div>
          </div>

          <div>
            <div className="w-7 h-7 rounded-full bg-[#006b2c] text-white flex items-center justify-center text-xs mx-auto mb-1 shadow-xs animate-pulse">
              <span className="material-symbols-outlined text-[15px]">inventory_2</span>
            </div>
            <div className="text-[10px] font-black text-[#006b2c]">Packing</div>
            <div className="text-[9px] text-[#006b2c] font-bold">Scale verified</div>
          </div>

          <div>
            <div className="w-7 h-7 rounded-full bg-[#eaedff] text-[#6e7b6c] flex items-center justify-center text-xs mx-auto mb-1">
              <span className="material-symbols-outlined text-[15px]">two_wheeler</span>
            </div>
            <div className="text-[10px] font-semibold text-[#6e7b6c]">On Way</div>
            <div className="text-[9px] text-[#6e7b6c]">EV Cruiser</div>
          </div>

          <div>
            <div className="w-7 h-7 rounded-full bg-[#eaedff] text-[#6e7b6c] flex items-center justify-center text-xs mx-auto mb-1">
              <span className="material-symbols-outlined text-[15px]">door_front</span>
            </div>
            <div className="text-[10px] font-semibold text-[#6e7b6c]">Delivered</div>
            <div className="text-[9px] text-[#6e7b6c]">Doorstep</div>
          </div>
        </div>

        <button
          onClick={onTrackInDispatch}
          className="w-full mt-1 py-2 bg-[#f2f3ff] hover:bg-[#eaedff] text-[#006b2c] text-xs font-extrabold rounded-xl flex items-center justify-center gap-1 transition"
        >
          <span className="material-symbols-outlined text-[16px]">visibility</span>
          <span>View Dark Store Live Weight Verification Desk</span>
        </button>
      </div>

      {/* Rider Allocation Card */}
      <div className="bg-white border border-[#dae2fd]/60 rounded-2xl p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={RIDER_AVATAR_URL}
              alt="Rider Ramesh"
              className="w-11 h-11 rounded-full object-cover ring-2 ring-[#006b2c]/30"
            />
            <div>
              <div className="text-xs font-black text-[#131b2e] flex items-center gap-1">
                <span>{currentOrder.riderName}</span>
                <span className="bg-[#eaedff] text-[#006b2c] text-[10px] font-bold px-1.5 py-0.2 rounded font-inter">
                  4.9 ★
                </span>
              </div>
              <div className="text-[10px] text-[#6e7b6c]">EV Cruiser #KA03-HM-4102</div>
              <div className="text-[10px] text-[#006b2c] font-bold">Rider Assigned at Bay #3</div>
            </div>
          </div>

          <a
            href={`tel:${currentOrder.riderPhone}`}
            className="w-9 h-9 rounded-full bg-[#006b2c]/10 text-[#006b2c] hover:bg-[#006b2c] hover:text-white flex items-center justify-center transition"
            title="Call delivery partner"
          >
            <span className="material-symbols-outlined text-[18px]">call</span>
          </a>
        </div>

        <div className="border-t border-[#eaedff] pt-2 flex items-center justify-between text-xs">
          <span className="text-[#6e7b6c]">Direct Hotline:</span>
          <a
            href="tel:+917006934064"
            className="font-bold text-[#006b2c] hover:underline font-inter"
          >
            +91 7006934064
          </a>
        </div>
      </div>

      {/* WhatsApp Help Desk Banner */}
      <a
        href="https://wa.me/917006934064"
        target="_blank"
        rel="noreferrer"
        className="block bg-gradient-to-r from-[#006b2c]/10 to-[#acf847]/20 border border-[#006b2c]/30 rounded-2xl p-3.5 shadow-xs transition hover:border-[#006b2c]"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#006b2c] text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">chat</span>
            </div>
            <div>
              <div className="text-xs font-black text-[#131b2e]">WhatsApp Support Desk Active</div>
              <div className="text-[10px] text-[#3e4a3d]">
                Ask for instant substitutions or delivery notes
              </div>
            </div>
          </div>
          <span className="bg-[#006b2c] text-white text-[10px] font-black px-2.5 py-1 rounded-xl">
            Chat
          </span>
        </div>
      </a>

      {/* Itemized Order Slip */}
      <div className="bg-white border border-[#dae2fd]/60 rounded-2xl p-4 shadow-xs space-y-2">
        <h4 className="text-xs font-black text-[#131b2e] uppercase tracking-wider mb-2">
          Receipt Breakdown
        </h4>
        <div className="space-y-1.5 text-xs text-[#3e4a3d]">
          {currentOrder.items.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center py-0.5">
              <span>
                {item.name} ({item.unit}) × {item.qty}
              </span>
              <span className="font-bold text-[#131b2e] font-inter">₹{item.price}</span>
            </div>
          ))}
          <div className="border-t border-[#eaedff] pt-2 flex justify-between font-black text-[14px] text-[#131b2e]">
            <span>Grand Total</span>
            <span className="text-[#006b2c] font-inter">₹{currentOrder.total}</span>
          </div>
          <div className="text-[10px] text-[#6e7b6c] pt-1">
            Payment Mode: <span className="font-semibold">{currentOrder.paymentMethod}</span>
          </div>
        </div>
      </div>

      {/* Back Button */}
      <button
        onClick={onBackToMarket}
        className="w-full py-3 bg-[#131b2e] hover:bg-black text-white rounded-2xl text-xs font-black shadow-md transition active:scale-[0.99]"
      >
        Back to Home Mart Storefront
      </button>
    </div>
  );
};
