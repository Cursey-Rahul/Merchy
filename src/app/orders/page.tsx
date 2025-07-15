import React from 'react'

const orderPage = () => {
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
            <td className="hidden md:block py-6 px-1">ORD-001</td>
            <td className='py-6 px-1'>2022-01-01</td>
            <td className="hidden md:block py-6 px-1">Product 1, Product 2, Product 3</td>
            <td className='py-6 px-1'>Pending</td>
          </tr>
          <tr className='text-sm md:text-base odd:bg-gray-100'>
            <td className="hidden md:block py-6 px-1">ORD-001</td>
            <td className='py-6 px-1'>2022-01-01</td>
            <td className="hidden md:block py-6 px-1">Product 1, Product 2, Product 3</td>
            <td className='py-6 px-1'>Pending</td>
          </tr>
          <tr className='text-sm md:text-base odd:bg-gray-100'>
            <td className="hidden md:block py-6 px-1">ORD-001</td>
            <td className='py-6 px-1'>2022-01-01</td>
            <td className="hidden md:block py-6 px-1">Product 1, Product 2, Product 3</td>
            <td className='py-6 px-1'>Pending</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default orderPage