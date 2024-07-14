import React from 'react'
import { FiPlus, FiMinus, FiTrash2 } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { editItem, removeItem } from '../features/cart/cartSlice';
import { Form, Link, useNavigation } from 'react-router-dom';
import { FaSpinner } from 'react-icons/fa';

const CartItem = (item) => {
  // check user logged in or not
  const userToken = useSelector(state => state.user.token) 
  const dispatch = useDispatch()
  const navigation = useNavigation()
  const isLoading = navigation.state == "submitting"
  
  

  return (
    <div  className="flex items-center border-b border-gray-200 py-4">
                  <Link to={`/products/${item.productID}`}>
                    <img src={item.image} alt={item.title} className="w-16 h-16 mr-4 rounded-lg" />
                  </Link>
                  <div className="flex-1">
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-gray-600">${item.price}</p>
                    <p className="text-black-600 text-sm">Qty: {item.amount}</p>
                  </div>
                  {
                    userToken ? 
                    // When user present talk to backend
                    <div className="flex items-center">
                      <Form method='post' action={`/updatecart/${item.id}`}>
                      <button disabled={isLoading} name='intent' value={item.amount === 1 ? "remove" : "minus"} className="text-gray-500 mr-2">
                      {isLoading ? <FaSpinner className="animate-spin" /> : <FiMinus/>}
                    </button>
                      </Form>
                    {/* <span>{item.quantity}</span> */}
                      <Form method='post' action={`/updatecart/${item.id}`}>
                      <button disabled={isLoading} name='intent' value='add' className="text-gray-500 ml-2">
                      {isLoading ? <FaSpinner className="animate-spin" /> : <FiPlus/>}
                    </button>
                      </Form>
                      <Form method='post' action={`/updatecart/${item.id}`}>
                      <button disabled={isLoading} name='intent' value='remove' className="text-red-500 ml-4">
                      {isLoading ? <FaSpinner className="animate-spin" /> : <FiTrash2/>}
                    </button>
                      </Form>
                  </div>
                  :
                  // When no user to to local state (redux + localstorage)
                  <div className="flex items-center">
                    <button onClick={() => dispatch(editItem({type:"minus", id:item.id}))} className="text-gray-500 mr-2">
                      <FiMinus />
                    </button>
                    {/* <span>{item.quantity}</span> */}
                    <button onClick={() => dispatch(editItem({type:"add", id:item.id}))} className="text-gray-500 ml-2">
                      <FiPlus />
                    </button>
                    <button onClick={() => dispatch(removeItem(item.id))} className="text-red-500 ml-4">
                      <FiTrash2 />
                    </button>
                  </div>
                  }
                </div>
  )
}

export default CartItem