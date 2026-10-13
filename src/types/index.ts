export type OrderStatus =
  | 'PENDING'    // Order placed — awaiting staff acceptance
  | 'ACCEPTED'   // Accepted by staff
  | 'PREPARING'  // In mess kitchen preparation
  | 'READY'      // Ready for campus pickup
  | 'COLLECTED'  // Student collected food
  | 'REJECTED'   // Rejected by staff (restores stock)
  | 'CANCELLED'; // Cancelled (restores stock)

export interface FoodComboOption {
  id: string;
  name: string;
  priceDelta: number;
}

export interface FoodCombo {
  id: string;
  name: string;
  description?: string;
  price: number;
  options: FoodComboOption[];
}

export interface AddOn {
  id: string;
  name: string;
  price: number;
}

export interface MenuItem {
  id: string;
  name: string;
  servingSize: string; // e.g. "100g", "2 pcs", "1 plate"
  originHostel: string; // e.g. "Hostel 4", "Hostel 16"
  description: string;
  category: 'Starters' | 'Main Course' | 'Staples' | 'Sides';
  price: number;
  availablePortions: number;
  isAvailable: boolean;
  rating: number;
  ratingCount: number;
  image: string;
  combos?: FoodCombo[];
  addOns?: AddOn[];
}

export interface SelectedCombo {
  comboId: string;
  comboName: string;
  price: number;
  selectedOptionIds: string[];
}

export interface SelectedAddOn {
  id: string;
  name: string;
  price: number;
}

export interface CartItem {
  cartItemId: string; // unique ID in cart
  menuItemId: string;
  name: string;
  servingSize: string;
  basePrice: number;
  unitPrice: number; // basePrice + combos + addons
  quantity: number;
  image: string;
  originHostel: string;
  selectedCombos: SelectedCombo[];
  selectedAddOns: SelectedAddOn[];
}

export interface OrderItemSnapshot {
  menuItemId: string;
  name: string;
  servingSize: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  image: string;
  originHostel: string;
  combosDescription: string;
  addOnsDescription: string;
}

export interface Order {
  id: string; // e.g. "REP-8492"
  studentName: string;
  studentHostel: string;
  studentPhone: string;
  items: OrderItemSnapshot[];
  itemCount: number;
  subtotal: number;
  taxOrFees: number;
  totalAmount: number;
  pickupPoint: string;
  status: OrderStatus;
  statusTimeline: {
    status: OrderStatus;
    timestamp: string;
    note?: string;
  }[];
  paymentDemoStatus: 'SUCCESS' | 'CANCELLED';
  paymentMethod: string;
  createdAt: string;
  rejectionReason?: string;
  stockReserved: boolean;
  stockRestored: boolean;
  hasFeedback?: boolean;
}

export interface StudentProfile {
  name: string;
  hostelNumber: string;
  phoneNumber: string;
}

export interface FeedbackSubmission {
  orderId: string;
  studentName: string;
  tasteRating: number;
  qualityRating: number;
  pickupTimeRating: number;
  appEaseRating: number;
  overallRating: number;
  comments: string;
  submittedAt: string;
}

export interface PickupPoint {
  id: string;
  name: string;
  locationDetails: string;
  isOpen: boolean;
}
