import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Form, Link, useNavigation } from 'react-router-dom'
import { clearCart } from '../features/cart/cartSlice'
import { FaSpinner } from 'react-icons/fa'


const CartDetails = ({details:{chargeTotal, numItemsInCart, orderTotal, shipping, tax}}) => {
  const dispatch = useDispatch()
  const userToken = useSelector(state => state.user.token)
  const navigation = useNavigation()
  const isLoading = navigation.state == "submitting"


  return (
    <>
          <div className="bg-gray-100 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Cart Details</h2>
            {/* Add your cart details here */}
            <div className="mb-4">
              <p className="text-lg font-semibold">Cart Total:</p>
              {orderTotal}
            </div>
            <div className="mb-4">
              <p className="text-lg font-semibold">Shipping:</p>
              {shipping}
            </div>
            <div className="mb-4">
              <p className="text-lg font-semibold">Tax:</p>
              {tax.toFixed(2)}
            </div>
            <div>
              <p className="text-lg font-semibold">Total Price:</p>
              {chargeTotal}
            </div>
            {/* Checkout Button */}
            {/* When No Item in cart do not show checkout button */}
            {/* If user not present, let them login first */}
       {numItemsInCart > 0 && <Link to={userToken ? "/checkout" : "/login"} className="bg-blue-500 inline-block hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mt-4">
       {userToken ? "checkout" : "login"}
        </Link>}
        {
          // Check User to clear cart
          userToken ? 
          <Form method='delete'>
            <button disabled={numItemsInCart == 0 || isLoading}  className="bg-red-400  hover:bg-red-500 text-white font-bold py-2 px-4 rounded mt-4">
          {/* Loading spinner */}
        {isLoading && (
          <FaSpinner className="animate-spin mr-1 inline-block" /> // Add animate-spin class for animation
        )}
        {/* Button text */}
          Clear Cart
        </button>
          </Form>
          :
          <button disabled={numItemsInCart == 0} onClick={() => dispatch(clearCart())} className="bg-red-400  hover:bg-red-500 text-white font-bold py-2 px-4 rounded mt-4">
          Clear Cart
        </button>
        }
          </div>
        </>
  )
}

export default CartDetails