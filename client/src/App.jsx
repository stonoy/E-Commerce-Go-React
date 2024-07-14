import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { About, AdminDashBoard, AdminInsights, AdminLayout, AdminOrder, Cart, CheckOut, Error, HomeLayOut, Landing, Login, Order, Products, Register, SingleProducts } from './pages'
import { store } from './store'

// loaders
import {loader as landingLoader} from './pages/Landing'
import {loader as productLoader} from './pages/Products'
import {loader as singleProductLoader} from './pages/SingleProducts'
import {loader as cartLoader} from './pages/Cart'
import {loader as orderLoader} from './pages/Order'
import {loader as adminProductLoader} from './pages/AdminDashBoard'
import {loader as adminOrderLoader} from './pages/AdminOrder'
import {loader as adminInsightsLoader} from './pages/AdminInsights'
import {loader as adminLayoutLoader} from './pages/AdminLayout'
import AdminEditProduct, {loader as adminSingleProductLoader} from './pages/AdminEditProduct'

// actions
import {action as loginAction} from './pages/Login'
import {action as registerAction} from './pages/Register'
import {action as checkOutAction} from './pages/CheckOut'
import {action as singleProductAction} from './pages/SingleProducts'
import {action as updateCartAction} from './pages/UpdateCart'
import {action as deleteCartAction} from './pages/Cart'
import {action as createProductAction} from './pages/AdminDashBoard'
import {action as editProductAction} from './pages/AdminEditProduct'



const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayOut/>,
    errorElement: <Error/>,
    children: [
      {
        index: true,
        element: <Landing/>,
        loader: landingLoader(store),
      },
      {
        path: "products",
        element: <Products/>,
        loader: productLoader(store),
      },
      {
        path: "products/:id",
        element: <SingleProducts/>,
        loader: singleProductLoader(store),
        action: singleProductAction(store),
      },
      {
        path: "cart",
        element: <Cart/>,
        loader: cartLoader(store),
        action: deleteCartAction(store),
      },
      {
        path: "updatecart/:id",
        action: updateCartAction(store),
      },
      {
        path: "about",
        element: <About/>,
      },
      {
        path: "checkout",
        element: <CheckOut/>,
        action: checkOutAction(store),
      },
      {
        path: "products",
        element: <Products/>,
      },
      {
        path: "order",
        element: <Order/>,
        loader: orderLoader(store),
      },
      {
        path: "admin",
        element: <AdminLayout/>,
        loader: adminLayoutLoader(store),
        children: [
          {
            index: true,
            element: <AdminDashBoard/>,
            loader: adminProductLoader(store),
            action: createProductAction(store),
          },
          {
            path: "editproduct/:id",
            element: <AdminEditProduct/>,
            loader: adminSingleProductLoader,
            action: editProductAction(store),
          },
          {
            path: "orders",
            element: <AdminOrder/>,
            loader: adminOrderLoader(store)
          },
          {
            path: "insights",
            element: <AdminInsights/>,
            loader: adminInsightsLoader(store)
          },
        ]
      }
    ]
  },
  {
    path: "/login",
    element: <Login/>,
    action: loginAction(store),
  },
  {
    path: "/register",
    element: <Register/>,
    action: registerAction,
  },
])

const App = () => {
  return (
    <RouterProvider router={router}/>
  )
}

export default App