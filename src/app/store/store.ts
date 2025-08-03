import { create } from 'zustand'

type CartItem = {
  id: string;
  image: string;
  name: string;
  price: number;
  quantity: number;
  option?: string; // e.g. "Small", "Medium", etc.
}

type CartState = {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (item: CartItem) => void;
  getTotalQuantity: () => number;
  getTotalPrice: () => number;
  getTitle: () => string;
}

export const useCartStore = create<CartState>((set, get) => ({
  cart: [],
  clearCart: () => set({ cart: [] }),
  addToCart: (newItem) => {
    const cart = get().cart;
      set({ cart: [...cart, newItem] });
  },
  getTotalQuantity: () => 
    get().cart.reduce((acc, item) => acc + item.quantity, 0),
  getTotalPrice: () => 
    get().cart.reduce((acc, item) => acc + item.price * item.quantity, 0),
  getTitle:() => 
    get().cart.map((item) => item.name).join(', '),

  
  removeFromCart: (Item) => {
    const cart = get().cart;
    const existingItem = cart.find((item) =>
      item.id === Item.id && item.option === Item.option
    );

    if (existingItem) {
      const updatedCart = cart.map((item) =>
        item.id === Item.id && item.option === Item.option && item.quantity > 0
          ? { ...item, quantity: item.quantity - Item.quantity }
          : item
      ).filter(item => item.quantity > 0); // Remove items with quantity 0
      set({ cart: updatedCart });
    } 
  },
}));
