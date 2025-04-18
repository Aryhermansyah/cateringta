import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { menuItems } from '@/mocks/menu';

export interface CartItem {
  id: number;
  menuItemId: number;
  name: string;
  price: string;
  priceValue: number;
  quantity: number;
  image: string;
  notes?: string;
}

export interface DeliveryInfo {
  address: string;
  addressDetail?: string;
  latitude?: number;
  longitude?: number;
  contactName: string;
  contactPhone: string;
  deliveryTime: string;
  paymentMethod: string;
}

export interface OrderStatus {
  id: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'delivering' | 'delivered' | 'cancelled';
  estimatedDeliveryTime?: string;
  driverName?: string;
  driverPhone?: string;
  driverPhoto?: string;
  createdAt: string;
  items: CartItem[];
  deliveryInfo: DeliveryInfo;
  totalAmount: number;
}

interface CartState {
  items: CartItem[];
  deliveryInfo: DeliveryInfo | null;
  activeOrder: OrderStatus | null;
  pastOrders: OrderStatus[];
  addItem: (menuItemId: number, quantity?: number, notes?: string) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  updateNotes: (id: number, notes: string) => void;
  clearCart: () => void;
  setDeliveryInfo: (info: DeliveryInfo) => void;
  placeOrder: () => void;
  updateOrderStatus: (orderId: string, status: OrderStatus['status']) => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

// Helper to convert price string to number
const priceToNumber = (price: string): number => {
  // Extract numbers from strings like "Rp15.000" or "Rp 15.000"
  const match = price.match(/\d+(\.\d+)?/);
  if (match) {
    return parseFloat(match[0].replace('.', ''));
  }
  return 0;
};

// Find menu item by ID
const findMenuItem = (id: number) => {
  return menuItems.find(item => item.id === id);
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      deliveryInfo: null,
      activeOrder: null,
      pastOrders: [],

      addItem: (menuItemId, quantity = 1, notes = '') => {
        const menuItem = findMenuItem(menuItemId);
        if (!menuItem) return;

        const items = get().items;
        const existingItemIndex = items.findIndex(item => item.menuItemId === menuItemId);

        if (existingItemIndex >= 0) {
          // Update existing item
          const updatedItems = [...items];
          updatedItems[existingItemIndex].quantity += quantity;
          set({ items: updatedItems });
        } else {
          // Add new item
          const price = menuItem.isPromo ? menuItem.promoPrice || menuItem.price : menuItem.price;
          const newItem: CartItem = {
            id: Date.now(),
            menuItemId,
            name: menuItem.name,
            price,
            priceValue: priceToNumber(price),
            quantity,
            image: menuItem.image,
            notes,
          };
          set({ items: [...items, newItem] });
        }
      },

      removeItem: (id) => {
        set({ items: get().items.filter(item => item.id !== id) });
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }

        set({
          items: get().items.map(item => 
            item.id === id ? { ...item, quantity } : item
          )
        });
      },

      updateNotes: (id, notes) => {
        set({
          items: get().items.map(item => 
            item.id === id ? { ...item, notes } : item
          )
        });
      },

      clearCart: () => {
        set({ items: [] });
      },

      setDeliveryInfo: (info) => {
        set({ deliveryInfo: info });
      },

      placeOrder: () => {
        const { items, deliveryInfo } = get();
        if (items.length === 0 || !deliveryInfo) return;

        const totalAmount = get().getTotalPrice();
        
        const newOrder: OrderStatus = {
          id: `ORD-${Date.now()}`,
          status: 'confirmed',
          estimatedDeliveryTime: '30-45 menit',
          driverName: 'Budi Santoso',
          driverPhone: '+6281234567890',
          driverPhoto: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
          createdAt: new Date().toISOString(),
          items: [...items],
          deliveryInfo: { ...deliveryInfo },
          totalAmount,
        };

        set({ 
          activeOrder: newOrder,
          items: [],
        });

        // Simulate order status updates
        setTimeout(() => {
          get().updateOrderStatus(newOrder.id, 'preparing');
        }, 60000);

        setTimeout(() => {
          get().updateOrderStatus(newOrder.id, 'delivering');
        }, 120000);
      },

      updateOrderStatus: (orderId, status) => {
        const { activeOrder, pastOrders } = get();
        
        if (activeOrder && activeOrder.id === orderId) {
          const updatedOrder = { ...activeOrder, status };
          
          if (status === 'delivered' || status === 'cancelled') {
            // Move to past orders
            set({ 
              activeOrder: null,
              pastOrders: [updatedOrder, ...pastOrders]
            });
          } else {
            // Update active order
            set({ activeOrder: updatedOrder });
          }
        }
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + (item.priceValue * item.quantity), 0);
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);