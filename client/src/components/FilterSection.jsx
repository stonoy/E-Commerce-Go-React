import React from 'react'
import { IoFilter } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'

const FilterSection = ({isFilterApplied,myFilter, handleSearch, handleOpenFilter}) => {
    const navigate = useNavigate()
  return (
    <div className='flex flex-col md:flex-row items-center justify-between mb-4'>
        {/* Search bar */}
      <div className="mb-4 md:mb-0 w-full md:w-auto">
            <input
              type="text"
              name='search'
              value={myFilter.search}
              onChange={handleSearch}
              className="border border-gray-300 rounded-lg px-4 py-2"
              placeholder="Search..."
              
            />
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
              onClick={() => navigate("/products")}
            >
              Search
            </button>
          </div>

      {/* Filter button */}
      <div className="flex justify-end relative mt-2 md:mt-0">
          <button
            className="flex items-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            onClick={handleOpenFilter}
          >
            <IoFilter className='mr-2' />
            Filter
          {isFilterApplied && 
            <span className="bg-red-500 text-white text-xs font-semibold px-2 rounded-full absolute top-0 right-0 -mt-1 -mr-1">
            I
          </span>
          }
          </button>
        </div>
      </div>
  )
}

export default FilterSection