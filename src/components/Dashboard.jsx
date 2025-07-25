// src/components/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { getOrderHistory } from '../api';
import OrderTable from './OrderTable';
import LoadingSpinner from './LoadingSpinner';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { useAuth } from '../hooks/useAuth';

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // --- Dropdown Options ---
  const rakeOptions = ['Rake 1', 'Rake 2', 'Rake 3', 'Rake 4'];
  const locationToOptions = ['Godown'];

  // --- State Initialization with Default Values ---
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [locationFrom, setLocationFrom] = useState(rakeOptions[0]); // Default to 'Rake 1'
  const [locationTo, setLocationTo] = useState(locationToOptions[0]); // Default to 'Godown'

  const { logout } = useAuth();

  const fetchOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getOrderHistory(startDate, endDate, locationFrom, locationTo);
      if (data.statusCode === "200" && data.message === "Success") {
        setOrders(data.data);
      } else {
        setError(data.message || 'Failed to fetch orders.');
        setOrders([]);
      }
    } catch (err) {
      setError(err.message || 'An error occurred while fetching orders.');
      setOrders([]);
      // Removed the specific 'token' or 'authenticated' check.
      // If a network error occurs due to an expired/invalid session cookie,
      // the subsequent protected route navigation attempt or any backend check
      // would eventually lead to a redirect if the session is truly gone.
      // Or, you could check for specific HTTP status codes (e.g., 401 Unauthorized)
      // from the API response error if your backend sends them consistently.
      // For now, if any error fetching orders occurs, we just display the error.
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch orders whenever filters (including dropdowns) change
    fetchOrders();
  }, [startDate, endDate, locationFrom, locationTo]);

  const handleDownloadExcel = () => {
    if (orders.length === 0) {
      // Replaced alert() with a console log and more user-friendly UI feedback
      console.warn('No data to download.');
      setError('No data available to download. Please fetch some orders first.');
      return;
    }

    const dataToExport = orders.map(order => ({
      'Order ID': order.id,
      'Order Date': new Date(order.orderDate).toLocaleString(),
      'Truck ID': order.truckId,
      'Truck Name': order.truckName,
      'Driver Name': order.driverName,
      'Driver Number': order.driverNumber,
      'Location From': order.locationFrom,
      'Location To': order.locationTo,
      'Remarks': order.remarks,
      // Format products into a single string for the Excel cell
      'Products': order.products.map(p => `${p.quantity} ${p.unit} ${p.subCategory} (${p.category})`).join(', ')
    }));

    // Use xlsx and file-saver to create and download the Excel file
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Order History');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(data, 'order_history.xlsx');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 font-inter"> {/* Added font-inter for consistency */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard - Order History</h1>
        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-200 ease-in-out transform hover:scale-105"
        >
          Logout
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Filter Orders</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Start Date Filter */}
          <div>
            <label htmlFor="startDate" className="block text-gray-700 text-sm font-bold mb-2">
              Start Date:
            </label>
            <input
              type="date"
              id="startDate"
              className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          {/* End Date Filter */}
          <div>
            <label htmlFor="endDate" className="block text-gray-700 text-sm font-bold mb-2">
              End Date:
            </label>
            <input
              type="date"
              id="endDate"
              className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          {/* Location From Dropdown */}
          <div>
            <label htmlFor="locationFrom" className="block text-gray-700 text-sm font-bold mb-2">
              Location From:
            </label>
            <select
              id="locationFrom"
              className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={locationFrom}
              onChange={(e) => setLocationFrom(e.target.value)}
            >
              {rakeOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          {/* Location To Dropdown */}
          <div>
            <label htmlFor="locationTo" className="block text-gray-700 text-sm font-bold mb-2">
              Location To:
            </label>
            <select
              id="locationTo"
              className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={locationTo}
              onChange={(e) => setLocationTo(e.target.value)}
            >
              {locationToOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>
        
      </div>

      {/* Error Message Display */}
      {error && <p className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4 text-center">{error}</p>}

      {/* Loading State or Order Table */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner />
          <p className="ml-2 text-gray-600">Loading orders...</p>
        </div>
      ) : (
        <>
          <div className="flex justify-end mb-4">
            <button
              onClick={handleDownloadExcel}
              className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-200 ease-in-out transform hover:scale-105"
            >
              Download as Excel
            </button>
          </div>
          <OrderTable orders={orders} />
        </>
      )}
    </div>
  );
};

export default Dashboard;
