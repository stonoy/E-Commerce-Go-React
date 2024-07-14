import React from 'react';
import { Link } from 'react-router-dom';
import { FaEdit } from 'react-icons/fa';

const ProductTable = ({ products }) => {
  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-6">Products</h2>
      <div className="overflow-x-auto bg-white p-4 rounded-lg shadow">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border-b p-4 text-gray-700">Product Name</th>
              <th className="border-b p-4 text-gray-700">Price</th>
              <th className="border-b p-4 text-gray-700">Company</th>
              <th className="border-b p-4 text-gray-700">Category</th>
              <th className="border-b p-4 text-gray-700">Featured</th>
              <th className="border-b p-4 text-gray-700">Shipping</th>
              <th className="border-b p-4 text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr
                key={product.id}
                className={`hover:bg-gray-100 ${
                  index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                }`}
              >
                <td className="p-4">{product.name}</td>
                <td className="p-4">${product.price.toFixed(2)}</td>
                <td className="p-4">{product.company}</td>
                <td className="p-4">{product.category}</td>
                <td className="p-4">{product.featured ? 'Yes' : 'No'}</td>
                <td className="p-4">{product.shipping ? 'Yes' : 'No'}</td>
                <td className="p-4">
                  <Link
                    to={`/admin/editproduct/${product.id}`}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <FaEdit />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductTable;
