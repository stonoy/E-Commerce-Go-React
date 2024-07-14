import React from 'react'
import CartItem from '../components/CartItem';
import { redirect, useLoaderData } from 'react-router-dom';
import { CartDetails } from '../components';
import { useSelector } from 'react-redux';
import { customFetch } from '../utils';
import { toast } from 'react-toastify';

export const loader = (store) => async() => {
  // No use in this project
  // if user logged in fetch cart data from backend

  
  const userToken = store.getState().user.token
  if (userToken){
    // fetch cart
    try {
      const resp = await customFetch("/cart", {
        headers : {
          "Authorization": `Bearer ${userToken}`
        }
      })
      return resp?.data
    } catch (error) {
      const errorMsg = error?.response?.data?.msg || 'Error in getting products in cart'

    toast.error(errorMsg)

    // if user token is not valid redirect to login page
    if (error?.response?.status === 401 || error?.response?.status === 403 ){
    
      return redirect('/login');
    }

      return null
    }
  }

  return null
}

export const action = (store) => async() => {
  const userToken = store.getState().user.token
  try {
    await customFetch.delete("/deletecart", {
      headers : {
        'Authorization' : `Bearer ${userToken}`
      }
    })
    
  } catch (error) {
    const errorMsg = error?.response?.data?.msg || 'Error in deleting cart'

    toast.error(errorMsg)

    // if user token is not valid redirect to login page
    if (error?.response?.status === 401 || error?.response?.status === 403 ){
    
      return redirect('/login');
    }
  }
  return null
}

const Cart = () => {
  const cartApi = useLoaderData()
  const cartLocal = useSelector(state => state.cart)

  const {cartItems, numItemsInCart, chargeTotal, orderTotal, shipping, tax} = cartApi || cartLocal

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md flex flex-col md:flex-row">
        {/* Cart Items */}
        <div className="w-full md:w-2/3">
          <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Shopping Cart</h2>
            {cartItems.length === 0 ? (
              <p className="text-gray-600">Your cart is empty.</p>
            ) : (
              <div>
                {/* Cart items */}
                {cartItems.map(item => (
                  <CartItem key={item.id} {...item} />
                ))}
                {/* Total
                <div className="mt-6">
                  <p className="text-lg font-semibold">Total:</p>
                  <p className="text-xl">${cartItems.reduce((total, item) => total + item.price * item.quantity, 0)}</p>
                </div> */}
              </div>
            )}
          </div>
        </div>

        {/* Cart Details */}
        <div className="w-full md:w-1/3 md:pl-4 mt-4 md:mt-0">
            <CartDetails details={{chargeTotal, numItemsInCart, orderTotal, shipping, tax}} />
            </div>
      </div>
    </div>
  );
}

export default Cart