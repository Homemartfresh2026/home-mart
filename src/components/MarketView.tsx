import React, { useState } from 'react';
import { Product, CartItem } from '../types';

interface MarketViewProps {
  products: Product[];
  cart: CartItem[];
  favorites: Set<string>;
  onToggleFavorite: (productId: string) => void;
  onAddToCart: (productId: string, selectedWeight?: string) => void;
  onUpdateQuantity: (productId: string, delta: number) => void;
  onNavigateToBasket: () => void;
  onShowToast: (msg: string) => void;
}

export const MarketView: React.FC<MarketViewProps> = ({
  products,
  cart,
  favorites,
  onToggleFavorite,
  onAddToCart,
  onUpdateQuantity,
  onNavigateToBasket,
  onShowToast,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeSlide, setActiveSlide] = useState(0);
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedTagFilter, setSelectedTagFilter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'featured' | 'priceAsc' | 'rating'>('featured');
  const [selectedWeights, setSelectedWeights] = useState<Record<string, number>>({});

  const slides = [
    {
      badge: 'Harvest Special',
      badgeEnd: 'Ends Today',
      title: 'Farm-Fresh Summer Harvest',
      desc: 'Up to 35% OFF on crisp organic veggies & sweet berries',
      cta: 'Shop Now',
      gradient: 'from-[#006b2c] via-[#00873a] to-[#416900]',
    },
    {
      badge: 'Direct Mandi',
      badgeEnd: 'Morning Pick',
      title: 'Crunchy Hydroponic Greens',
      desc: 'Zero chemical pesticides • Inspected 3-layer quality check',
      cta: 'Explore Veggies',
      gradient: 'from-[#005320] via-[#006e2d] to-[#755800]',
    },
    {
      badge: 'Express Deal',
      badgeEnd: '15 Mins',
      title: 'Daily Kitchen Essentials',
      desc: 'Aashirvaad Atta, Fortune Oil & Amul Butter at wholesale rates',
      cta: 'Grab Staples',
      gradient: 'from-[#416900] via-[#00873a] to-[#005320]',
    },
  ];

  const categories = [
    { id: 'all', label: 'All Produce', icon: 'potted_plant' },
    { id: 'fruits', label: 'Fresh Fruits', icon: 'nutrition', color: 'text-[#936f00]' },
    { id: 'veggies', label: 'Green Veggies', icon: 'spa', color: 'text-[#006b2c]' },
    { id: 'staples', label: 'Staples & Grains', icon: 'yard', color: 'text-[#755800]' },
    { id: 'dairy', label: 'Dairy & Bakery', icon: 'local_florist', color: 'text-[#416900]' },
    { id: 'beverages', label: 'Snacks & Drinks', icon: 'local_fire_department', color: 'text-[#ba1a1a]' },
    { id: 'baby', label: 'Baby Care', icon: 'child_care', color: 'text-[#006b2c]' },
    { id: 'toiletries', label: 'Toiletries', icon: 'cleaning_services', color: 'text-[#3e4a3d]' },
  ];

  const handleVoiceSearchSimulation = (query: string) => {
    setSearchQuery(query);
    setShowVoiceModal(false);
    onShowToast(`Searching for "${query}"`);
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.origin && p.origin.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCat =
      selectedCategory === 'all' ||
      p.category === selectedCategory ||
      (selectedCategory === 'veggies' && p.category === 'veggies') ||
      (selectedCategory === 'fruits' && p.category === 'fruits');

    const matchesTag = !selectedTagFilter || p.tag.toLowerCase().includes(selectedTagFilter.toLowerCase());

    return matchesSearch && matchesCat && matchesTag;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'priceAsc') return a.price - b.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0;
  });

  const getProductQty = (id: string) => {
    const item = cart.find((c) => c.productId === id);
    return item ? item.quantity : 0;
  };

  const totalCartCount = cart.reduce((acc, c) => acc + c.quantity, 0);
  const totalCartPrice = cart.reduce((acc, c) => acc + c.quantity * c.pricePerUnit, 0);

  return (
    <div className="flex flex-col w-full pb-20 max-w-md mx-auto">
      {/* Search & Voice / Filter Bar */}
      <div className="px-4 pt-2 pb-2 flex flex-col gap-2">
        <div className="flex items-center gap-2 w-full">
          <div className="relative flex-1 flex items-center bg-[#f2f3ff] rounded-full px-3.5 py-2 shadow-xs transition-all focus-within:bg-[#eaedff] focus-within:ring-2 focus-within:ring-[#006b2c]/30">
            <span className="material-symbols-outlined text-[#006b2c] text-[20px] mr-2">search</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search apples, spinach, broccoli..."
              className="w-full bg-transparent text-[#131b2e] text-[13px] placeholder:text-[#6e7b6c] focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="p-1 text-[#6e7b6c] hover:text-[#131b2e]"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => setShowVoiceModal(true)}
              aria-label="Voice Search"
              className="p-1 rounded-full text-[#3e4a3d] hover:text-[#006b2c] transition-colors flex items-center justify-center ml-1"
            >
              <span className="material-symbols-outlined text-[20px]">mic</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setShowFilterModal(true)}
            aria-label="Filter Produce"
            className="h-10 w-10 shrink-0 flex items-center justify-center rounded-full bg-[#f2f3ff] text-[#131b2e] hover:bg-[#eaedff] shadow-xs transition-colors active:scale-95 border border-[#dae2fd]/50"
          >
            <span className="material-symbols-outlined text-[20px]">tune</span>
          </button>
        </div>
      </div>

      {/* Promotional Banner Carousel Card */}
      <div className="px-4 mb-3">
        <div
          className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${slides[activeSlide].gradient} text-white shadow-md p-4 flex flex-col justify-between min-h-[148px] transition-all duration-300`}
        >
          <div className="absolute -right-6 -bottom-8 w-36 h-36 rounded-full bg-[#acf847]/20 blur-xl pointer-events-none"></div>

          <div className="flex items-center justify-between z-10">
            <span className="inline-flex items-center gap-1 bg-[#acf847] text-[#457000] text-[11px] px-2.5 py-0.5 rounded-full uppercase tracking-wider font-extrabold shadow-xs">
              <span className="material-symbols-outlined text-[14px]">eco</span>
              {slides[activeSlide].badge}
            </span>
            <span className="text-[11px] font-semibold bg-white/20 backdrop-blur-sm text-white px-2.5 py-0.5 rounded-full font-inter">
              {slides[activeSlide].badgeEnd}
            </span>
          </div>

          <div className="z-10 mt-2">
            <h2 className="text-[19px] leading-tight max-w-[240px] text-white font-extrabold tracking-tight">
              {slides[activeSlide].title}
            </h2>
            <p className="text-[12px] text-[#f7fff2] mt-1 opacity-90 line-clamp-1">
              {slides[activeSlide].desc}
            </p>
          </div>

          <div className="mt-3 flex items-center justify-between z-10">
            <button
              onClick={() => {
                setSelectedCategory('all');
                onShowToast('Browsing special harvest produce');
              }}
              className="bg-[#acf847] text-[#457000] hover:bg-[#91db2a] text-[12px] px-4 py-1.5 rounded-full font-black shadow-xs flex items-center gap-1 active:scale-95 transition-transform"
            >
              <span>{slides[activeSlide].cta}</span>
              <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
            </button>

            <div className="flex items-center gap-1.5">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveSlide(idx)}
                  className={`h-1.5 rounded-full transition-all ${
                    activeSlide === idx ? 'w-4 bg-white' : 'w-1.5 bg-white/40'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Category Pills (Horizontal Scroll) */}
      <div className="mb-3">
        <div className="flex items-center gap-2 overflow-x-auto px-4 no-scrollbar py-1">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[12px] font-bold transition-all active:scale-95 ${
                  isSelected
                    ? 'bg-[#006b2c] text-white shadow-xs'
                    : 'bg-[#f2f3ff] text-[#131b2e] hover:bg-[#eaedff]'
                }`}
              >
                <span
                  className={`material-symbols-outlined text-[16px] ${
                    isSelected ? 'text-white' : cat.color || 'text-[#006b2c]'
                  }`}
                >
                  {cat.icon}
                </span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Header for Products Grid */}
      <div className="px-4 flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <h3 className="font-extrabold text-[17px] text-[#131b2e] tracking-tight">
            Fresh Picks of the Day
          </h3>
          <span className="w-2 h-2 rounded-full bg-[#006b2c] animate-pulse"></span>
        </div>
        <button
          onClick={() => {
            setSelectedCategory('all');
            setSelectedTagFilter(null);
            setSearchQuery('');
          }}
          className="text-[12px] text-[#006b2c] font-bold flex items-center hover:underline cursor-pointer"
        >
          <span>View {sortedProducts.length} items</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        </button>
      </div>

      {/* 2-Column Product Grid */}
      <div className="px-4 grid grid-cols-2 gap-2.5">
        {sortedProducts.map((product) => {
          const qty = getProductQty(product.id);
          const isFav = favorites.has(product.id);
          const weightIdx = selectedWeights[product.id] ?? (product.selectedWeightIndex ?? 0);
          const currentWeight = product.weightOptions ? product.weightOptions[weightIdx] : null;
          const displayPrice = currentWeight
            ? Math.round(product.price * currentWeight.multiplier)
            : product.price;

          return (
            <div
              key={product.id}
              className="flex flex-col bg-white rounded-2xl p-2.5 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.06)] border border-[#dae2fd]/50 justify-between relative overflow-hidden group hover:border-[#006b2c]/30 transition-all"
            >
              <div>
                {/* Product Image Box */}
                <div className="relative w-full aspect-square rounded-xl bg-[#f2f3ff] overflow-hidden mb-2">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />

                  {/* Tag badge */}
                  <span
                    className={`absolute top-2 left-2 text-[9px] font-extrabold px-2 py-0.5 rounded-full shadow-xs uppercase tracking-wide ${
                      product.tagType === 'organic'
                        ? 'bg-[#ffdf9a] text-[#251a00]'
                        : product.tagType === 'picked'
                        ? 'bg-[#acf847] text-[#457000]'
                        : product.tagType === 'best'
                        ? 'bg-[#00873a] text-white'
                        : product.tagType === 'crisp'
                        ? 'bg-[#acf847] text-[#457000]'
                        : 'bg-[#dae2fd] text-[#131b2e]'
                    }`}
                  >
                    {product.tag}
                  </span>

                  {/* Favorite Button */}
                  <button
                    onClick={() => {
                      onToggleFavorite(product.id);
                      onShowToast(isFav ? `Removed ${product.name} from wishlist` : `Added ${product.name} to wishlist!`);
                    }}
                    aria-label="Favorite"
                    className="absolute top-2 right-2 w-7 h-7 bg-white/85 backdrop-blur-sm rounded-full flex items-center justify-center text-[#6e7b6c] hover:text-[#ba1a1a] transition-colors active:scale-90 shadow-xs"
                  >
                    <span
                      className={`material-symbols-outlined text-[16px] ${
                        isFav ? 'text-[#ba1a1a]' : 'text-[#6e7b6c]'
                      }`}
                      style={isFav ? { fontVariationSettings: "'FILL' 1" } : undefined}
                    >
                      favorite
                    </span>
                  </button>

                  {!product.inStock && (
                    <div className="absolute inset-0 bg-white/70 backdrop-blur-xs flex items-center justify-center">
                      <span className="text-[11px] font-extrabold px-2.5 py-1 rounded-full bg-[#ffdad6] text-[#ba1a1a]">
                        Sold Out
                      </span>
                    </div>
                  )}
                </div>

                {/* Star Rating & Reviews */}
                <div className="flex items-center gap-1 mb-1">
                  <span
                    className="material-symbols-outlined text-[#936f00] text-[14px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                  <span className="text-[11px] text-[#131b2e] font-extrabold font-inter">
                    {product.rating}
                  </span>
                  <span className="text-[10px] text-[#6e7b6c] font-inter">
                    ({product.reviewsCount})
                  </span>
                </div>

                <h4 className="text-[13px] font-bold text-[#131b2e] line-clamp-1 leading-snug">
                  {product.name}
                </h4>
                <p className="text-[11px] text-[#3e4a3d] mb-1.5 truncate">
                  {product.origin || product.categoryLabel}
                </p>

                {/* Weight Options Pills if available */}
                {product.weightOptions && (
                  <div className="flex items-center gap-1 mb-2">
                    {product.weightOptions.map((opt, oIdx) => {
                      const isWeightSelected = weightIdx === oIdx;
                      return (
                        <button
                          key={oIdx}
                          onClick={() => {
                            setSelectedWeights((prev) => ({ ...prev, [product.id]: oIdx }));
                          }}
                          className={`px-1.5 py-0.5 rounded-full text-[10px] font-inter transition-all ${
                            isWeightSelected
                              ? 'bg-[#006b2c]/15 text-[#006b2c] font-bold ring-1 ring-[#006b2c]'
                              : 'bg-[#eaedff] text-[#3e4a3d] hover:bg-[#dae2fd]'
                          }`}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Price & Cart Actions */}
              <div>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-[16px] font-black text-[#006b2c] font-inter">
                    ₹{displayPrice}
                  </span>
                  <span className="text-[11px] text-[#6e7b6c] line-through font-inter">
                    ₹{Math.round(product.mrp * (currentWeight ? currentWeight.multiplier : 1))}
                  </span>
                  <span className="text-[10px] text-[#3e4a3d] font-inter">
                    /{currentWeight ? currentWeight.label : product.unit}
                  </span>
                </div>

                {/* Add / Stepper Button */}
                {product.inStock ? (
                  qty === 0 ? (
                    <button
                      onClick={() => {
                        const chosenWeightLabel = currentWeight?.label;
                        onAddToCart(product.id, chosenWeightLabel);
                        onShowToast(`Added ${product.name} to basket!`);
                      }}
                      className="w-full h-8 rounded-full bg-[#f2f3ff] text-[#006b2c] hover:bg-[#006b2c] hover:text-white flex items-center justify-center gap-1 text-[12px] font-extrabold transition-all active:scale-95 shadow-xs border border-[#dae2fd]"
                    >
                      <span className="material-symbols-outlined text-[17px]">add</span>
                      <span>Add</span>
                    </button>
                  ) : (
                    <div className="w-full h-8 rounded-full bg-[#006b2c] text-white flex items-center justify-between px-2 shadow-xs transition-all">
                      <button
                        onClick={() => onUpdateQuantity(product.id, -1)}
                        aria-label="Decrease quantity"
                        className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/20 active:scale-90 transition-transform"
                      >
                        <span className="material-symbols-outlined text-[16px]">remove</span>
                      </button>
                      <span className="text-[12px] font-extrabold font-inter text-white">
                        {qty} {currentWeight ? currentWeight.label : 'item'}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(product.id, 1)}
                        aria-label="Increase quantity"
                        className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/20 active:scale-90 transition-transform"
                      >
                        <span className="material-symbols-outlined text-[16px]">add</span>
                      </button>
                    </div>
                  )
                ) : (
                  <button
                    disabled
                    className="w-full h-8 rounded-full bg-[#eaedff] text-[#6e7b6c] text-[11px] font-bold cursor-not-allowed"
                  >
                    Unavailable
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Freshness Guarantee Banner */}
      <div className="mx-4 mt-5 p-3.5 rounded-2xl bg-[#f2f3ff] border border-[#dae2fd]/60 flex items-center gap-3 shadow-xs">
        <div className="w-10 h-10 rounded-full bg-[#006b2c]/10 text-[#006b2c] flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-[24px]">verified</span>
        </div>
        <div className="flex-1 min-w-0">
          <h5 className="text-[13px] text-[#131b2e] font-extrabold leading-snug">
            100% Crisp Guarantee
          </h5>
          <p className="text-[11px] text-[#3e4a3d] mt-0.5">
            Not completely fresh? Instant free swap or instant refund on your order.
          </p>
        </div>
      </div>

      {/* Floating Sticky Mini-Cart Bar */}
      {totalCartCount > 0 && (
        <div className="sticky bottom-20 px-4 z-40 mt-4 animate-in slide-in-from-bottom-4 duration-300">
          <div
            onClick={onNavigateToBasket}
            className="w-full bg-[#283044] text-[#eef0ff] rounded-2xl p-2.5 px-3.5 shadow-xl flex items-center justify-between backdrop-blur-md active:scale-[0.99] transition-transform cursor-pointer border border-white/10"
          >
            <div className="flex items-center gap-3">
              <div className="relative w-9 h-9 rounded-full bg-[#006b2c] flex items-center justify-center text-white shrink-0 shadow-xs">
                <span className="material-symbols-outlined text-[20px]">shopping_basket</span>
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#acf847] text-[#457000] text-[10px] font-extrabold flex items-center justify-center font-inter">
                  {totalCartCount}
                </span>
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5 leading-none">
                  <span className="text-[12px] font-bold text-white">
                    Basket: {totalCartCount} items
                  </span>
                  <span className="text-white/40 font-inter">•</span>
                  <span className="text-[13px] font-black text-[#62df7d] font-inter">
                    ₹{totalCartPrice}
                  </span>
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="material-symbols-outlined text-[#acf847] text-[13px]">
                    check_circle
                  </span>
                  <span className="text-[10px] text-[#acf847] font-semibold">
                    Free Delivery Unlocked
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-full text-[12px] font-extrabold transition-colors shrink-0">
              <span>View</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </div>
          </div>
        </div>
      )}

      {/* Voice Search Modal Simulation */}
      {showVoiceModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm text-center shadow-2xl space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#006b2c]/10 text-[#006b2c] flex items-center justify-center mx-auto animate-pulse">
              <span className="material-symbols-outlined text-[36px]">mic</span>
            </div>
            <div>
              <h3 className="font-extrabold text-[17px] text-[#131b2e]">Listening for produce...</h3>
              <p className="text-xs text-[#6e7b6c] mt-1">Try saying "Apples", "Spinach", or "Cooking Oil"</p>
            </div>
            <div className="flex flex-wrap gap-2 justify-center pt-2">
              {['Apples', 'Palak', 'Tomatoes', 'Oil', 'Butter'].map((word) => (
                <button
                  key={word}
                  onClick={() => handleVoiceSearchSimulation(word)}
                  className="px-3 py-1 rounded-full bg-[#eaedff] text-[#006b2c] text-xs font-bold hover:bg-[#dae2fd]"
                >
                  "{word}"
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowVoiceModal(false)}
              className="w-full py-2.5 rounded-xl bg-[#f2f3ff] text-[#131b2e] font-bold text-xs"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl p-5 w-full max-w-sm shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#eaedff] pb-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#006b2c] text-[20px]">tune</span>
                <h3 className="font-extrabold text-[16px] text-[#131b2e]">Filter & Sort</h3>
              </div>
              <button
                onClick={() => setShowFilterModal(false)}
                className="w-7 h-7 rounded-full bg-[#eaedff] text-[#3e4a3d] flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>

            <div>
              <label className="text-xs font-extrabold text-[#131b2e] block mb-2">Sort By</label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'featured', label: 'Featured' },
                  { id: 'priceAsc', label: 'Price: Low' },
                  { id: 'rating', label: 'Top Rated' },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSortBy(s.id as any)}
                    className={`py-2 rounded-xl text-xs font-bold transition ${
                      sortBy === s.id
                        ? 'bg-[#006b2c] text-white shadow-xs'
                        : 'bg-[#f2f3ff] text-[#3e4a3d]'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-extrabold text-[#131b2e] block mb-2">Produce Badges</label>
              <div className="flex flex-wrap gap-2">
                {['Organic', 'Picked Today', 'Hydroponic', 'Best Seller'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setSelectedTagFilter(selectedTagFilter === t ? null : t)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition ${
                      selectedTagFilter === t
                        ? 'bg-[#006b2c] text-white'
                        : 'bg-[#f2f3ff] text-[#3e4a3d]'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  setSelectedTagFilter(null);
                  setSortBy('featured');
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#f2f3ff] text-[#3e4a3d] text-xs font-bold"
              >
                Reset
              </button>
              <button
                onClick={() => setShowFilterModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-[#006b2c] text-white text-xs font-bold shadow-md"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
