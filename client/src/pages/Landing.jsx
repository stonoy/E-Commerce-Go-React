import React from 'react'
import { FeaturedProduct, Hero } from '../components'
import { customFetch } from '../utils'
import {redirect, useLoaderData} from 'react-router-dom'
import { clearCart } from '../features/cart/cartSlice'
import { toast } from 'react-toastify'

export const loader = (store) => async () => {
  //check any cartItems in cart if so, add all to cart in server and redirect to cart page
  const cartItems = store.getState().cart.cartItems
  const userToken = store.getState().user.token

  if (cartItems.length > 0){
    try {
      for (let cartItem of cartItems){
        await customFetch.post("/insertcartproduct",{amount: Number(cartItem.amount), productID:cartItem.productID}, {
          headers : {
            'Authorization' : `Bearer ${userToken}` 
          }
        }) 
      }
      store.dispatch(clearCart())
      
      return redirect("/cart")
    } catch (error) {
      
      const errorMsg = error?.response?.data?.msg || 'Error in Inserting products in cart'

    toast.error(errorMsg)

      return null
    }
  } else {
    try {
      const resp = await customFetch.get("/products?featured=true")
      // console.log(resp.data)
      return resp.data
    } catch (error) {
      
      const errorMsg = error?.response?.data?.msg || 'Error in getting featured products'

    toast.error(errorMsg)

      return null
    }
  }
  
}


const Landing = () => {
  const data = useLoaderData()
  // console.log(data)

  return (
    <div  className="bg-gray-100">
      <Hero/>
      {/* Featured Products */}
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  gap-8">
            {data.map(product => <FeaturedProduct key={product.id} {...product}/>)}
          </div>
        </div>
      </main>
      
    </div>
  )
}

export default Landing