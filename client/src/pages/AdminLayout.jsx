import React from 'react'
import { NavLink, Outlet, redirect, useLoaderData } from 'react-router-dom';
import { toast } from 'react-toastify';
import { customFetch } from '../utils';

export const loader = (store) => async() => {
  const userToken = store.getState().user.token
  try {
    // check the user is admin
   const resp = await customFetch("/checkadmin", {
      headers : {
        'Authorization' : `Bearer ${userToken}`
      }
    })
    return resp?.data.visits
  } catch (error) {

    const errorMsg = error?.response?.data?.msg || 'Only for admin'

    toast.error(errorMsg)
    
    // if user token is not valid redirect to login page
    if (error?.response?.status === 401 || error?.response?.status === 403 ){
    
      return redirect('/login');
    }
    return null
  }

  
}

const AdminLayout = () => {
  const visits = useLoaderData()
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Admin</h1>
        <h3 className="text-lg text-slate-500 font-semibold mx-2">Visits: {visits}</h3>
        <div className="flex space-x-4">
          <NavLink to="/admin/orders" className="text-blue-500 hover:text-blue-700">
            Orders
          </NavLink>
          <NavLink to="/admin/insights" className="text-blue-500 hover:text-blue-700">
            Insights
          </NavLink>
        </div>
      </div>
      <Outlet /> {/* The Outlet renders child components */}
    </div>
  );
}

export default AdminLayout