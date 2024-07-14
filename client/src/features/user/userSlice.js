import {createSlice} from '@reduxjs/toolkit'

const defaultState = {
    token: "",
    isAdmin: false,
    username: "Guest User"
}

function getUserFromLocalStorage(){
    return JSON.parse(localStorage.getItem("user"))
}

const userSlice = createSlice({
    name: "user",
    initialState: getUserFromLocalStorage() || defaultState,
    reducers: {
        setUser: (state, {payload: {token, name, role}}) => {
            
            state.token = token
            state.isAdmin = role === "admin"
            state.username = name
            localStorage.setItem("user", JSON.stringify(state))
        },
        logout : () => {
            localStorage.removeItem("user")
            return defaultState
        }
        
    }
})

export const {setUser, logout} = userSlice.actions

export default userSlice.reducer