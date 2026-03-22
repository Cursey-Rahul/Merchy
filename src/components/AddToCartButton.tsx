"use client"
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

const AddToCartButton = ({ productId, price, title, img }: { productId: string; price: string; title: string; img: string }) => {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async () => {
    if (!session?.user?.email) {
      router.push('/login');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/save-cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          title,
          img,
          price: Number(price),
          quantity: 1,
          options: undefined,
        }),
      });

      if (res.ok) {
        console.log("✅ Product added to cart");
        router.refresh();
      } else {
        alert("Failed to add to cart");
      }
    } catch (error) {
      console.error("❌ Error adding to cart:", error);
      alert("Error adding to cart");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={(e) => {
        e.preventDefault();
        handleAddToCart();
      }}
      disabled={loading}
      className='bg-red-500 text-white p-2 rounded-lg text-base uppercase hover:bg-red-600 active:bg-red-700 disabled:opacity-50 transition-all duration-300'
    >
      {loading ? 'Adding...' : 'Add to cart'}
    </button>
  );
};

export default AddToCartButton;