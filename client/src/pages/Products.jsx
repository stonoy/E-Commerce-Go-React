import React, { useState } from 'react'
import { FilterModal, FilterSection, Gallery, Pagination } from '../components'
import { addQueryParamsToUrl, customFetch } from '../utils'
import {useLoaderData, useNavigate} from 'react-router-dom'
import { IoFilter } from "react-icons/io5";
import { useDispatch, useSelector } from 'react-redux';
import { firstTimeSave, setState } from '../features/filter/filterSlice';
import { toast } from 'react-toastify';

export const loader = (store) => async ({request}) => {
  const {myFilter, isFilterApplied, isFilterSet} = store.getState().filter
  // console.log(filterState)

  // get the page in the url
  const {page} = Object.fromEntries([
    ...new URL(request.url).searchParams.entries(),
  ]);
  
  // only allow this when user apply the filters
  if (isFilterApplied){
    
    const queryUrl = addQueryParamsToUrl(`/products?page=${page || 1}`, myFilter)
    // console.log(queryUrl)
    try {
      const resp = await customFetch.get(queryUrl)
      // console.log(resp.data)
      return {products: resp?.data?.products, meta: resp?.data?.meta}
    } catch (error) {
      const errorMsg = error?.response?.data?.msg || 'Error in getting filtered products'

    toast.error(errorMsg)
      return null
    }
  }
  

  try {
    
    let queryUrl = `/products`
    // add page in query url

    queryUrl += `?page=${page || 1}`

    //check user has a search
    if (myFilter.search){
      queryUrl += `&search=${myFilter.search}`
    }
    // console.log(queryUrl)
    const resp = await customFetch.get(queryUrl)
    // console.log(resp.data)
    // set filter only for the first time
    if (!isFilterSet) {
      store.dispatch(firstTimeSave(resp?.data?.meta))
    }
    
    return {products: resp?.data?.products, meta: resp?.data?.meta}
  } catch (error) {
    const errorMsg = error?.response?.data?.msg || 'Error in getting products'

    toast.error(errorMsg)

    return null
  }
}

const Products = () => {
  const {products, meta} = useLoaderData()
 const [openFilter, setOpenFilter] = useState(false)
 const {isFilterApplied, myFilter} = useSelector(state => state.filter)
 const dispatch = useDispatch()
 const navigate = useNavigate()

 const handleSearch = (e) => {
  const {name, value} = e.target
  dispatch(setState({name, value}))
 }

 const handleOpenFilter = () => setOpenFilter(!openFilter)
  // console.log(products)
  return (
    <div className="bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Filter Section */}
        <FilterSection isFilterApplied={isFilterApplied} myFilter={myFilter} handleOpenFilter={handleOpenFilter} handleSearch={handleSearch}/>

        <Gallery products={products}/>

        {/* Pagination */}
        <Pagination numOfPages={meta.numOfPages} page={meta.page} />

        {/* Filter */}
        {openFilter && <FilterModal handleOpenFilter={handleOpenFilter} categories={products?.meta?.categories} companies={products?.meta?.companies}/>}
      </div>
    </div>
  )
}

export default Products