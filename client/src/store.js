import {configureStore} from '@reduxjs/toolkit'
import userReducer from './features/user/userSlice'
import filterReducer from './features/filter/filterSlice'
import cartReducer from './features/cart/cartSlice'

export const store = configureStore({
    reducer: {
        user: userReducer,
        filter: filterReducer,
        cart: cartReducer,
    }
})