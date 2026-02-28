import { getSession } from '@/lib/auth';
import { Order } from '@/types/types';
import React from 'react'
export const dynamic = 'force-dynamic';

const GETDATA = async () => {
     const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://merchy-blond.vercel.app'
  const response = await fetch(`${baseUrl}/api/order`);
  return response.json();
}

const OrderPage = async () => {
  const session = await getSession();
  
  if (!session) {
    return <div className='p-4'>You need to be logged in to view your orders.</div>;
  }

  const user = session.user?.email;
  const Orders: Order[] = await GETDATA();
  
  // Filter orders by user email
  const userOrders = user === process.env.NEXT_PUBLIC_ADMIN_EMAIL 
    ? Orders 
    : Orders.filter((order) => order.userEmail === user);

  if (userOrders.length === 0) {
    return (
      <div className='p-4 lg:px-20 xl:px-40'>
        <table className="w-full border-separate border-spacing-3">
          <thead className='text-left'>
            <tr>
              <th className="hidden md:block">Order ID</th>
              <th>Order Date</th>
              <th className="hidden md:block">Products</th>
              <th>Order Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className='text-sm md:text-base bg-red-50'>
              <td colSpan={4} className='py-6 px-1'>No orders found</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className='p-4 lg:px-20 xl:px-40'>
      <table className="w-full border-separate border-spacing-3">
        <thead className='text-left'>
          <tr>
            <th className="hidden md:block">Order ID</th>
            <th>Order Date</th>
            <th className="hidden md:block">Products</th>
            <th>Order Status</th>
          </tr>
        </thead>
        <tbody>
          {userOrders.map((order) => (
            <tr key={order.id} className='text-sm md:text-base bg-red-50'>
              <td className="hidden md:block py-6 px-1">{order.id}</td>
              <td className='py-6 px-1'>
                {new Date(order.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </td>
              <td className="hidden md:block py-6 px-1">{JSON.stringify(order.products)}</td>
              <td className='py-6 px-1'>{order.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default OrderPage