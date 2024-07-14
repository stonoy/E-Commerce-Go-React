import React, { useState } from 'react'
import { Form, Link, redirect, useLoaderData, useNavigation, useParams } from 'react-router-dom'
import { customFetch } from '../utils'
import { useDispatch, useSelector } from 'react-redux'
import { addItem } from '../features/cart/cartSlice'
import { toast } from 'react-toastify'
import { FaSpinner } from 'react-icons/fa'

export const loader = (store) => async ({params}) => {
  const {id} = params
  const userToken = store.getState().user.token

  if (userToken) {
    try {
      const resp = await customFetch(`/product/${id}`)
      const productInCartServer = await customFetch(`/productincart/${id}`, {
        headers: {
          'Authorization': `Bearer ${userToken}` 
        }}
      )
      // console.log(productInCartServer)
      return {...resp?.data, productInCartServer:productInCartServer?.data?.product_in_cart}
    } catch (error) {
      const errorMsg = error?.response?.data?.msg || 'Error in getting the product or whether product in cart'

    toast.error(errorMsg)

    // if user token is not valid redirect to login page
    if (error?.response?.status === 401 || error?.response?.status === 403 ){
    
      return redirect('/login');
    }

      return null
    }
  } else {
    try {
      const resp = await customFetch(`/product/${id}`)
      return {...resp?.data, productInCartServer:false}
    } catch (error) {
      const errorMsg = error?.response?.data?.msg || 'Error in getting the product'

    toast.error(errorMsg)
      return null
    }
  }
  
  
}

export const action = (store) => async({request, params}) => {
  const {id} = params
  const userToken = store.getState().user.token

  const formData = await request.formData()
  const {amount} = Object.fromEntries(formData)
  // console.log(amount, id)

  try {
    await customFetch.post("/insertcartproduct",{amount: Number(amount), productID:id}, {
      headers : {
        'Authorization' : `Bearer ${userToken}` 
      }
    })
    
  } catch (error) {
    const errorMsg = error?.response?.data?.msg || 'Error in inserting product in cart'

    toast.error(errorMsg)
    // if user token is not valid redirect to login page
    if (error?.response?.status === 401 || error?.response?.status === 403 ){
    
      return redirect('/login');
    }
  }
  return null
}

const SingleProducts = () => {
  const data = useLoaderData()
  const navigation = useNavigation()
  const isLoading = navigation.state == "submitting"
  // console.log(data)
  const dispatch = useDispatch()
  const cartItems = useSelector( state => state.cart.cartItems)
  const userToken = useSelector( state => state.user.token)

  const {id, name, company, image, price, description, productInCartServer} = data


  const [amount, setAmount] = useState(1)

  
  const handleCart = () => {
    const cartItem = {id: (Date.now()), productID: id, amount: Number(amount), company, image, price,name}
    dispatch(addItem(cartItem))
  }

  // check the item present in the cart, if yes change the add to cart -> go to cart
  const productInCartLocal = () => {
    if (cartItems.length === 0){return false}
    for(let item of cartItems){
      if (item.productID === id){
        return true
      }

    }
    return false
  }

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md flex flex-col md:flex-row items-center">
        {/* Image */}
        <div className="w-full md:w-1/2">
          <img src={image} alt={name} className="w-full h-auto rounded-t-lg md:rounded-l-lg" />
          {/* Color Swatches */}
          {/* <div className="mt-4 flex justify-center">
            {colors.map((color, index) => (
              <div onClick={() => setSelectedColor(color)} key={index} className={`w-8 h-8 rounded-full mr-2 ${selectedColor === color ? 'border-2 border-gray-700' : ''}`} style={{ backgroundColor: color }}></div>
            ))}
          </div> */}
        </div>

        {/* Product Details */}
        <div className="w-full md:w-1/2 p-6">
          <div className="text-3xl font-bold mb-4">{name}</div>
          <div className="text-gray-700 mb-2">{description}</div>
          <div className="text-lg font-semibold text-gray-600 mb-4">By {company}</div>
          <div className="text-2xl font-bold mb-4">${price}</div>
          {/* Number Input */}
          {/* Condition if user present */}
          {
            userToken ?
            <Form method='POST'>
          <div className="flex items-center mb-4">
            <label htmlFor="amount" className="mr-2">Quantity:</label>
            <input type="number" defaultValue={1} id="amount" name="amount" className="border border-gray-300 rounded-lg px-3 py-2 w-20" min={1} />
          </div>
          <div>
            {
              // Check Product present in cart
             ( productInCartServer) ?
              <Link to="/cart" className="bg-blue-500 inline-block hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
              Go to Cart
            </Link>
            :
            <button type='submit' disabled={isLoading} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
              {/* Loading spinner */}
        {isLoading && (
          <FaSpinner className="animate-spin mr-1 inline-block" /> // Add animate-spin class for animation
        )}
        {/* Button text */}
              Add to Cart
            </button>
            }
          </div>
          </Form>
          :
            // Condition when user not present
          <div>
          <div className="flex items-center mb-4">
            <label htmlFor="amount" className="mr-2">Quantity:</label>
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)}  id="amount" name="amount" className="border border-gray-300 rounded-lg px-3 py-2 w-20" min={1} />
          </div>
          <div>
            {
              // Check Product present in cart
             ( productInCartLocal()) ?
              <Link to="/cart" className="bg-blue-500 inline-block hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
              Go to Cart
            </Link>
            :
            <button type='submit' onClick={handleCart} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
              Add to Cart
            </button>
            }
          </div>
          </div>
          }
        </div>
      </div>
    </div>
  );
}

export default SingleProducts