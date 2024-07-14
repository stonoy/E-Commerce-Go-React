import React from 'react'
import { Link } from 'react-router-dom'

const OrderList = ({orders}) => {

  if (orders.length == 0){
    return (
      <div className="container mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-6">You have no orders</h2>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-6">Orders</h2>
        {orders.map((order) => (
          <div key={order.ID} className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Order ID: {order.ID}</h3>
            
            {/* Order Information */}
            <div className="mb-4">
              <p><strong>Created At:</strong> {new Date(order.CreatedAt).toLocaleString()}</p>
              <p><strong>Order Total:</strong> ${order.Ordertotal.toFixed(2)}</p>
            </div>
  
            {/* Shipping Address */}
            <div className="mb-4">
              <h4 className="text-lg font-semibold mb-2">Shipping Address</h4>
              <p><strong>Name:</strong> {order.Address.name}</p>
              <p><strong>Location:</strong> {order.Address.location}</p>
              <p><strong>Landmark:</strong> {order.Address.landmark}</p>
              <p><strong>City:</strong> {order.Address.city}</p>
              <p><strong>Country:</strong> {order.Address.country}</p>
              <p><strong>PIN:</strong> {order.Address.pin}</p>
            </div>
  
            {/* Ordered Products */}
            <div className="mb-4">
              <h4 className="text-lg font-semibold mb-2">Ordered Products</h4>
              {order.OrderProducts.map((product) => (
                <div key={product.id} className="flex items-center mb-4">
                  <Link to={`/products/${product.productID}`}>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-16 mr-4 rounded-lg"
                    
                  />
                  </Link>
                  <div>
                    <p><strong>Product:</strong> {product.name}</p>
                    <p><strong>Company:</strong> {product.company}</p>
                    <p><strong>Amount:</strong> {product.amount}</p>
                    <p><strong>Price:</strong> ${product.price.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
  )
}

export default OrderList