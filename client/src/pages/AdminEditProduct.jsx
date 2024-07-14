import React from 'react'
import { Form, redirect, useLoaderData } from 'react-router-dom';
import AdminInput from '../components/AdminInput';
import AdminCheckbox from '../components/AdminCheckbox';
import { customFetch } from '../utils';
import { toast } from 'react-toastify';

export const loader = async({params}) => {
  const {id} = params


  try {
    const resp = await customFetch(`/product/${id}`)
    return resp?.data
  } catch (error) {

    const errorMsg = error?.response?.data?.msg || 'Error in getting product'

    toast.error(errorMsg)

    return null
  }
}

export const action = (store) => async({request, params}) => {
  const formData = await request.formData()
  const data = Object.fromEntries(formData)

  const userToken = store.getState().user.token

  const {id} = params

  try {
    await customFetch.put(`/updateproduct/${id}`, {...data, price: Number(data.price), featured: data.featured === "on" ? true : false , shipping: data.shipping === "on" ? true : false},  {
      headers : {
        'Authorization' : `Bearer ${userToken}`
      }
    })
    toast.success("product updated successfully")
    return redirect("/admin")
  } catch (error) {
    const errorMsg = error?.response?.data?.msg || 'Error in creating products'

    toast.error(errorMsg)
    // if user token is not valid redirect to login page
    if (error?.response?.status === 401 || error?.response?.status === 403 ){
    
      return redirect('/login');
    }
    return null
  }

  
}

const AdminEditProduct = () => {
  const product = useLoaderData()
  // console.log(product)
  return (
    <div className="max-w-3xl mt-8 mx-auto bg-slate-300 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-6">Update the Product</h2>
      <Form method='post'>
        {/* First Row: Product Name and Price */}
        <div className="flex flex-col md:flex-row md:space-x-4">
            <AdminInput name="name" label="Product Name" type="text" defaultValue={product.name}/>

            <AdminInput name="price" label="Price" type="number" defaultValue={product.price}/>
        </div>

        {/* Second Row: Image URL and Description */}
        <div className="flex flex-col md:flex-row md:space-x-4">
        <AdminInput name="image" label="Image" type="text" defaultValue={product.image}/>

        <div className="mb-4 w-full">
            <label htmlFor="description" className="block text-gray-700 font-semibold mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              defaultValue={product.description}
              className="border border-gray-300 rounded-lg px-3 py-2 w-full resize-none"
              required
            />
          </div>
        </div>

        {/* Third Row: Company and Category */}
        <div className="flex flex-col md:flex-row md:space-x-4">
        <AdminInput name="company" label="Company" type="text" defaultValue={product.company}/>

        <AdminInput name="category" label="Category" type="text" defaultValue={product.category}/>
        </div>

        {/* Fourth Row: Checkboxes for Featured and Shipping */}
        <div className="flex flex-col md:flex-row md:space-x-4">
            {/* Hidden fields to ensure checkbox keys are always included in form data */}
        <input type="hidden" name="featured" value="false" />
        <input type="hidden" name="shipping" value="false" />
        
          <AdminCheckbox name="featured" label="Is Featured" defaultChecked={product.featured}/>

          <AdminCheckbox name="shipping" label="Free Shipping" defaultChecked={product.shipping}/>
        </div>

        {/* Submit Button */}
        <div className="mt-6">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Update Product
          </button>
        </div>
      </Form>
    </div>
  );
}

export default AdminEditProduct