import { createSlice } from "@reduxjs/toolkit"


// const blankAddress = {
//     name : "",
//     location: "",
//     landmark: "",
//     city: "",
//     country: "India",
//     pin: "110001"
// }



const defaultState = {
    cartItems: [],
    numItemsInCart: 0,
    chargeTotal: 0,
    shipping: 500,
    tax: 0,
    orderTotal: 0,
    // address: blankAddress,
}

const getCartItemsFromLocalStorage = () => JSON.parse(localStorage.getItem("cart")) || defaultState

const cartSlice = createSlice({
    name: "cart",
    initialState: getCartItemsFromLocalStorage(),
    reducers: {
        // editAddress : (state, {payload: {name, value}}) => {
        //     state.address[name] = value
        //     localStorage.setItem('cart', JSON.stringify(state))
        // },
        addItem : (state, {payload}) => {
            // console.log(payload)
            state.cartItems.push(payload)  
            cartSlice.caseReducers.calculateTotal(state)
        },
        removeItem : (state, {payload}) => {
            
            state.cartItems = state.cartItems.filter((item) => item.id != payload)
            cartSlice.caseReducers.calculateTotal(state)
        },
        editItem : (state, {payload: {type, id}}) => {
            let updatedCartItems = []
            state.cartItems.forEach(item => {
                if(item.id === id){
                    if(type === "add"){
                         updatedCartItems.push({...item, amount: item.amount+1})
                    }
                    if(type === "minus"){
                        if (item.amount !== 1){
                            updatedCartItems.push({...item, amount: item.amount-1})
                        }
                    }
                }
                else{
                    updatedCartItems.push(item)
                }
            })
            state.cartItems = updatedCartItems
            cartSlice.caseReducers.calculateTotal(state)
        },
        clearCart : () => {
            // console.log("clearcart")
            localStorage.removeItem('cart')
            return defaultState
        },
        calculateTotal: (state) => {
            state.orderTotal = state.cartItems.reduce((total, current) => {
                const {amount, price} = current
                total += amount*Number(price)
                return total
            }, 0)

            state.numItemsInCart = state.cartItems.reduce((total, current) => {
                total += Number(current.amount)
                return total
            },0)

            state.tax = 0.2*(state.orderTotal)
            state.chargeTotal = state.orderTotal + state.shipping + state.tax
            localStorage.setItem('cart', JSON.stringify(state))
          }
    }
})

export const {addItem, removeItem, editItem, clearCart} = cartSlice.actions

export default cartSlice.reducer