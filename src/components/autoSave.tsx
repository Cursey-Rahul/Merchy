"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useCartStore } from "@/app/store/store";

export default function AutoSaveCart() {
  const cart = useCartStore((state) => state.cart); // Zustand cart
  const { data: session } = useSession();   // Auth session

  useEffect(() => {
    const saveCartToDB = async () => {
      if (!session?.user?.email || cart.length === 0) return;

      try {
        const res = await fetch("/api/save-cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userEmail: session.user.email,
            cart,
          }),
        });

        if (!res.ok) {
          throw new Error("Failed to save cart");
        }

        const result = await res.json();
        console.log("✅ Cart saved on render:", result);
      } catch (error) {
        console.error("❌ Error saving cart:", error);
      }
    };


      saveCartToDB();
  }, [cart, session]); // Runs again if cart or session changes

  return null; // no UI needed
}
