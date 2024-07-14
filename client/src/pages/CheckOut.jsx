import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { clearCart } from '../features/cart/cartSlice'
import { Form, Link, redirect, useNavigation } from 'react-router-dom'
import { customFetch } from '../utils'
import { toast } from 'react-toastify'
import { FaSpinner } from 'react-icons/fa'

export const action = (store) => async ({request}) => {
  const formData = await request.formData()
  const data = Object.fromEntries(formData)
  // console.log(data)
  // const cart = store.getState().cart
  const userToken = store.getState().user.token
  

  try {
    // sent cart data to server
     await customFetch.post("/createorder", {...data, pin: Number(data.pin)}, {
        headers: {
          'Authorization': `Bearer ${userToken}`
        }
      })
    // delete cart data from local
    // store.dispatch(clearCart())

    // redirect to order page(protected)
    toast.success("order created successfully")
    return redirect('/order')
  } catch (error) {
    const errorMsg = error?.response?.data?.msg || 'Error in creating order'

    toast.error(errorMsg)

    // if user token is not valid redirect to login page
    if (error?.response?.status === (401 || 403)){
    
      return redirect('/login');
    }

    return null
  }


  
}

const CheckOut = () => {
   const userToken = useSelector(state => state.user.token)
   const navigation = useNavigation()
  const isLoading = navigation.state == "submitting"

  return (
    (
        <div className="container mx-auto p-4">
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-md">
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Enter Your Address</h2>
              <Form method='post'>
                <div className="mb-4">
                  <label htmlFor="name" className="block text-gray-700 font-semibold mb-2">Name:</label>
                  <input type="text" id="name" name="name"    className="border border-gray-300 rounded-lg px-3 py-2 w-full" required />
                </div>
                <div className="mb-4">
                  <label htmlFor="location" className="block text-gray-700 font-semibold mb-2">Location:</label>
                  <input type="text" id="location" name="location"    className="border border-gray-300 rounded-lg px-3 py-2 w-full" required />
                </div>
                <div className="mb-4">
                  <label htmlFor="landmark" className="block text-gray-700 font-semibold mb-2">Landmark:</label>
                  <input type="text" id="landmark" name="landmark"    className="border border-gray-300 rounded-lg px-3 py-2 w-full" />
                </div>
                <div className="mb-4">
                  <label htmlFor="city" className="block text-gray-700 font-semibold mb-2">City:</label>
                  <input type="text" id="city" name="city"    className="border border-gray-300 rounded-lg px-3 py-2 w-full" required />
                </div>
                <div className="mb-4">
                    {/* No need to change now */}
                  <label htmlFor="country" className="block text-gray-700 font-semibold mb-2">Country:</label>
                  <select id="country" name="country"   className="border border-gray-300 rounded-lg px-3 py-2 w-full" required>
                    <option value="India">India</option>
                    {/* Add other country options here */}
                  </select>
                </div>
                <div className="mb-4">
                  <label htmlFor="pin" className="block text-gray-700 font-semibold mb-2">PIN:</label>
                  <input type="number"  inputMode="numeric" id="pin" name="pin"    className="border border-gray-300 rounded-lg px-3 py-2 w-full" required />
                </div>
                  {
                    // Check whether user is present
                    userToken ?
                    
                  <button disabled={isLoading} type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                  {/* Loading spinner */}
        {isLoading && (
          <FaSpinner className="animate-spin mr-1 inline-block" /> // Add animate-spin class for animation
        )}
        {/* Button text */}
                  Submit
                </button>
                  
                  :
                  <Link to="/login" type="button" className="bg-blue-500 inline-block hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                  Login
                </Link>
                  }
              </Form>
            </div>
          </div>
        </div>
      )
  )
}

export default CheckOut