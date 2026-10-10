export interface Product {
  id: string;
  name: string;
  category: string;
  categoryLabel: string;
  image: string;
  price: number;
  mrp: number;
  unit: string;
  weightOptions?: { label: string; multiplier: number }[];
  selectedWeightIndex?: number;
  rating: number;
  reviewsCount: number;
  tag: string;
  tagType: 'organic' | 'picked' | 'best' | 'hydroponic' | 'potassium' | 'crisp' | 'standard';
  inStock: boolean;
  stockCount?: number;
  origin?: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
  selectedWeight?: string;
  pricePerUnit: number;
}

export interface PickingItem {
  id: string;
  name: string;
  image: string;
  targetWeight: string;
  actualWeight: string;
  verified: boolean;
  verificationNote: string;
  price: number;
  priceAdjustedNote?: string;
  shelfLifeOk?: boolean;
  tactileChecked?: boolean;
}

export interface DispatchState {
  orderId: string;
  crateId: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: PickingItem[];
  rider: {
    name: string;
    rating: number;
    vehicle: string;
    phone: string;
    avatar: string;
    bay: string;
  };
  handoverOtp: string;
  securitySealTag: string;
  isSealScanned: boolean;
  isDispatched: boolean;
  remainingSeconds: number;
}

export interface OrderRecord {
  id: string;
  date: string;
  items: {
    name: string;
    unit: string;
    qty: number;
    price: number;
    emoji?: string;
  }[];
  total: number;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  paymentMethod: string;
  status: 'packing' | 'on_way' | 'delivered';
  riderName: string;
  riderPhone: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'order' | 'discount' | 'dispatch';
}
