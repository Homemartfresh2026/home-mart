import React, { useState, useEffect } from 'react';
import { DispatchState } from '../types';

interface DispatchViewProps {
  dispatchState: DispatchState;
  onUpdateDispatchState: (updater: (prev: DispatchState) => DispatchState) => void;
  onShowToast: (msg: string) => void;
}

export const DispatchView: React.FC<DispatchViewProps> = ({
  dispatchState,
  onUpdateDispatchState,
  onShowToast,
}) => {
  const [countdown, setCountdown] = useState(dispatchState.remainingSeconds);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const handleToggleItemVerify = (itemId: string) => {
    onUpdateDispatchState((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.id === itemId ? { ...item, verified: !item.verified } : item
      ),
    }));
    onShowToast('Weight scale verification updated');
  };

  const handleScanSeal = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      onUpdateDispatchState((prev) => ({ ...prev, isSealScanned: true }));
      onShowToast('Security seal #HM-SEAL-98421 successfully verified!');
    }, 1200);
  };

  const handleSealAndHandover = () => {
    onUpdateDispatchState((prev) => ({ ...prev, isDispatched: true }));
    onShowToast(`Crate ${dispatchState.crateId} sealed and handed over to Rider Ramesh!`);
  };

  const completedCount = dispatchState.items.filter((i) => i.verified).length;
  const totalCount = dispatchState.items.length;

  return (
    <div className="flex flex-col w-full pb-24 max-w-md mx-auto space-y-3.5">
      {/* Hub & Shift Status Bar */}
      <div className="px-4 pt-2">
        <div className="bg-[#eaedff] rounded-2xl p-3.5 shadow-xs flex items-center justify-between gap-2 border border-[#dae2fd]/70">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-full bg-[#006b2c] flex items-center justify-center text-white shrink-0 shadow-xs">
              <span
                className="material-symbols-outlined text-[20px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                storefront
              </span>
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-[#131b2e] truncate">Dark Store #04</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#006b2c] shrink-0"></span>
                <span className="text-[11px] font-bold text-[#006b2c] shrink-0">
                  Indiranagar East
                </span>
              </div>
              <div className="flex items-center gap-1 mt-0.5 text-[#3e4a3d] truncate">
                <span className="w-2 h-2 rounded-full bg-[#416900] shrink-0 animate-ping"></span>
                <span className="text-[11px] text-[#3e4a3d] font-semibold truncate">
                  Store Staff: Active (8 pending orders)
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onShowToast('Switched to Indiranagar Hub fulfillment bay')}
            className="bg-white/80 hover:bg-white text-[#131b2e] p-2 rounded-xl shrink-0 transition flex items-center justify-center shadow-xs"
            title="Switch Hub"
          >
            <span className="material-symbols-outlined text-[18px]">swap_horiz</span>
          </button>
        </div>
      </div>

      {/* Priority Alert & Countdown Banner */}
      <div className="px-4">
        <div className="bg-[#dae2fd] rounded-2xl p-3.5 flex flex-col gap-2.5 shadow-xs relative overflow-hidden border border-[#bdcaba]">
          <div className="flex items-center justify-between gap-2">
            <div className="inline-flex items-center gap-1.5 bg-[#acf847] px-2.5 py-1 rounded-full text-[#457000] text-xs font-black shadow-xs">
              <span
                className="material-symbols-outlined text-[16px] text-[#416900] font-black"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                bolt
              </span>
              <span>Express 20-min Delivery</span>
            </div>

            <div
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full shadow-xs ${
                countdown <= 60 ? 'bg-[#ba1a1a] text-white animate-pulse' : 'bg-white text-[#ba1a1a]'
              }`}
            >
              <span className="material-symbols-outlined text-[15px] animate-pulse">timer</span>
              <span className="text-xs font-black font-inter tracking-tight">
                {countdown <= 0 ? '00:00 - Overdue!' : `${formatTime(countdown)} mins remaining`}
              </span>
            </div>
          </div>

          {/* Order ID & Customer Metadata */}
          <div className="flex items-start justify-between gap-2 pt-1">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-[16px] font-black text-[#131b2e] tracking-tight">
                  Order #{dispatchState.orderId}
                </span>
                <span className="bg-[#f2f3ff] text-[#3e4a3d] px-2 py-0.5 rounded-md text-[10px] font-bold font-inter border border-[#dae2fd]">
                  {dispatchState.crateId}
                </span>
              </div>

              <div className="flex items-center gap-1.5 mt-1 text-[#3e4a3d]">
                <span
                  className="material-symbols-outlined text-[16px] text-[#006b2c]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  person
                </span>
                <span className="text-xs text-[#131b2e] font-extrabold">
                  {dispatchState.customerName}
                </span>
                <span className="text-[#6e7b6c]">•</span>
                <a
                  href={`tel:${dispatchState.customerPhone}`}
                  className="text-xs text-[#006b2c] font-black hover:underline font-inter"
                >
                  {dispatchState.customerPhone}
                </a>
              </div>
            </div>

            <div className="w-10 h-10 rounded-2xl bg-white shadow-xs flex items-center justify-center text-[#006b2c] shrink-0 border border-[#dae2fd]">
              <span className="material-symbols-outlined text-[24px]">assignment_turned_in</span>
            </div>
          </div>
        </div>
      </div>

      {/* Picking & Weight Verification Checklist */}
      <div className="px-4 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span
              className="material-symbols-outlined text-[20px] text-[#006b2c]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              scale
            </span>
            <h2 className="text-[15px] font-black text-[#131b2e]">
              Picking & Weight Verification
            </h2>
          </div>
          <span className="bg-[#00873a] text-white px-2.5 py-0.5 rounded-full text-[11px] font-black font-inter shadow-xs">
            {completedCount} / {totalCount} Complete
          </span>
        </div>

        <div className="space-y-2">
          {dispatchState.items.map((item) => (
            <div
              key={item.id}
              className="bg-white p-3 rounded-2xl shadow-xs flex items-center justify-between gap-3 border border-[#dae2fd]/50 transition-all hover:border-[#006b2c]/40"
            >
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-13 h-13 rounded-xl object-cover bg-[#f2f3ff] shrink-0 border border-[#dae2fd]/40"
                />
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-black text-[#131b2e] truncate">{item.name}</span>

                  <div className="flex items-center gap-1.5 mt-0.5 text-[#3e4a3d] text-[11px] font-inter">
                    <span>Target: {item.targetWeight}</span>
                    <span className="text-[#bdcaba]">|</span>
                    <span className="text-[#006b2c] font-black">Weighed: {item.actualWeight}</span>
                  </div>

                  <div className="flex items-center gap-1 mt-1">
                    {item.priceAdjustedNote ? (
                      <>
                        <span
                          className="material-symbols-outlined text-[14px] text-[#936f00]"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          price_change
                        </span>
                        <span className="text-[11px] text-[#936f00] font-black font-inter">
                          {item.priceAdjustedNote}
                        </span>
                      </>
                    ) : (
                      <>
                        <span
                          className="material-symbols-outlined text-[14px] text-[#006b2c]"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          check_circle
                        </span>
                        <span className="text-[11px] text-[#006b2c] font-semibold">
                          {item.verificationNote}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleToggleItemVerify(item.id)}
                aria-label="Item Verified"
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-xs transition-transform active:scale-90 ${
                  item.verified
                    ? 'bg-[#00873a] text-white'
                    : 'bg-[#eaedff] text-[#6e7b6c] hover:bg-[#dae2fd]'
                }`}
              >
                <span
                  className="material-symbols-outlined text-[18px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  {item.verified ? 'check' : 'radio_button_unchecked'}
                </span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Dispatch & Handover Station */}
      <div className="px-4 space-y-2 pt-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span
              className="material-symbols-outlined text-[20px] text-[#006b2c]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              two_wheeler
            </span>
            <h2 className="text-[15px] font-black text-[#131b2e]">Rider Allocation & Handover</h2>
          </div>
          <span className="bg-[#acf847] text-[#457000] px-2.5 py-0.5 rounded-full text-[11px] font-black">
            Rider at {dispatchState.rider.bay}
          </span>
        </div>

        {/* Rider Card */}
        <div className="bg-white p-3.5 rounded-2xl shadow-xs flex flex-col gap-3 border border-[#dae2fd]/60">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src={dispatchState.rider.avatar}
                alt={dispatchState.rider.name}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-[#006b2c]/20 shrink-0"
              />
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black text-[#131b2e] truncate">
                    {dispatchState.rider.name}
                  </span>
                  <span className="bg-[#f2f3ff] text-[#131b2e] px-1.5 py-0.5 rounded text-[10px] font-black font-inter">
                    {dispatchState.rider.rating} ★
                  </span>
                </div>
                <span className="text-[11px] text-[#3e4a3d] truncate font-medium">
                  {dispatchState.rider.vehicle}
                </span>
                <a
                  href={`tel:${dispatchState.rider.phone}`}
                  className="text-[11px] text-[#006b2c] font-black hover:underline font-inter mt-0.5"
                >
                  {dispatchState.rider.phone}
                </a>
              </div>
            </div>

            <div className="flex flex-col items-end shrink-0">
              <span className="text-[10px] text-[#6e7b6c] uppercase tracking-wider font-extrabold">
                Handover OTP
              </span>
              <span className="text-[18px] text-[#006b2c] tracking-widest font-black bg-[#f2f3ff] px-2.5 py-0.5 rounded-lg border border-[#dae2fd] mt-0.5 font-inter">
                {dispatchState.handoverOtp}
              </span>
            </div>
          </div>

          {/* Crate Sealing & Scanner Trigger Area */}
          <div className="bg-[#f2f3ff] p-3 rounded-xl flex items-center justify-between gap-2 border border-[#dae2fd]">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-white shadow-xs flex items-center justify-center text-[#131b2e] shrink-0 border border-[#dae2fd]/70">
                <span className="material-symbols-outlined text-[20px]">qr_code_scanner</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-[#131b2e] truncate">Security Seal Tag</span>
                <span className="text-[11px] text-[#6e7b6c] font-mono truncate">
                  Tag: #{dispatchState.securitySealTag}
                </span>
              </div>
            </div>

            <button
              onClick={handleScanSeal}
              disabled={dispatchState.isSealScanned || isScanning}
              className={`text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 shrink-0 transition-all ${
                dispatchState.isSealScanned
                  ? 'bg-[#acf847] text-[#457000]'
                  : isScanning
                  ? 'bg-[#eaedff] text-[#006b2c] animate-pulse'
                  : 'bg-white text-[#131b2e] hover:bg-[#eaedff] shadow-xs'
              }`}
            >
              <span className="material-symbols-outlined text-[16px] text-[#006b2c]">
                {dispatchState.isSealScanned ? 'check_circle' : 'barcode_scanner'}
              </span>
              <span>
                {dispatchState.isSealScanned
                  ? 'Scanned'
                  : isScanning
                  ? 'Scanning...'
                  : 'Scan Seal'}
              </span>
            </button>
          </div>

          {/* Primary Action CTA */}
          <button
            onClick={handleSealAndHandover}
            disabled={dispatchState.isDispatched}
            className={`w-full py-3.5 px-4 rounded-xl text-xs font-black flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99] ${
              dispatchState.isDispatched
                ? 'bg-[#00873a] text-white cursor-default'
                : 'bg-[#006b2c] hover:bg-[#005320] text-white'
            }`}
          >
            <span
              className="material-symbols-outlined text-[20px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              {dispatchState.isDispatched ? 'task_alt' : 'verified'}
            </span>
            <span>
              {dispatchState.isDispatched
                ? 'Crate Dispatched to Rider Ramesh!'
                : `Seal Crate & Hand Over (OTP: ${dispatchState.handoverOtp})`}
            </span>
          </button>
        </div>
      </div>

      {/* Ops Desk Helpline Quick Contact Badge */}
      <div className="px-4 pt-1">
        <div className="bg-[#eaedff] rounded-2xl p-3 flex items-center justify-between gap-2 shadow-xs border border-[#dae2fd]/70">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#755800] shrink-0 shadow-xs">
              <span
                className="material-symbols-outlined text-[18px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                support_agent
              </span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-[#131b2e] truncate">
                Home Mart Ops Support Desk
              </span>
              <span className="text-[10px] text-[#6e7b6c] truncate">
                Instant resolution for rider delay or substitutions
              </span>
            </div>
          </div>

          <a
            href="tel:+917006934064"
            className="bg-[#006b2c] text-white px-3 py-1.5 rounded-xl text-[11px] font-extrabold flex items-center gap-1 shrink-0 hover:bg-[#005320] shadow-xs"
          >
            <span className="material-symbols-outlined text-[14px]">call</span>
            <span>Call Ops</span>
          </a>
        </div>
      </div>
    </div>
  );
};
