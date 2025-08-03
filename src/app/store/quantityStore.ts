import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type QuantityState = {
  quantity: number;
  setQuantity: (value: number) => void;
  increment: () => void;
  decrement: () => void;
};

export const useQuantityStore = create(persist<QuantityState>(
    (set) => ({
      quantity: 0, // default value
      setQuantity: (value) => set((state)=>({ quantity: state.quantity + value })),
      increment: () => set((state) => ({ quantity: state.quantity + 1 })),
      decrement: () =>
        set((state) => ({
          quantity: Math.max(0, state.quantity - 1), // minimum of 1
        })),
    
    }),
    {
      name: 'quantity-storage', // key in localStorage
    }
  )
);
