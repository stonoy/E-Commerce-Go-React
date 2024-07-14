import React from 'react'
import { CreateProduct, ProductTable } from '../components'
import { customFetch } from '../utils'
import { redirect, useLoaderData } from 'react-router-dom'
import { toast } from 'react-toastify'

export const loader = (store) => async() => {
  const userToken = store.getState().user.token
  try {
    const resp = await customFetch("/products")
    
    // console.log(resp?.data)
    return resp?.data
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

export const action = (store) => async({request}) => {
  const formData = await request.formData()
  const data = Object.fromEntries(formData)
  // console.log(data)

  const userToken = store.getState().user.token

  try {
    await customFetch.post("/createproducts", {...data, price: Number(data.price), featured: data.featured === "on" ? true : false , shipping: data.shipping === "on" ? true : false},  {
      headers : {
        'Authorization' : `Bearer ${userToken}`
      }
    })
  } catch (error) {
    const errorMsg = error?.response?.data?.msg || 'Error in creating products'

    toast.error(errorMsg)

    // if user token is not valid redirect to login page
    if (error?.response?.status === 401 || error?.response?.status === 403 ){
    
      return redirect('/login');
    }

    // console.log(error)
  }

  return null
}

const AdminDashBoard = () => {
  const products = useLoaderData()
  return (
    <>

      <CreateProduct/>
      <ProductTable products={products} />
    </>
  )
}

export default AdminDashBoard