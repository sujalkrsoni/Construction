// src/components/OrderTable.jsx
import React from 'react';

const OrderTable = ({ orders }) => {
  if (!orders || orders.length === 0) {
    return <p className="text-center text-gray-600 mt-4">No orders found for the selected period.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 shadow-sm rounded-lg">
        <thead className="bg-gray-50">
          <tr>
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Date</th>
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Truck Details</th>
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver Info</th>
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Locations</th>
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Products</th>
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remarks</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {orders.map((order) => (
            <tr key={order.id} className="hover:bg-gray-50">
              <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-900">{order.id}</td>
              <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-900">
                {new Date(order.orderDate).toLocaleString()}
              </td>
              <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-900">
                {order.truckId} ({order.truckName})
              </td>
              <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-900">
                {order.driverName} ({order.driverNumber})
              </td>
              <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-900">
                {order.locationFrom} to {order.locationTo}
              </td>
              <td className="py-3 px-4 text-sm text-gray-900">
                {order.products.map((product, pIdx) => (
                  <div key={pIdx} className="mb-1">
                    {product.quantity} {product.unit} of {product.subCategory} ({product.category})
                  </div>
                ))}
              </td>
              <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-900">{order.remarks}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderTable;