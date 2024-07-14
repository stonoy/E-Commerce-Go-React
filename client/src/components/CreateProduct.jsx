import React from 'react';
import { Form } from 'react-router-dom';
import AdminInput from './AdminInput';
import AdminCheckbox from './AdminCheckbox';

const CreateProduct = () => {
  return (
    <div className="max-w-3xl mt-8 mx-auto bg-slate-300 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-6">Create New Product</h2>
      <Form method='post'>
        {/* First Row: Product Name and Price */}
        <div className="flex flex-col md:flex-row md:space-x-4">
            <AdminInput name="name" label="Product Name" type="text"/>

            <AdminInput name="price" label="Price" type="number"/>
        </div>

        {/* Second Row: Image URL and Description */}
        <div className="flex flex-col md:flex-row md:space-x-4">
        <AdminInput name="image" label="Image" type="text"/>

        <div className="mb-4 w-full">
            <label htmlFor="description" className="block text-gray-700 font-semibold mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              className="border border-gray-300 rounded-lg px-3 py-2 w-full resize-none"
              required
            />
          </div>
        </div>

        {/* Third Row: Company and Category */}
        <div className="flex flex-col md:flex-row md:space-x-4">
        <AdminInput name="company" label="Company" type="text"/>

        <AdminInput name="category" label="Category" type="text"/>
        </div>

        {/* Fourth Row: Checkboxes for Featured and Shipping */}
        <div className="flex flex-col md:flex-row md:space-x-4">
            {/* Hidden fields to ensure checkbox keys are always included in form data */}
        <input type="hidden" name="featured" value="false" />
        <input type="hidden" name="shipping" value="false" />
        
          <AdminCheckbox name="featured" label="Is Featured" />

          <AdminCheckbox name="shipping" label="Free Shipping" />
        </div>

        {/* Submit Button */}
        <div className="mt-6">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Create Product
          </button>
        </div>
      </Form>
    </div>
  );
};

export default CreateProduct;
