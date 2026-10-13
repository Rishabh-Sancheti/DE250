import { create } from 'zustand';
import { CartItem, SelectedCombo, SelectedAddOn, MenuItem, PickupPoint } from '../types';
import { useMenuStore } from './menuStore';

export const CAMPUS_PICKUP_POINTS: PickupPoint[] = [
  {
    id: 'pp-main',
    name: 'Main Mess Counter',
    locationDetails: 'Ground Floor, Central Dining Hall',
    isOpen: true,
  },
  {
    id: 'pp-h4',
    name: 'Hostel 4 Express Window',
    locationDetails: 'Block A, East Wing Entrance',
    isOpen: true,
  },
  {
    id: 'pp-h16',
    name: 'Hostel 16 Pickup Booth',
    locationDetails: 'Main Quadrangle, Booth #2',
    isOpen: true,
  },
  {
    id: 'pp-lib',
    name: 'Library Circle Kiosk',
    locationDetails: 'Near Central Library Lawn',
    isOpen: true,
  },
];

interface CartState {
  items: CartItem[];
  selectedPickupPoint: string;
  
  // Actions
  addItem: (
    menuItem: MenuItem,
    quantity: number,
    selectedCombos: SelectedCombo[],
    selectedAddOns: SelectedAddOn[]
  ) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  removeItem: (cartItemId: string) => void;
  clearCart: () => void;
  setPickupPoint: (pickupPointName: string) => void;
  getSubtotal: () => number;
  getItemCount: () => number;
  reconcileWithInventory: () => { hasChanges: boolean; warnings: string[] };
}

const CART_STORAGE_KEY = 'replate_cart_v1';

const loadSavedCart = (): CartItem[] => {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error('Failed to load cart', e);
  }
  return [];
};

export const useCartStore = create<CartState>((set, get) => {
  const initialItems = loadSavedCart();

  const persist = (items: CartItem[]) => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to persist cart', e);
    }
  };

  return {
    items: initialItems,
    selectedPickupPoint: CAMPUS_PICKUP_POINTS[0].name,

    addItem: (menuItem, quantity, selectedCombos, selectedAddOns) => {
      // Calculate unit price: base + sum of combos + sum of addons
      const combosCost = selectedCombos.reduce((acc, c) => acc + c.price, 0);
      const addOnsCost = selectedAddOns.reduce((acc, a) => acc + a.price, 0);
      const unitPrice = menuItem.price + combosCost + addOnsCost;

      // Unique hash for customized variant
      const comboKey = selectedCombos
        .map((c) => `${c.comboId}:${c.selectedOptionIds.sort().join(',')}`)
        .sort()
        .join('|');
      const addOnKey = selectedAddOns.map((a) => a.id).sort().join(',');
      const cartItemId = `${menuItem.id}__${comboKey}__${addOnKey}`;

      const existingIndex = get().items.findIndex((item) => item.cartItemId === cartItemId);
      let updated: CartItem[];

      if (existingIndex > -1) {
        // Increment quantity up to available stock
        const existing = get().items[existingIndex];
        const newQty = Math.min(existing.quantity + quantity, menuItem.availablePortions);
        updated = [...get().items];
        updated[existingIndex] = {
          ...existing,
          quantity: newQty,
        };
      } else {
        const newItem: CartItem = {
          cartItemId,
          menuItemId: menuItem.id,
          name: menuItem.name,
          servingSize: menuItem.servingSize,
          basePrice: menuItem.price,
          unitPrice,
          quantity: Math.min(quantity, menuItem.availablePortions),
          image: menuItem.image,
          originHostel: menuItem.originHostel,
          selectedCombos,
          selectedAddOns,
        };
        updated = [...get().items, newItem];
      }

      set({ items: updated });
      persist(updated);
    },

    updateQuantity: (cartItemId: string, quantity: number) => {
      if (quantity <= 0) {
        get().removeItem(cartItemId);
        return;
      }

      // Check current available portions from menu store
      const item = get().items.find((i) => i.cartItemId === cartItemId);
      if (!item) return;

      const menuItem = useMenuStore.getState().getItemById(item.menuItemId);
      const maxAvailable = menuItem ? menuItem.availablePortions : item.quantity;
      const safeQty = Math.min(quantity, maxAvailable);

      const updated = get().items.map((i) =>
        i.cartItemId === cartItemId ? { ...i, quantity: safeQty } : i
      );
      set({ items: updated });
      persist(updated);
    },

    removeItem: (cartItemId: string) => {
      const updated = get().items.filter((i) => i.cartItemId !== cartItemId);
      set({ items: updated });
      persist(updated);
    },

    clearCart: () => {
      set({ items: [] });
      persist([]);
    },

    setPickupPoint: (pickupPointName: string) => {
      set({ selectedPickupPoint: pickupPointName });
    },

    getSubtotal: () => {
      return get().items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    },

    getItemCount: () => {
      return get().items.reduce((sum, item) => sum + item.quantity, 0);
    },

    reconcileWithInventory: () => {
      const menuItems = useMenuStore.getState().items;
      const warnings: string[] = [];
      let hasChanges = false;

      const adjustedItems: CartItem[] = [];

      for (const cartItem of get().items) {
        const menuItem = menuItems.find((m) => m.id === cartItem.menuItemId);

        if (!menuItem || !menuItem.isAvailable || menuItem.availablePortions === 0) {
          hasChanges = true;
          warnings.push(`"${cartItem.name}" was removed because it sold out.`);
          continue;
        }

        if (cartItem.quantity > menuItem.availablePortions) {
          hasChanges = true;
          warnings.push(
            `Quantity for "${cartItem.name}" adjusted to ${menuItem.availablePortions} based on live stock.`
          );
          adjustedItems.push({
            ...cartItem,
            quantity: menuItem.availablePortions,
          });
        } else {
          adjustedItems.push(cartItem);
        }
      }

      if (hasChanges) {
        set({ items: adjustedItems });
        persist(adjustedItems);
      }

      return { hasChanges, warnings };
    },
  };
});
