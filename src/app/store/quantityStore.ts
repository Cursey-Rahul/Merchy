import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type QuantityState = {
  quantity: number;
  setQuantity: (value: number) => void;
  increment: () => void;
  decrement: () => void;
  fixQuantity: (value: number) => void;
};

export const useQuantityStore = create(persist<QuantityState>(
    (set) => ({
      quantity: 0,
      fixQuantity: (value) => set({ quantity: Math.max(0, value) }), // Prevent negative
      setQuantity: (value) => set({ quantity: value }), // SET the value, not add
      increment: () => set((state) => ({ quantity: state.quantity + 1 })),
      decrement: () =>
        set((state) => ({
          quantity: Math.max(0, state.quantity - 1),
        })),
    }),
    {
      name: 'quantity-storage',
    }
  )
);