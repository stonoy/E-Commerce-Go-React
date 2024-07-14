import React, { useState } from 'react'
import { redirect, useLoaderData, useLocation, useNavigate } from 'react-router-dom';
import { OrderList, Pagination, TimeFilter } from '../components';
import { customFetch } from '../utils';
import { toast } from 'react-toastify';

export const loader = (store) => async ({request}) => {
  let queryUrl = `/adminallorders`
    // add query params
    const {page, time} = Object.fromEntries([
      ...new URL(request.url).searchParams.entries(),
    ]);

    // add the page in queryUrl
    queryUrl += `?page=${page || 1}`

    // check time is selected or not, if yes add it to queryurl
    if (time) {
      queryUrl += `&time=${time}`
    }

    // get the user token
    const userToken = store.getState().user.token

    try {
        const resp = await customFetch(queryUrl, {
            headers: {
                'Authorization': `Bearer ${userToken}`
              }
        })
        // console.log(resp.data)
        return resp?.data
    } catch (error) {
      const errorMsg = error?.response?.data?.msg || 'Error in getting all orders'

      toast.error(errorMsg)

    // if user token is not valid redirect to login page
    if (error?.response?.status === 401 || error?.response?.status === 403 ){
    
      return redirect('/login');
    }

    return null
    }
}

const AdminOrder = () => {
  const {orders,numOfPages, page, time} = useLoaderData()
  const [timeFilter, setTimeFilter] = useState(time || "All")
  const {pathname, search} = useLocation()
  const navigate = useNavigate()

  // console.log(numOfPages, page)

  const myTimeFilters = ["All", "today", "this_week", "this_month", "this_year"]

  const handleFilterChange = (e) => {
    // console.log(e.target.value)

    const filterValue = e.target.value

    let searchParams = new URLSearchParams(search)
    searchParams.set("time", filterValue)
    // set page to 1 when the filter applied
    searchParams.set("page", 1) 
    navigate(`${pathname}?${searchParams}`)

  }

  return (
    <div className="container flex flex-col p-2 md:p-4">
      {/* time filter */}
      <TimeFilter timeFilter={timeFilter} myTimeFilters={myTimeFilters} handleFilterChange={handleFilterChange}/>

      {/* order list */}
      <OrderList orders={orders} />

      {/*  Pagination */}
      {orders.length > 0 && <Pagination numOfPages={numOfPages} page={page} />}
      </div>
  )
}

export default AdminOrder