import React from 'react'
import { Link } from 'react-router-dom'

const FeaturedProduct = ({id,name, company, image, price}) => {
  return (
    <Link to={`/products/${id}`}>
      <div className="bg-white overflow-hidden shadow-md rounded-lg">
              <img src={image} alt="Product 1" className="w-full h-64 object-cover" />
              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-800">{name}</h2>
                <p className="text-gray-600">{company}</p>
                <p className="text-gray-900 font-semibold mt-2">${price}</p>
              </div>
            </div>
    </Link>
  )
}

export default FeaturedProduct