import { create } from 'zustand';
import { MenuItem } from '../types';

interface MenuState {
  items: MenuItem[];
  searchQuery: string;
  selectedCategory: string;
  showAvailableOnly: boolean;
  
  // Actions
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
  setShowAvailableOnly: (only: boolean) => void;
  getItemById: (id: string) => MenuItem | undefined;
  
  // Staff actions
  adjustPortions: (id: string, delta: number) => void;
  setPortions: (id: string, count: number) => void;
  toggleAvailability: (id: string) => void;
  addMenuItem: (item: Omit<MenuItem, 'id'>) => void;
  updateMenuItem: (id: string, updates: Partial<MenuItem>) => void;
  deleteMenuItem: (id: string) => void;
  resetToDefaultMenu: () => void;
}

const MENU_STORAGE_KEY = 'replate_menu_v1';

export const DEFAULT_MENU_ITEMS: MenuItem[] = [
  {
    id: 'item-1',
    name: 'Paneer Tikka',
    servingSize: '100g',
    originHostel: 'Hostel 4',
    description: 'Fresh cottage cheese cubes marinated in tandoori spices and char-grilled with capsicum & onions.',
    category: 'Starters',
    price: 80,
    availablePortions: 30,
    isAvailable: true,
    rating: 4.8,
    ratingCount: 22,
    image: '/assets/food/paneer_tikka.jpg',
    combos: [
      {
        id: 'combo-1',
        name: 'Combo 1',
        description: 'Includes 2 soft chapatis & 3 roasted papads',
        price: 35,
        options: [
          { id: 'opt-ch-2', name: 'chapati (2)', priceDelta: 0 },
          { id: 'opt-pap-3', name: 'papad (3)', priceDelta: 0 },
        ],
      },
      {
        id: 'combo-2',
        name: 'Combo 2',
        description: 'Includes aromatic rice bowl & homestyle dal',
        price: 45,
        options: [
          { id: 'opt-rice-100', name: 'Rice (100g)', priceDelta: 0 },
          { id: 'opt-dal-100', name: 'Dal (100g)', priceDelta: 0 },
        ],
      },
    ],
    addOns: [
      { id: 'add-chutney', name: 'Extra Mint Chutney', price: 10 },
      { id: 'add-onion', name: 'Spiced Laccha Onion', price: 10 },
    ],
  },
  {
    id: 'item-2',
    name: 'Soyabean Masala',
    servingSize: '150g',
    originHostel: 'Hostel 16',
    description: 'High-protein soya chunks simmered in a spiced onion-tomato homestyle gravy.',
    category: 'Main Course',
    price: 50,
    availablePortions: 45,
    isAvailable: true,
    rating: 4.6,
    ratingCount: 28,
    image: '/assets/food/soyabean_masala.jpg',
    combos: [
      {
        id: 'combo-soya-1',
        name: 'Combo 1',
        description: 'With 2 hot chapatis & crispy papad',
        price: 25,
        options: [
          { id: 'opt-soya-ch', name: 'chapati (2)', priceDelta: 0 },
          { id: 'opt-soya-papad', name: 'papad (1)', priceDelta: 0 },
        ],
      },
    ],
    addOns: [
      { id: 'add-extra-gravy', name: 'Extra Gravy portion', price: 15 },
    ],
  },
  {
    id: 'item-3',
    name: 'Manchurian',
    servingSize: '150g',
    originHostel: 'Hostel 8',
    description: 'Crispy minced vegetable balls tossed in rich garlic, ginger, and dark soya sauce.',
    category: 'Starters',
    price: 60,
    availablePortions: 40,
    isAvailable: true,
    rating: 4.7,
    ratingCount: 17,
    image: '/assets/food/manchurian.jpg',
    combos: [
      {
        id: 'combo-manch-rice',
        name: 'Combo Fried Rice',
        description: 'With portion of Fried Rice (120g)',
        price: 35,
        options: [
          { id: 'opt-fr-rice', name: 'Fried Rice (120g)', priceDelta: 0 },
        ],
      },
    ],
    addOns: [
      { id: 'add-schezwan', name: 'Extra Schezwan Dip', price: 10 },
    ],
  },
  {
    id: 'item-4',
    name: 'Dal Tadka',
    servingSize: '180ml',
    originHostel: 'Hostel 4',
    description: 'Comforting yellow lentils tempered with ghee, cumin, dried red chilies, and garlic.',
    category: 'Main Course',
    price: 35,
    availablePortions: 70,
    isAvailable: true,
    rating: 4.5,
    ratingCount: 34,
    image: '/assets/food/dal_tadka.jpg',
    addOns: [
      { id: 'add-ghee', name: 'Desi Ghee Tadka', price: 15 },
    ],
  },
  {
    id: 'item-5',
    name: 'Veg Dum Biryani',
    servingSize: '250g',
    originHostel: 'Hostel 12',
    description: 'Fragrant basmati rice layered with garden vegetables, saffron milk, and fried onions.',
    category: 'Main Course',
    price: 90,
    availablePortions: 25,
    isAvailable: true,
    rating: 4.9,
    ratingCount: 42,
    image: '/assets/food/biryani.jpg',
    addOns: [
      { id: 'add-raita', name: 'Chilled Boondi Raita', price: 20 },
      { id: 'add-salan', name: 'Mirchi Ka Salan', price: 15 },
    ],
  },
  {
    id: 'item-6',
    name: 'Fresh Chapati',
    servingSize: '2 pcs',
    originHostel: 'Hostel 4',
    description: 'Freshly puffed whole wheat rotis lightly brushed with pure butter.',
    category: 'Staples',
    price: 15,
    availablePortions: 120,
    isAvailable: true,
    rating: 4.6,
    ratingCount: 65,
    image: '/assets/food/chapati.jpg',
    addOns: [
      { id: 'add-butter', name: 'Extra White Butter', price: 8 },
    ],
  },
  {
    id: 'item-7',
    name: 'Steamed Rice',
    servingSize: '150g',
    originHostel: 'Hostel 4',
    description: 'Fluffy long-grain steamed white rice.',
    category: 'Staples',
    price: 20,
    availablePortions: 85,
    isAvailable: true,
    rating: 4.4,
    ratingCount: 19,
    image: '/assets/food/biryani.jpg',
  },
  {
    id: 'item-8',
    name: 'Roasted Papad',
    servingSize: '3 pcs',
    originHostel: 'Hostel 16',
    description: 'Crisp urad dal papad roasted over direct open flame with chaat masala.',
    category: 'Sides',
    price: 15,
    availablePortions: 100,
    isAvailable: true,
    rating: 4.5,
    ratingCount: 31,
    image: '/assets/food/paneer_tikka.jpg',
  },
];

const loadSavedMenu = (): MenuItem[] => {
  try {
    const raw = localStorage.getItem(MENU_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to load menu from localStorage', e);
  }
  return DEFAULT_MENU_ITEMS;
};

export const useMenuStore = create<MenuState>((set, get) => {
  const initialItems = loadSavedMenu();

  const persist = (items: MenuItem[]) => {
    try {
      localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to persist menu items', e);
    }
  };

  return {
    items: initialItems,
    searchQuery: '',
    selectedCategory: 'All',
    showAvailableOnly: false,

    setSearchQuery: (query: string) => set({ searchQuery: query }),
    setSelectedCategory: (category: string) => set({ selectedCategory: category }),
    setShowAvailableOnly: (only: boolean) => set({ showAvailableOnly: only }),

    getItemById: (id: string) => {
      return get().items.find((item) => item.id === id);
    },

    adjustPortions: (id: string, delta: number) => {
      const updated = get().items.map((item) => {
        if (item.id === id) {
          const next = Math.max(0, item.availablePortions + delta);
          return {
            ...item,
            availablePortions: next,
            isAvailable: next > 0 ? item.isAvailable : false,
          };
        }
        return item;
      });
      set({ items: updated });
      persist(updated);
    },

    setPortions: (id: string, count: number) => {
      const updated = get().items.map((item) => {
        if (item.id === id) {
          const next = Math.max(0, count);
          return {
            ...item,
            availablePortions: next,
            isAvailable: next > 0,
          };
        }
        return item;
      });
      set({ items: updated });
      persist(updated);
    },

    toggleAvailability: (id: string) => {
      const updated = get().items.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            isAvailable: !item.isAvailable,
          };
        }
        return item;
      });
      set({ items: updated });
      persist(updated);
    },

    addMenuItem: (itemData) => {
      const newItem: MenuItem = {
        ...itemData,
        id: `item-${Date.now()}`,
        rating: 5.0,
        ratingCount: 1,
      };
      const updated = [newItem, ...get().items];
      set({ items: updated });
      persist(updated);
    },

    updateMenuItem: (id: string, updates: Partial<MenuItem>) => {
      const updated = get().items.map((item) => {
        if (item.id === id) {
          return { ...item, ...updates };
        }
        return item;
      });
      set({ items: updated });
      persist(updated);
    },

    deleteMenuItem: (id: string) => {
      const updated = get().items.filter((item) => item.id !== id);
      set({ items: updated });
      persist(updated);
    },

    resetToDefaultMenu: () => {
      set({ items: DEFAULT_MENU_ITEMS });
      persist(DEFAULT_MENU_ITEMS);
    },
  };
});
