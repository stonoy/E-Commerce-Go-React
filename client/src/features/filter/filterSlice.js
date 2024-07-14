import { createSlice } from "@reduxjs/toolkit"
import { getFilterArray } from "../../utils"


const defaultState = {
   defaultFilter : {
    // page: 1,
    search: "",
    category : [],
    company: [],
    order: getFilterArray(["a-z", "z-a", "low-high", "high-low"]),
    price: 100000,
   },
   myFilter : {
    // page: 1,
    search: "",
    category : [],
    company: [],
    order: getFilterArray(["a-z", "z-a", "low-high", "high-low"]),
    price: 100000,
   },
   isFilterApplied: false,
   isFilterSet: false
}

const filterSlice = createSlice({
    name: "filter",
    initialState: defaultState,
    reducers: {
        firstTimeSave : (state, {payload : {company, category}}) => {
            company.forEach((item,i) => {
                state.defaultFilter.company.push({id:i, option:item, isSelected: false})
            })
            category.forEach((item,i) => {
                state.defaultFilter.category.push({id:i, option:item, isSelected: false})
            })
            state.myFilter = state.defaultFilter
            state.isFilterSet = true
        },
        setState: (state, {payload}) => {
            // work here
            const {name, value} = payload
            // console.log(name, value)
            if(name === "shipping"){
                state[name] = !state[name]
                
            }
            else{
                state.myFilter[name] = value
            }

            
        },
        setOptions : (state, {payload : {name, id}}) => {
            // console.log(name, id)
          state.myFilter[name] =  state.myFilter[name].map(item => {
                if (item.id === id){
                    // console.log(item)
                    return {...item, isSelected: !item.isSelected}
                }
                return item
            })
        },
        setApplyFilter: (state) => {
            state.isFilterApplied = true
        },
        reset : (state) => {
            state.myFilter = state.defaultFilter
            state.isFilterApplied = false
        }
    }
})

export const {setState, reset, setApplyFilter, firstTimeSave, setOptions} = filterSlice.actions

export default filterSlice.reducer