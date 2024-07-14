import React from 'react'
import { redirect } from 'react-router-dom'
import { customFetch } from '../utils'
import { toast } from 'react-toastify'

export const action = (store) => async ({request, params}) => {
    const {id} = params
    const formData = await request.formData()
    const userToken = store.getState().user.token

    const intent = formData.get("intent")

    // console.log(id, intent)

    try {
        if (intent === "add"){
            await customFetch.post("/updatecartproduct", {id, type:intent}, {
                headers : {
                    'Authorization': `Bearer ${userToken}`
                }
            })
        }
        if (intent === "minus"){
            await customFetch.post("/updatecartproduct", {id, type:intent}, {
                headers : {
                    'Authorization': `Bearer ${userToken}`
                }
            })
        }
        if (intent === "remove"){
            await customFetch.delete(`/deletecartproduct/${id}`, {
                headers : {
                    'Authorization': `Bearer ${userToken}`
                }
            })
        }
    } catch (error) {
        const errorMsg = error?.response?.data?.msg || 'Error in updating product in cart'

    toast.error(errorMsg)
    }

    return redirect("/cart")
}