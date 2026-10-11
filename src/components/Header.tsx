import React, { useState } from 'react';
import { STORE_LOGO_URL, USER_AVATAR_URL } from '../data/initialData';
import { AppNotification } from '../types';

interface HeaderProps {
  currentAddress: string;
  onAddressChange: (newAddress: string) => void;
  notifications: AppNotification[];
  onMarkNotificationRead: (id: string) => void;
  onClearNotifications: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentAddress,
  onAddressChange,
  notifications,
  onMarkNotificationRead,
  onClearNotifications,
  activeTab,
  setActiveTab,
}) => {
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [tempAddress, setTempAddress] = useState(currentAddress);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const presetAddresses = [
    { label: 'Home', address: 'Flat 402, Green Glen Layout, Bellandur, Bengaluru • 15 mins' },
    { label: 'Office', address: '742 Evergreen Terrace, Koramangala 4th Block • 20 mins' },
    { label: 'Hub Station', address: 'Dark Store #04, Indiranagar East, Bengaluru • 10 mins' },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 pt-safe bg-[#faf8ff]/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-[#dae2fd]/40">
        <div className="max-w-md mx-auto h-20 px-4 flex items-center justify-between gap-2">
          {/* Brand & Address */}
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <button
              onClick={() => setActiveTab('market')}
              className="relative shrink-0 active:scale-95 transition-transform"
              title="Home Mart Fresh"
            >
              <img
                src={STORE_LOGO_URL}
                alt="Home Mart Logo"
                className="h-8 w-auto object-contain shrink-0"
              />
            </button>

            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-[17px] text-[#131b2e] tracking-tight leading-none truncate">
                  Home Mart
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#acf847] text-[#457000] uppercase tracking-wider shrink-0 font-inter">
                  Fresh
                </span>
              </div>

              <button
                onClick={() => setShowAddressModal(true)}
                className="flex items-center gap-1 text-[#3e4a3d] truncate mt-0.5 text-left group hover:text-[#006b2c] transition-colors"
                title="Tap to change delivery address"
              >
                <span className="material-symbols-outlined text-[14px] text-[#006b2c] shrink-0">
                  location_on
                </span>
                <span className="text-[11px] font-semibold truncate group-hover:underline max-w-[170px] sm:max-w-[220px]">
                  {currentAddress || 'Set delivery address'}
                </span>
                <span className="material-symbols-outlined text-[13px] text-[#6e7b6c] shrink-0">
                  expand_more
                </span>
              </button>
            </div>
          </div>

          {/* Quick Actions & Profile */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* View Switcher Pill */}
            <button
              onClick={() => setShowRoleModal(true)}
              className="text-[10px] font-bold px-2 py-1 rounded-full bg-[#eaedff] text-[#006b2c] hover:bg-[#dae2fd] transition flex items-center gap-1 border border-[#006b2c]/15"
              title="Switch role view (Customer, Dispatch, Store Admin)"
            >
              <span className="material-symbols-outlined text-[14px]">swap_horiz</span>
              <span className="capitalize">{activeTab === 'dispatch' ? 'Dispatch' : activeTab === 'admin' ? 'Admin' : 'Shop'}</span>
            </button>

            {/* Notifications Bell */}
            <button
              aria-label="Notifications"
              onClick={() => setShowNotificationModal(true)}
              className="relative w-10 h-10 flex items-center justify-center rounded-full text-[#3e4a3d] hover:text-[#131b2e] hover:bg-[#eaedff] transition-colors active:scale-90"
            >
              <span className="material-symbols-outlined text-[22px]">notifications</span>
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-[#ba1a1a] ring-2 ring-[#faf8ff] animate-pulse"></span>
              )}
            </button>

            {/* Profile Avatar */}
            <button
              onClick={() => setShowRoleModal(true)}
              className="flex items-center pl-0.5 active:scale-95 transition-transform"
              title="User profile & role menu"
            >
              <img
                src={USER_AVATAR_URL}
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover ring-2 ring-[#006b2c]/30 hover:ring-[#006b2c] transition"
              />
            </button>
          </div>
        </div>
      </header>

      {/* Address Switcher Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-[#ffffff] w-full max-w-md rounded-t-2xl sm:rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-1 border-b border-[#eaedff]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#006b2c] text-[22px]">location_on</span>
                <h3 className="font-extrabold text-[16px] text-[#131b2e]">Select Delivery Location</h3>
              </div>
              <button
                onClick={() => setShowAddressModal(false)}
                className="w-8 h-8 rounded-full bg-[#eaedff] text-[#3e4a3d] flex items-center justify-center hover:bg-[#dae2fd]"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="space-y-2">
              {presetAddresses.map((p, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    onAddressChange(p.address);
                    setShowAddressModal(false);
                  }}
                  className={`p-3 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                    currentAddress === p.address
                      ? 'border-[#006b2c] bg-[#006b2c]/5 text-[#131b2e]'
                      : 'border-[#eaedff] bg-[#faf8ff] hover:bg-[#eaedff]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#eaedff] text-[#006b2c]">
                      {p.label}
                    </span>
                    <span className="text-xs font-medium text-[#131b2e] line-clamp-1">{p.address}</span>
                  </div>
                  {currentAddress === p.address && (
                    <span className="material-symbols-outlined text-[#006b2c] text-[18px]">check_circle</span>
                  )}
                </div>
              ))}
            </div>

            <div className="space-y-1.5 pt-1">
              <label className="text-xs font-bold text-[#131b2e]">Or Enter Custom Address</label>
              <textarea
                value={tempAddress}
                onChange={(e) => setTempAddress(e.target.value)}
                rows={2}
                placeholder="Enter house, apartment, street name..."
                className="w-full text-xs p-2.5 rounded-xl border border-[#dae2fd] bg-[#faf8ff] text-[#131b2e] focus:outline-none focus:ring-2 focus:ring-[#006b2c]"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowAddressModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-[#eaedff] text-[#131b2e] font-bold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (tempAddress.trim()) onAddressChange(tempAddress.trim());
                  setShowAddressModal(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#006b2c] text-white font-bold text-xs shadow-md"
              >
                Confirm Location
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Role & Screen Switcher Modal */}
      {showRoleModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-[#ffffff] w-full max-w-md rounded-t-2xl sm:rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-1 border-b border-[#eaedff]">
              <div>
                <h3 className="font-extrabold text-[16px] text-[#131b2e]">Home Mart Platform Views</h3>
                <p className="text-[11px] text-[#6e7b6c]">Instant access to all screens & dark store modules</p>
              </div>
              <button
                onClick={() => setShowRoleModal(false)}
                className="w-8 h-8 rounded-full bg-[#eaedff] text-[#3e4a3d] flex items-center justify-center hover:bg-[#dae2fd]"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              <button
                onClick={() => {
                  setActiveTab('market');
                  setShowRoleModal(false);
                }}
                className={`p-3 rounded-xl border text-left flex items-center justify-between transition ${
                  activeTab === 'market'
                    ? 'border-[#006b2c] bg-[#006b2c]/10'
                    : 'border-[#eaedff] hover:bg-[#eaedff]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#006b2c] text-white flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px]">storefront</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-[#131b2e]">Customer Storefront</h4>
                    <p className="text-[10px] text-[#6e7b6c]">Fresh produce catalog, weight steppers & mini-cart</p>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-[#006b2c]">Screen 1</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('dispatch');
                  setShowRoleModal(false);
                }}
                className={`p-3 rounded-xl border text-left flex items-center justify-between transition ${
                  activeTab === 'dispatch'
                    ? 'border-[#006b2c] bg-[#006b2c]/10'
                    : 'border-[#eaedff] hover:bg-[#eaedff]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#416900] text-white flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px]">scale</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-[#131b2e]">Dark Store Dispatch & Picking</h4>
                    <p className="text-[10px] text-[#6e7b6c]">Calibrated scale verification, seal scan & OTP handover</p>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-[#416900]">Screen 2</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('admin');
                  setShowRoleModal(false);
                }}
                className={`p-3 rounded-xl border text-left flex items-center justify-between transition ${
                  activeTab === 'admin'
                    ? 'border-[#006b2c] bg-[#006b2c]/10'
                    : 'border-[#eaedff] hover:bg-[#eaedff]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#936f00] text-white flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px]">tune</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-[#131b2e]">Store Admin & Rate Editor</h4>
                    <p className="text-[10px] text-[#6e7b6c]">Live catalog sync, ±5 price adjusters & Add Product form</p>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-[#936f00]">Screen 3</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notifications Drawer Modal */}
      {showNotificationModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-[#ffffff] w-full max-w-md rounded-t-2xl sm:rounded-2xl p-5 shadow-2xl space-y-4 max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between pb-2 border-b border-[#eaedff]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#006b2c] text-[20px]">notifications_active</span>
                <h3 className="font-extrabold text-[16px] text-[#131b2e]">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#ba1a1a] text-white">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {notifications.length > 0 && (
                  <button
                    onClick={onClearNotifications}
                    className="text-[11px] text-[#6e7b6c] hover:text-[#ba1a1a] font-semibold"
                  >
                    Clear All
                  </button>
                )}
                <button
                  onClick={() => setShowNotificationModal(false)}
                  className="w-7 h-7 rounded-full bg-[#eaedff] text-[#3e4a3d] flex items-center justify-center"
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              </div>
            </div>

            <div className="space-y-2 overflow-y-auto flex-1 pr-1">
              {notifications.length === 0 ? (
                <div className="text-center py-8 text-[#6e7b6c] text-xs">
                  No notifications yet. You're all caught up!
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => onMarkNotificationRead(n.id)}
                    className={`p-3 rounded-xl border transition cursor-pointer ${
                      n.read ? 'bg-[#faf8ff] border-[#eaedff]' : 'bg-[#006b2c]/5 border-[#006b2c]/30'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            n.read ? 'bg-transparent' : 'bg-[#006b2c]'
                          }`}
                        />
                        <h4 className="text-xs font-bold text-[#131b2e]">{n.title}</h4>
                      </div>
                      <span className="text-[10px] text-[#6e7b6c] shrink-0">{n.time}</span>
                    </div>
                    <p className="text-xs text-[#3e4a3d] mt-1 pl-4">{n.message}</p>
                  </div>
                ))
              )}
            </div>

            <button
              onClick={() => setShowNotificationModal(false)}
              className="w-full py-2.5 rounded-xl bg-[#006b2c] text-white text-xs font-bold"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </>
  );
};
