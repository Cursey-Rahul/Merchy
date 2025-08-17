// app/admin/add-product/page.tsx
import AddProduct from "@/components/AddProduct";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AddProductPage() {
  const session = await getSession();
  if (session?.user?.email !== process.env.isAdmin) {
    redirect("/"); // not admin → send away
  }

  return <AddProduct/>
}
