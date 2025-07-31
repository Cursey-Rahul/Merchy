import { getSession } from '@/lib/auth';
import { Order } from '@/types/types';
import React from 'react'


const GETDATA= async() => {
  const response = await fetch(`http://localhost:3000/api/order`);
  return response.json();
}

const orderPage = async() => {
  // Fetching orders from the API
  const session = await getSession();
  if (!session) {
    return <div className='p-4'>You need to be logged in to view your orders.</div>;
  }
  const user = session.user?.email;
  const Orders : Order[] = await GETDATA();
  // Filter orders by user email if necessary
  let userOrders;
  if (user=== process.env.isAdmin) {
    userOrders = Orders; // If the user is an admin, show all orders
  } else {
  userOrders = Orders.filter((order) => order.userEmail === user);}
  if (userOrders.length === 0) {
    return (
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
            <td className="hidden md:block py-6 px-1">No orders found</td>
            <td className='py-6 px-1'>N/A</td>
            <td className="hidden md:block py-6 px-1">N/A</td>
            <td className='py-6 px-1'>N/A</td>
          </tr>
        </tbody>
      </table>
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
        {userOrders.map((order) => (
          <tbody key={order.id}>
          <tr  className='text-sm md:text-base bg-red-50'>
            <td className="hidden md:block py-6 px-1">{order.id}</td>
            <td className='py-6 px-1'> {new Date(order.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              })}</td>
            <td className="hidden md:block py-6 px-1">{JSON.stringify(order.products)}</td>
            <td className='py-6 px-1'>{order.status}</td>
          </tr>
        </tbody>
        ))}
      </table>
    </div>
  )
}

export default orderPage