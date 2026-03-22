import { useState, useEffect, useCallback } from 'react';
import { CartItem } from '@/types/types';

export const useCartCount = () => {
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchCartCount = useCallback(async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://merchy-blond.vercel.app'
      const response = await fetch(`${baseUrl}/api/cartitems`);
      
      if (response.ok) {
        const items: CartItem[] = await response.json();
        const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
        setCartCount(totalQuantity);
      }
    } catch (error) {
      console.error('Error fetching cart count:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCartCount();
    window.addEventListener('cart-updated', fetchCartCount);
    return () => window.removeEventListener('cart-updated', fetchCartCount);
  }, [fetchCartCount]);

  return { cartCount, loading, refetch: fetchCartCount };
};