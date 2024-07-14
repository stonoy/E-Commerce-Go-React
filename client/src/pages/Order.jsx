import React from 'react'
import { customFetch, formatDate } from '../utils';
import { redirect, useLoaderData } from 'react-router-dom';
import { OrderList, Pagination } from '../components';
import { toast } from 'react-toastify';

export const loader = (store) => async ({request}) => {
  let queryUrl = `/orders`
    // add page in query url
    const {page} = Object.fromEntries([
      ...new URL(request.url).searchParams.entries(),
    ]);

    // console.log(params)

    queryUrl += `?page=${page || 1}`
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
      const errorMsg = error?.response?.data?.msg || 'Error in getting orders'

      toast.error(errorMsg)

    // if user token is not valid redirect to login page
    if (error?.response?.status === 401 || error?.response?.status === 403 ){
    
      return redirect('/login');
    }

    return null
    }
}

const Order = () => {
    const {orders, numOfPages, page} = useLoaderData()
    // console.log(orders, numOfPages, page)
    return (
      <>
       <OrderList orders={orders} />
      {/*  Pagination */}
      {orders.length > 0 && <Pagination numOfPages={numOfPages} page={page} />}
      </>
    );
}

export default Order