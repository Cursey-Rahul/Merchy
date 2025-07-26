import { create } from 'zustand'
export interface CartItem {
  id: string;
  name: string;
  image?: string; // Optional image URL
  price: number;
  quantity: number;
}
interface StoreState {
  cart: CartItem[];
  addToCart: (product: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
}

const useStore = create<StoreState>((set) => ({
  cart: [],

  // Action to add a product to the cart or update its quantity if it already exists.
  addToCart: (product) =>
    set((state) => {
      const existingItem = state.cart.find((item) => item.id === product.id);
      if (existingItem) {
        // If item exists, just increment the quantity
        return {
          cart: state.cart.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          ),
        };
      }
      // Otherwise, add the new product with a quantity of 1
      return { cart: [...state.cart, { ...product, quantity: 1 }] };
    }),

  // Action to remove an item from the cart
  removeFromCart: (productId) =>
    set((state) => ({
      cart: state.cart.filter((item) => item.id !== productId),
    })),

  // Action to clear the entire cart
  clearCart: () => set({ cart: [] }),
}));

export default useStore;

