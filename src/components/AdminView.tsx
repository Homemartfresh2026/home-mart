import React, { useState } from 'react';
import { Product } from '../types';

interface AdminViewProps {
  products: Product[];
  onUpdateProductPrice: (id: string, newPrice: number) => void;
  onToggleProductStock: (id: string) => void;
  onAddNewProduct: (newProduct: Product) => void;
  onArchiveProduct: (id: string) => void;
  onShowToast: (msg: string) => void;
}

export const AdminView: React.FC<AdminViewProps> = ({
  products,
  onUpdateProductPrice,
  onToggleProductStock,
  onAddNewProduct,
  onArchiveProduct,
  onShowToast,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Form states
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('Staples & Dals');
  const [formUnit, setFormUnit] = useState('1 kg');
  const [formMrp, setFormMrp] = useState(160);
  const [formSelling, setFormSelling] = useState(135);
  const [formInStock, setFormInStock] = useState(true);
  const [formImage, setFormImage] = useState(
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCMg_bW2swZyZ25OEERIGq3ltrh-2Sb2HkyX69g5W6TMtaMuw7rmqId7_oxNFt174ZieKmRbDBlPe6veMVDF_YDwR9AzZANyZaN19ak_KOMNLn5CYLstLZYyto-XU2CdWlkZA10dM3lVYW62DNpYEDq3UiJatpAhc_PPElYfzxMFl_DxiCToW7_nu6sNEZTR9TVUIJEL5axeUQ_I9MLh04UdarIHLTJNRB6YTXRDGHLtRot21IRv9osoQ'
  );

  const lowStockCount = products.filter((p) => p.stockCount && p.stockCount <= 3).length;
  const soldOutCount = products.filter((p) => !p.inStock).length;

  const handleAdjustPrice = (productId: string, delta: number) => {
    const p = products.find((prod) => prod.id === productId);
    if (!p) return;
    const newPrice = Math.max(5, p.price + delta);
    onUpdateProductPrice(productId, newPrice);
    onShowToast(`Updated ${p.name} rate to ₹${newPrice}!`);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      onShowToast('Please enter a product title');
      return;
    }

    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      name: formName.trim(),
      category: formCategory.toLowerCase().includes('staple') ? 'staples' : 'fruits',
      categoryLabel: formCategory,
      image: formImage,
      price: Number(formSelling),
      mrp: Number(formMrp),
      unit: formUnit.trim(),
      rating: 4.8,
      reviewsCount: 1,
      tag: 'New Arrival',
      tagType: 'best',
      inStock: formInStock,
      origin: 'Verified Supplier',
    };

    onAddNewProduct(newProduct);
    setShowAddForm(false);
    setFormName('');
    onShowToast(`Published "${newProduct.name}" to storefront!`);
  };

  const categories = [
    { id: 'all', label: `All (${products.length})` },
    { id: 'staples', label: 'Staples & Grains' },
    { id: 'fruits', label: 'Fruits & Veggies' },
    { id: 'dairy', label: 'Dairy & Bakery' },
    { id: 'beverages', label: 'Snacks & Drinks' },
    { id: 'toiletries', label: 'Toiletries' },
  ];

  const filteredProducts = products.filter((p) => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'staples') return p.category === 'staples';
    if (selectedFilter === 'fruits') return p.category === 'fruits' || p.category === 'veggies';
    if (selectedFilter === 'dairy') return p.category === 'dairy';
    if (selectedFilter === 'beverages') return p.category === 'beverages' || p.category === 'instant';
    if (selectedFilter === 'toiletries') return p.category === 'toiletries' || p.category === 'baby';
    return true;
  });

  return (
    <div className="flex flex-col w-full pb-24 max-w-md mx-auto p-4 space-y-4">
      {/* Live Store Status Banner */}
      <div className="bg-[#f2f3ff] rounded-2xl p-3.5 shadow-xs flex items-center justify-between border border-[#dae2fd]/70">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="relative flex h-3 w-3 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#006b2c] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#006b2c]"></span>
          </span>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-black text-[#131b2e] leading-tight truncate">
              Live Storefront Sync Active
            </span>
            <span className="text-[11px] text-[#3e4a3d] truncate">
              Changes mirror to customer app instantly
            </span>
          </div>
        </div>
        <span className="material-symbols-outlined text-[#006b2c] text-[22px] shrink-0">
          cloud_done
        </span>
      </div>

      {/* Quick Metric Cards Grid */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-white rounded-2xl p-3 shadow-xs flex flex-col items-center text-center border border-[#dae2fd]/50">
          <span className="text-[11px] text-[#6e7b6c] font-medium">Total SKUs</span>
          <span className="text-[18px] font-black text-[#131b2e] font-inter mt-0.5">
            {products.length}
          </span>
          <span className="text-[10px] text-[#006b2c] font-bold mt-0.5">Active</span>
        </div>

        <div className="bg-white rounded-2xl p-3 shadow-xs flex flex-col items-center text-center border border-[#dae2fd]/50">
          <span className="text-[11px] text-[#6e7b6c] font-medium">Low Stock</span>
          <span className="text-[18px] font-black text-[#ba1a1a] font-inter mt-0.5">
            {lowStockCount + soldOutCount}
          </span>
          <span className="text-[10px] text-[#ba1a1a] font-bold mt-0.5">Alert</span>
        </div>

        <div className="bg-white rounded-2xl p-3 shadow-xs flex flex-col items-center text-center border border-[#dae2fd]/50">
          <span className="text-[11px] text-[#6e7b6c] font-medium">Price Updates</span>
          <span className="text-[18px] font-black text-[#936f00] font-inter mt-0.5">
            8
          </span>
          <span className="text-[10px] text-[#936f00] font-bold mt-0.5">Today</span>
        </div>
      </div>

      {/* Primary CTA Button */}
      <button
        onClick={() => setShowAddForm(!showAddForm)}
        className="w-full bg-[#006b2c] hover:bg-[#005320] text-white py-3 px-4 rounded-2xl shadow-md flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
      >
        <span className="material-symbols-outlined text-[20px]">
          {showAddForm ? 'close' : 'add_circle'}
        </span>
        <span className="text-xs font-black tracking-tight">
          {showAddForm ? 'Close Inventory Drawer' : '+ Add New Product'}
        </span>
      </button>

      {/* Add New Product Form Card */}
      {showAddForm && (
        <form
          onSubmit={handleSaveProduct}
          className="bg-white rounded-2xl p-4 shadow-md space-y-3.5 border border-[#dae2fd] animate-in fade-in duration-200"
        >
          <div className="flex items-center justify-between pb-1 border-b border-[#eaedff]">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#006b2c] text-[20px]">add_box</span>
              <span className="text-xs font-black text-[#131b2e]">New Inventory Item</span>
            </div>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="w-7 h-7 rounded-full bg-[#f2f3ff] flex items-center justify-center text-[#3e4a3d]"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>

          {/* Image Picker */}
          <div className="flex items-center gap-3 bg-[#f2f3ff] p-3 rounded-xl border border-[#dae2fd]">
            <div className="w-16 h-16 rounded-xl bg-white flex flex-col items-center justify-center relative overflow-hidden shrink-0 shadow-xs border border-[#dae2fd]">
              <img
                src={formImage}
                alt="Upload preview"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-[#131b2e]">Product Visual</span>
              <span className="text-[10px] text-[#6e7b6c] truncate">
                Clear front label pack shot
              </span>
              <div className="flex gap-1.5 mt-1.5">
                <button
                  type="button"
                  onClick={() => onShowToast('Visual photo library loaded')}
                  className="bg-white text-[#131b2e] text-[10px] font-bold px-2 py-1 rounded-lg border border-[#dae2fd]"
                >
                  Gallery
                </button>
                <button
                  type="button"
                  onClick={() => onShowToast('Camera packshot scanner ready')}
                  className="bg-[#acf847] text-[#457000] text-[10px] font-bold px-2 py-1 rounded-lg"
                >
                  Scan
                </button>
              </div>
            </div>
          </div>

          {/* Product Title */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-[#131b2e] block">Product Title & Brand</label>
            <input
              type="text"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="e.g. Fortune Sunlite Sunflower Oil 1L"
              className="w-full bg-[#f2f3ff] text-[#131b2e] text-xs px-3 py-2 rounded-xl outline-none focus:ring-1 focus:ring-[#006b2c] border border-[#dae2fd]"
            />
          </div>

          {/* Category Chips */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-[#131b2e] block">Category</label>
            <div className="flex flex-wrap gap-1.5">
              {[
                'Staples & Dals',
                'Dairy & Eggs',
                'Snacks',
                'Fruits & Veggies',
                'Household',
                'Toiletries',
              ].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFormCategory(cat)}
                  className={`text-[10px] px-2.5 py-1 rounded-full font-bold transition ${
                    formCategory === cat
                      ? 'bg-[#006b2c] text-white shadow-xs'
                      : 'bg-[#f2f3ff] text-[#3e4a3d] hover:bg-[#eaedff]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Pack Size & Live Stock Switch */}
          <div className="grid grid-cols-2 gap-2 items-end">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-[#131b2e] block">Pack Size / Unit</label>
              <input
                type="text"
                value={formUnit}
                onChange={(e) => setFormUnit(e.target.value)}
                placeholder="e.g. 500g, 1 Liter"
                className="w-full bg-[#f2f3ff] text-[#131b2e] text-xs px-3 py-2 rounded-xl outline-none border border-[#dae2fd]"
              />
            </div>

            <div className="bg-[#f2f3ff] p-2 rounded-xl flex items-center justify-between border border-[#dae2fd]">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-[#131b2e]">Live Stock</span>
                <span
                  className={`text-[11px] font-black ${
                    formInStock ? 'text-[#006b2c]' : 'text-[#ba1a1a]'
                  }`}
                >
                  {formInStock ? 'In Stock' : 'Sold Out'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setFormInStock(!formInStock)}
                className={`w-10 h-5 rounded-full relative p-0.5 transition-colors ${
                  formInStock ? 'bg-[#006b2c]' : 'bg-[#dae2fd]'
                }`}
              >
                <div
                  className={`w-4 h-4 bg-white rounded-full transition-transform ${
                    formInStock ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Pricing: MRP, Selling, Profit margin */}
          <div className="grid grid-cols-3 gap-2 bg-[#f2f3ff] p-2.5 rounded-xl border border-[#dae2fd]">
            <div>
              <label className="text-[10px] text-[#6e7b6c] block">MRP (₹)</label>
              <input
                type="number"
                value={formMrp}
                onChange={(e) => setFormMrp(Number(e.target.value))}
                className="w-full bg-white text-[#131b2e] font-black text-xs px-2 py-1.5 rounded-lg text-center outline-none border border-[#dae2fd] font-inter"
              />
            </div>
            <div>
              <label className="text-[10px] text-[#6e7b6c] block">Selling (₹)</label>
              <input
                type="number"
                value={formSelling}
                onChange={(e) => setFormSelling(Number(e.target.value))}
                className="w-full bg-white text-[#006b2c] font-black text-xs px-2 py-1.5 rounded-lg text-center outline-none border border-[#dae2fd] font-inter"
              />
            </div>
            <div className="flex flex-col items-center justify-center">
              <span className="bg-[#acf847] text-[#457000] text-[9px] font-black px-2 py-0.5 rounded-full">
                {Math.round(((formMrp - formSelling) / (formMrp || 1)) * 100)}% OFF
              </span>
              <span className="text-[10px] text-[#3e4a3d] mt-0.5 font-bold font-inter">
                ₹{Math.max(0, formMrp - formSelling)} save
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="w-full bg-[#f2f3ff] text-[#131b2e] font-bold text-xs py-2.5 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full bg-[#006b2c] text-white font-black text-xs py-2.5 rounded-xl shadow-xs flex items-center justify-center gap-1 active:scale-95"
            >
              <span className="material-symbols-outlined text-[16px]">publish</span>
              <span>Publish SKU</span>
            </button>
          </div>
        </form>
      )}

      {/* Filter Category Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedFilter(c.id)}
            className={`text-xs px-3.5 py-1.5 rounded-full shrink-0 font-bold transition ${
              selectedFilter === c.id
                ? 'bg-[#006b2c] text-white shadow-xs'
                : 'bg-white text-[#131b2e] hover:bg-[#eaedff] border border-[#dae2fd]/50'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Live Rate Editor List */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-black text-[#131b2e]">Catalog Items</span>
            <span className="bg-[#eaedff] text-[10px] text-[#006b2c] font-black px-2 py-0.5 rounded-full">
              {filteredProducts.length} Shown
            </span>
          </div>
          <span className="text-[11px] text-[#6e7b6c] flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px] text-[#006b2c]">sync</span>
            Tap rates to modify
          </span>
        </div>

        {filteredProducts.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-2xl p-3 shadow-xs space-y-2.5 border border-[#dae2fd]/60"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-13 h-13 rounded-xl bg-[#f2f3ff] shrink-0 overflow-hidden border border-[#dae2fd]/50">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="bg-[#eaedff] text-[9px] text-[#3e4a3d] px-1.5 py-0.5 rounded-full font-bold">
                      {p.categoryLabel}
                    </span>
                    <span className="text-[10px] text-[#6e7b6c]">{p.unit}</span>
                    {p.stockCount && p.stockCount <= 3 && (
                      <span className="bg-[#ffdad6] text-[#ba1a1a] text-[9px] font-black px-1.5 py-0.2 rounded">
                        {p.stockCount} left
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-black text-[#131b2e] truncate">{p.name}</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-[#6e7b6c] line-through font-inter">
                      MRP ₹{p.mrp}
                    </span>
                    <span className="text-[9px] font-bold text-[#006b2c] bg-[#acf847]/30 px-1 rounded font-inter">
                      Save ₹{Math.max(0, p.mrp - p.price)}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  onArchiveProduct(p.id);
                  onShowToast(`Archived "${p.name}"`);
                }}
                className="w-7 h-7 rounded-full bg-[#f2f3ff] flex items-center justify-center text-[#6e7b6c] hover:text-[#ba1a1a] transition shrink-0"
                title="Archive Product"
              >
                <span className="material-symbols-outlined text-[16px]">archive</span>
              </button>
            </div>

            {/* Rate Adjuster & In-Stock Switch Bar */}
            <div className="bg-[#f2f3ff] rounded-xl p-2 flex items-center justify-between gap-2 border border-[#dae2fd]">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleAdjustPrice(p.id, -5)}
                  className="w-7 h-7 rounded-lg bg-white text-[#131b2e] flex items-center justify-center font-black text-xs active:scale-95 shadow-xs border border-[#dae2fd]"
                >
                  -5
                </button>
                <div className="flex items-center bg-white rounded-lg px-2 h-7 shadow-xs border border-[#dae2fd]">
                  <span className="text-[10px] text-[#6e7b6c] font-black mr-0.5">₹</span>
                  <input
                    type="number"
                    value={p.price}
                    onChange={(e) => onUpdateProductPrice(p.id, Number(e.target.value) || 0)}
                    className="w-10 text-xs text-[#006b2c] text-center font-black outline-none bg-transparent font-inter"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleAdjustPrice(p.id, 5)}
                  className="w-7 h-7 rounded-lg bg-white text-[#131b2e] flex items-center justify-center font-black text-xs active:scale-95 shadow-xs border border-[#dae2fd]"
                >
                  +5
                </button>
              </div>

              {/* Stock Toggle & Update Button */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    onToggleProductStock(p.id);
                    onShowToast(`${p.name} is now ${!p.inStock ? 'In Stock' : 'Sold Out'}`);
                  }}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-black shadow-xs transition ${
                    p.inStock
                      ? 'bg-[#acf847] text-[#457000]'
                      : 'bg-[#ffdad6] text-[#ba1a1a]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[14px]">
                    {p.inStock ? 'check_circle' : 'cancel'}
                  </span>
                  <span>{p.inStock ? 'In Stock' : 'Sold Out'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => onShowToast(`Storefront synced ${p.name} rate in 12ms!`)}
                  className="w-7 h-7 rounded-lg bg-[#006b2c] text-white flex items-center justify-center transition-transform active:scale-90 shadow-xs"
                  title="Update rate"
                >
                  <span className="material-symbols-outlined text-[16px]">done</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Google Sheets / CSV Sync Card */}
      <div className="bg-[#f2f3ff] rounded-2xl p-4 shadow-xs space-y-2.5 border border-[#dae2fd]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#006b2c] text-[22px]">table_chart</span>
            <div>
              <span className="text-xs font-black text-[#131b2e] block leading-tight">
                Google Sheets / CSV Sync
              </span>
              <span className="text-[10px] text-[#6e7b6c]">Last synced: 10 mins ago</span>
            </div>
          </div>
          <button
            onClick={() => onShowToast('Synced catalog with Google Sheets')}
            className="material-symbols-outlined text-[#006b2c] text-[20px] hover:rotate-180 transition-transform"
          >
            autorenew
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={() => onShowToast('Downloaded catalog template (.csv)')}
            className="bg-white hover:bg-[#eaedff] text-[#131b2e] text-xs font-bold py-2 px-2 rounded-xl flex items-center justify-center gap-1 shadow-xs border border-[#dae2fd]"
          >
            <span className="material-symbols-outlined text-[15px] text-[#006b2c]">download</span>
            <span>Template (.csv)</span>
          </button>
          <button
            onClick={() => onShowToast('Imported 48 updated item prices')}
            className="bg-white hover:bg-[#eaedff] text-[#131b2e] text-xs font-bold py-2 px-2 rounded-xl flex items-center justify-center gap-1 shadow-xs border border-[#dae2fd]"
          >
            <span className="material-symbols-outlined text-[15px] text-[#006b2c]">upload_file</span>
            <span>Import Sheet</span>
          </button>
        </div>
      </div>
    </div>
  );
};
