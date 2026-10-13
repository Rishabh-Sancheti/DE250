import { create } from 'zustand';
import { Order, OrderStatus, CartItem, StudentProfile, OrderItemSnapshot } from '../types';
import { useMenuStore } from './menuStore';

interface OrderState {
  orders: Order[];
  activeOrderId: string | null;
  
  // Actions
  createOrder: (
    student: StudentProfile,
    cartItems: CartItem[],
    pickupPoint: string
  ) => { success: boolean; orderId?: string; error?: string };
  
  getOrderById: (orderId: string) => Order | undefined;
  getStudentOrders: (phone?: string) => Order[];
  
  // Status transitions
  acceptOrder: (orderId: string) => { success: boolean; error?: string };
  rejectOrder: (orderId: string, reason: string) => { success: boolean; error?: string };
  cancelOrder: (orderId: string, reason: string) => { success: boolean; error?: string };
  setOrderPreparing: (orderId: string) => { success: boolean; error?: string };
  setOrderReady: (orderId: string) => { success: boolean; error?: string };
  confirmOrderCollected: (orderId: string) => { success: boolean; error?: string };
  markFeedbackSubmitted: (orderId: string) => void;
  
  // Reset
  resetOrders: () => void;
}

const ORDERS_STORAGE_KEY = 'replate_orders_v1';

const getInitialOrders = (): Order[] => {
  try {
    const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to load orders from localStorage', e);
  }

  // Sample initial orders for realistic staff demonstration
  const now = new Date();
  const formatTime = (minutesAgo: number) => {
    const d = new Date(now.getTime() - minutesAgo * 60000);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return [
    {
      id: 'REP-7412',
      studentName: 'Aarav Patel',
      studentHostel: 'Hostel 4, Room 210',
      studentPhone: '9823456789',
      items: [
        {
          menuItemId: 'item-1',
          name: 'Paneer Tikka',
          servingSize: '100g',
          unitPrice: 115,
          quantity: 1,
          totalPrice: 115,
          image: '/assets/food/paneer_tikka.jpg',
          originHostel: 'Hostel 4',
          combosDescription: 'Combo 1 (chapati 2, papad 3)',
          addOnsDescription: '',
        },
      ],
      itemCount: 1,
      subtotal: 115,
      taxOrFees: 0,
      totalAmount: 115,
      pickupPoint: 'Main Mess Counter',
      status: 'PENDING',
      statusTimeline: [
        { status: 'PENDING', timestamp: formatTime(6), note: 'Simulated payment verified' },
      ],
      paymentDemoStatus: 'SUCCESS',
      paymentMethod: 'Demo Campus UPI',
      createdAt: new Date(Date.now() - 6 * 60000).toISOString(),
      stockReserved: true,
      stockRestored: false,
      hasFeedback: false,
    },
    {
      id: 'REP-6320',
      studentName: 'Ananya Roy',
      studentHostel: 'Hostel 16, Room 104',
      studentPhone: '9711223344',
      items: [
        {
          menuItemId: 'item-2',
          name: 'Soyabean Masala',
          servingSize: '150g',
          unitPrice: 75,
          quantity: 2,
          totalPrice: 150,
          image: '/assets/food/soyabean_masala.jpg',
          originHostel: 'Hostel 16',
          combosDescription: 'Combo 1 (chapati 2, papad 1)',
          addOnsDescription: '',
        },
      ],
      itemCount: 2,
      subtotal: 150,
      taxOrFees: 0,
      totalAmount: 150,
      pickupPoint: 'Hostel 16 Pickup Booth',
      status: 'PREPARING',
      statusTimeline: [
        { status: 'PENDING', timestamp: formatTime(25) },
        { status: 'ACCEPTED', timestamp: formatTime(20), note: 'Accepted by Kitchen Head' },
        { status: 'PREPARING', timestamp: formatTime(15), note: 'Chef preparing fresh combo' },
      ],
      paymentDemoStatus: 'SUCCESS',
      paymentMethod: 'Demo Campus UPI',
      createdAt: new Date(Date.now() - 25 * 60000).toISOString(),
      stockReserved: true,
      stockRestored: false,
      hasFeedback: false,
    },
    {
      id: 'REP-5188',
      studentName: 'Vikram Singh',
      studentHostel: 'Hostel 8, Room 412',
      studentPhone: '9844556677',
      items: [
        {
          menuItemId: 'item-3',
          name: 'Manchurian',
          servingSize: '150g',
          unitPrice: 60,
          quantity: 1,
          totalPrice: 60,
          image: '/assets/food/manchurian.jpg',
          originHostel: 'Hostel 8',
          combosDescription: '',
          addOnsDescription: '',
        },
      ],
      itemCount: 1,
      subtotal: 60,
      taxOrFees: 0,
      totalAmount: 60,
      pickupPoint: 'Main Mess Counter',
      status: 'COLLECTED',
      statusTimeline: [
        { status: 'PENDING', timestamp: formatTime(90) },
        { status: 'ACCEPTED', timestamp: formatTime(85) },
        { status: 'PREPARING', timestamp: formatTime(75) },
        { status: 'READY', timestamp: formatTime(60) },
        { status: 'COLLECTED', timestamp: formatTime(40), note: 'Picked up by student' },
      ],
      paymentDemoStatus: 'SUCCESS',
      paymentMethod: 'Demo Campus UPI',
      createdAt: new Date(Date.now() - 90 * 60000).toISOString(),
      stockReserved: true,
      stockRestored: false,
      hasFeedback: true,
    },
  ];
};

export const useOrderStore = create<OrderState>((set, get) => {
  const initial = getInitialOrders();

  const persist = (orders: Order[]) => {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    } catch (e) {
      console.error('Failed to persist orders', e);
    }
  };

  return {
    orders: initial,
    activeOrderId: initial.length > 0 ? initial[0].id : null,

    createOrder: (student, cartItems, pickupPoint) => {
      if (cartItems.length === 0) {
        return { success: false, error: 'Cannot place an empty order.' };
      }

      const menuStore = useMenuStore.getState();

      // 1. Validate stock again immediately before placement
      for (const cartItem of cartItems) {
        const menuItem = menuStore.getItemById(cartItem.menuItemId);
        if (!menuItem || !menuItem.isAvailable) {
          return {
            success: false,
            error: `Item "${cartItem.name}" is no longer available.`,
          };
        }
        if (cartItem.quantity > menuItem.availablePortions) {
          return {
            success: false,
            error: `Only ${menuItem.availablePortions} portions of "${cartItem.name}" remaining.`,
          };
        }
      }

      // 2. Decrement stock atomically from the shared inventory
      for (const cartItem of cartItems) {
        menuStore.adjustPortions(cartItem.menuItemId, -cartItem.quantity);
      }

      // 3. Build snapshots
      const snapshots: OrderItemSnapshot[] = cartItems.map((ci) => {
        const comboDesc = ci.selectedCombos
          .map((c) => `${c.comboName} (+₹${c.price})`)
          .join(', ');
        const addOnDesc = ci.selectedAddOns
          .map((a) => `${a.name} (+₹${a.price})`)
          .join(', ');

        return {
          menuItemId: ci.menuItemId,
          name: ci.name,
          servingSize: ci.servingSize,
          unitPrice: ci.unitPrice,
          quantity: ci.quantity,
          totalPrice: ci.unitPrice * ci.quantity,
          image: ci.image,
          originHostel: ci.originHostel,
          combosDescription: comboDesc,
          addOnsDescription: addOnDesc,
        };
      });

      const subtotal = snapshots.reduce((acc, s) => acc + s.totalPrice, 0);
      const totalAmount = subtotal; // 0 demo fees
      const randomCode = Math.floor(1000 + Math.random() * 9000);
      const orderId = `REP-${randomCode}`;
      const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      const newOrder: Order = {
        id: orderId,
        studentName: student.name,
        studentHostel: student.hostelNumber,
        studentPhone: student.phoneNumber,
        items: snapshots,
        itemCount: snapshots.reduce((sum, s) => sum + s.quantity, 0),
        subtotal,
        taxOrFees: 0,
        totalAmount,
        pickupPoint,
        status: 'PENDING',
        statusTimeline: [
          {
            status: 'PENDING',
            timestamp: nowStr,
            note: 'Order placed & awaiting mess staff acceptance',
          },
        ],
        paymentDemoStatus: 'SUCCESS',
        paymentMethod: 'Demo Campus UPI',
        createdAt: new Date().toISOString(),
        stockReserved: true,
        stockRestored: false,
        hasFeedback: false,
      };

      const updated = [newOrder, ...get().orders];
      set({ orders: updated, activeOrderId: orderId });
      persist(updated);

      return { success: true, orderId };
    },

    getOrderById: (orderId: string) => {
      return get().orders.find((o) => o.id === orderId);
    },

    getStudentOrders: (phone?: string) => {
      if (!phone) return get().orders;
      return get().orders.filter((o) => o.studentPhone === phone);
    },

    acceptOrder: (orderId: string) => {
      const order = get().orders.find((o) => o.id === orderId);
      if (!order) return { success: false, error: 'Order not found' };
      if (order.status !== 'PENDING') {
        return { success: false, error: `Cannot accept order in ${order.status} state` };
      }

      const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const updated = get().orders.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            status: 'ACCEPTED' as OrderStatus,
            statusTimeline: [
              ...o.statusTimeline,
              { status: 'ACCEPTED' as OrderStatus, timestamp: nowStr, note: 'Order accepted by mess counter' },
            ],
          };
        }
        return o;
      });

      set({ orders: updated });
      persist(updated);
      return { success: true };
    },

    rejectOrder: (orderId: string, reason: string) => {
      const order = get().orders.find((o) => o.id === orderId);
      if (!order) return { success: false, error: 'Order not found' };
      if (order.status !== 'PENDING') {
        return { success: false, error: `Only pending orders can be rejected` };
      }

      // Restore reserved stock exactly once
      if (order.stockReserved && !order.stockRestored) {
        const menuStore = useMenuStore.getState();
        for (const item of order.items) {
          menuStore.adjustPortions(item.menuItemId, item.quantity);
        }
      }

      const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const updated = get().orders.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            status: 'REJECTED' as OrderStatus,
            rejectionReason: reason || 'Mess capacity exceeded or kitchen closed',
            stockRestored: true,
            statusTimeline: [
              ...o.statusTimeline,
              {
                status: 'REJECTED' as OrderStatus,
                timestamp: nowStr,
                note: `Rejected: ${reason || 'Mess capacity exceeded'}`,
              },
            ],
          };
        }
        return o;
      });

      set({ orders: updated });
      persist(updated);
      return { success: true };
    },

    cancelOrder: (orderId: string, reason: string) => {
      const order = get().orders.find((o) => o.id === orderId);
      if (!order) return { success: false, error: 'Order not found' };
      if (order.status !== 'PENDING' && order.status !== 'ACCEPTED') {
        return { success: false, error: 'Cannot cancel order once preparation has started' };
      }

      // Restore reserved stock exactly once
      if (order.stockReserved && !order.stockRestored) {
        const menuStore = useMenuStore.getState();
        for (const item of order.items) {
          menuStore.adjustPortions(item.menuItemId, item.quantity);
        }
      }

      const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const updated = get().orders.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            status: 'CANCELLED' as OrderStatus,
            rejectionReason: reason || 'Cancelled by student',
            stockRestored: true,
            statusTimeline: [
              ...o.statusTimeline,
              {
                status: 'CANCELLED' as OrderStatus,
                timestamp: nowStr,
                note: `Order cancelled. Portions returned to stock.`,
              },
            ],
          };
        }
        return o;
      });

      set({ orders: updated });
      persist(updated);
      return { success: true };
    },

    setOrderPreparing: (orderId: string) => {
      const order = get().orders.find((o) => o.id === orderId);
      if (!order) return { success: false, error: 'Order not found' };
      if (order.status !== 'ACCEPTED') {
        return { success: false, error: 'Order must be accepted before preparation' };
      }

      const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const updated = get().orders.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            status: 'PREPARING' as OrderStatus,
            statusTimeline: [
              ...o.statusTimeline,
              {
                status: 'PREPARING' as OrderStatus,
                timestamp: nowStr,
                note: 'Mess team packing your items',
              },
            ],
          };
        }
        return o;
      });

      set({ orders: updated });
      persist(updated);
      return { success: true };
    },

    setOrderReady: (orderId: string) => {
      const order = get().orders.find((o) => o.id === orderId);
      if (!order) return { success: false, error: 'Order not found' };
      if (order.status !== 'PREPARING') {
        return { success: false, error: 'Order must be in preparation before marking ready' };
      }

      const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const updated = get().orders.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            status: 'READY' as OrderStatus,
            statusTimeline: [
              ...o.statusTimeline,
              {
                status: 'READY' as OrderStatus,
                timestamp: nowStr,
                note: `Food packed & waiting at ${o.pickupPoint}`,
              },
            ],
          };
        }
        return o;
      });

      set({ orders: updated });
      persist(updated);
      return { success: true };
    },

    confirmOrderCollected: (orderId: string) => {
      const order = get().orders.find((o) => o.id === orderId);
      if (!order) return { success: false, error: 'Order not found' };
      if (order.status !== 'READY') {
        return { success: false, error: 'Order must be marked Ready before confirming collection' };
      }

      const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const updated = get().orders.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            status: 'COLLECTED' as OrderStatus,
            statusTimeline: [
              ...o.statusTimeline,
              {
                status: 'COLLECTED' as OrderStatus,
                timestamp: nowStr,
                note: 'Food collected by student. Enjoy your meal!',
              },
            ],
          };
        }
        return o;
      });

      set({ orders: updated });
      persist(updated);
      return { success: true };
    },

    markFeedbackSubmitted: (orderId: string) => {
      const updated = get().orders.map((o) =>
        o.id === orderId ? { ...o, hasFeedback: true } : o
      );
      set({ orders: updated });
      persist(updated);
    },

    resetOrders: () => {
      const fresh = getInitialOrders();
      set({ orders: fresh, activeOrderId: fresh[0].id });
      persist(fresh);
    },
  };
});
