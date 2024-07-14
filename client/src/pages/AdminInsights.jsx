import React from 'react';
import { redirect, useActionData, useLoaderData } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { customFetch } from '../utils';
import { toast } from 'react-toastify';

// Colors for the pie chart segments
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF4444', '#AA00FF'];

export const loader = (store) => async() => {
  const userToken = store.getState().user.token
  try {
    const resp = await customFetch("/adminspecial", {
      headers: {
          'Authorization': `Bearer ${userToken}`
        }
  })
  // console.log(resp?.data)
  return resp?.data
  } catch (error) {
    const errorMsg = error?.response?.data?.msg || 'Error in dmin insights'

    toast.error(errorMsg)

    // if user token is not valid redirect to login page
    if (error?.response?.status === 401 || error?.response?.status === 403 ){
    
      return redirect('/login');
    }

    return null
  }
}

const AdminInsights = () => {
  const { product_visits, count_by_cart, count_by_order } = useLoaderData();

 // Data for product visits
 const visitsData = product_visits.map((item) => ({
  name: item.product_name,
  visits: item.visits,
}));

// Data for pie chart (product orders)
const orderData = count_by_order.map((item) => ({
  name: item.product_name,
  value: item.total_quantity,
}));

// Data for bar chart (products in carts)
const cartData = count_by_cart.map((item) => ({
  name: item.product_name,
  quantity: item.total_quantity,
}));

return (
  <div className="container mx-auto p-2 md:p-6">
    <h2 className="text-2xl font-semibold mb-6">Insights</h2>

    {/* Product Visits - Bar Chart */}
    <div className="mb-6">
      <h3 className="text-xl font-semibold mb-4">Product Visits</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={visitsData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="visits" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>

    {/* Product Orders - Pie Chart with Legend */}
    <div className="mb-6">
      <h3 className="text-xl font-semibold mb-4">Product Orders by Quantity</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={orderData}
            dataKey="value"
            nameKey="name"
            outerRadius="80%"
            label
          >
            {orderData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend verticalAlign="bottom" height={36} /> {/* Legend added */}
        </PieChart>
      </ResponsiveContainer>
    </div>

    {/* Products in Carts - Bar Chart */}
    <div>
      <h3 className="text-xl font-semibold mb-4">Products in Carts</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={cartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="quantity" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);
};

export default AdminInsights;
