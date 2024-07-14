import React, { useState } from 'react'
import SearchInput from './SearchInput'
import FormSelect from './FormSelect'
import FormRange from './FormRange'
import FormRadio from './FormRadio'
import { useDispatch, useSelector } from 'react-redux'
import { IoClose } from "react-icons/io5";
import {  reset, setApplyFilter, setState } from '../features/filter/filterSlice'
import { useNavigate } from 'react-router-dom'
import FilterOptions from './FilterOptions'

const FilterModal = ({companies, categories, handleOpenFilter}) => {
 const dispatch = useDispatch()
 const navigate = useNavigate()
 const [selectedCategory, setSelectedCategory] = useState("category")
 const myFilter = useSelector(state => state.filter.myFilter)

 
 const resetFilter = () => {
    handleOpenFilter()
    dispatch(reset())
    navigate("/products")
 }

 const applyFilter = () => {
  handleOpenFilter()
  dispatch(setApplyFilter())
  navigate("/products")
 }
 
//  console.log(filter)

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center ">
        <div className="bg-white flex flex-col py-2 px-4 rounded-lg shadow-lg md:py-4 md:px-8">
            <div className="flex justify-end items-center">
                <button id="closeModal" className="text-gray-500 hover:text-gray-700 focus:outline-none">
                <IoClose onClick={handleOpenFilter} className="fa-solid text-xl fa-xmark" />
                </button>
            </div>
             {/* Main filter */}
             <div className="container mx-auto py-8">
                <div className="flex justify-center">
                     {/* Categories */}
                    <div className="mr-8 p-4 border border-gray-300  rounded-lg">
                        <h2 className="text-lg font-semibold mb-2">Categories</h2>
                        <div id="categories" className="overflow-y-auto max-h-48 shadow-inner">
                            
                            {/* Add categories as needed */}
                            {Object.keys(myFilter).map((cat,i) => {
                                if (cat === 'page' || cat === 'search' || cat === "order"){return}
                                return (
                                    
                                    <div key={i} onClick={() => setSelectedCategory(cat)} className=" p-2 rounded-md mb-2">
                                           <p >{cat}</p>
                                    </div>
                                )
                            })}

                        </div>
                    </div>
                    {/* Options */}
                    <div className="p-4 items-center border border-gray-300 shadow-inner rounded-lg">
                        <h2 className="text-lg font-semibold mb-2">Options</h2>
                        <div id="options" className="overflow-y-auto h-auto w-32 max-h-48 text-left">
                            
                             {/* Add options as needed  */}
                             <FilterOptions category={selectedCategory} value={myFilter[selectedCategory]} />
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Main filter ends */}
            <div className="ml-auto">
                <button onClick={applyFilter} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2 focus:outline-none focus:shadow-outline">Apply</button>
                <button onClick={resetFilter} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Cancel</button>
            </div>
        </div>
    </div>
  )
}

export default FilterModal

// ANOTHER TYPE OF SETTING FILTER

//  <div className="my-4 flex flex-col gap-2">
//       {/* Text Input */}
//       <SearchInput name='search' label='search' value={search} handleChange={setState}/>

//       {/* Select Inputs */}
//       <FormSelect name='category' label='category' value={category} handleChange={setState} options={categories} />
//       <FormSelect name='company' label='company' value={company} handleChange={setState} options={companies} />
//       <FormSelect name='order' label='order' value={order} handleChange={setState} options={['a-z', 'z-a', 'high', 'low']} />
      
//       {/* Range Input */}
//       <FormRange name='price' value={price} handleChange={setState} label='price'/>
      
//       {/* Radio Input */}
//       {/* <FormRadio name='shipping' value={shipping} handleChange={setState} label='shipping'/> */}
      
//     </div>

            