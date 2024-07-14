import React from 'react'
import {Link} from 'react-router-dom'

const Gallery = ({products}) => {
  // console.log(products)
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(({id, name, image, description, price}) => (
            <div key={id} className="bg-white overflow-hidden shadow-md rounded-lg">
              <img src={image} alt={name} className="w-full h-64 object-cover" />
              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-800">{name}</h2>
                <p className="text-gray-600">{description.split(" ").slice(0,10).join(" ")}</p>
                <p className="text-gray-900 font-semibold mt-2">${price}</p>
                <Link to={`./${id}`} className="mt-4 inline-block bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600">
                  See
                </Link>
              </div>
            </div>
          ))}
        </div>
  )
}

export default Gallery