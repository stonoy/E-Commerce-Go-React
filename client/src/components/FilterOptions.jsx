import React from 'react'
import SearchInput from './SearchInput'
import FormRange from './FormRange'
import { setOptions, setState } from '../features/filter/filterSlice'
import FormRadio from './FormRadio'

const FilterOptions = ({category, value}) => {
  return (
    <>
         {/* Text Input */}
        {/* {category === "search" && 
            <SearchInput name={category} label='search' value={value} handleChange={setState}/>
        } */}

        {category === "price" && 
            <FormRange name={category} value={value} handleChange={setState} label='price'/>
        }

        {category === "company" && 
            value.map(item => {
                return (
                    <FormRadio key={item.id} name={category} value={item} handleChange={setOptions}/>
                )
            })
        }

        {category === "category" && 
            value.map(item => {
                return (
                    <FormRadio key={item.id} name={category} value={item} handleChange={setOptions}/>
                )
            })
        }

        {category === "order" && 
            value.map(item => {
                return (
                    <FormRadio key={item.id} name={category} value={item} handleChange={setOptions}/>
                )
            })
        }
    </>
  )
}

export default FilterOptions