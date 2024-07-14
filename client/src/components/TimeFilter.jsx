import React from 'react'

const TimeFilter = ({timeFilter,handleFilterChange,myTimeFilters}) => {
  return (
    <div className="mb-2 ml-auto md:mb-6">
        <label htmlFor="order-filter" className="mr-4 font-semibold text-gray-700">
          Filter Orders by Time:
        </label>
        <select
          id="order-filter"
          value={timeFilter}
          onChange={handleFilterChange}
          className="border border-gray-300 rounded-lg px-3 py-2"
        >
          {myTimeFilters.map((filter,i) => <option key={i} value={filter}>{filter}</option>)}
          {/* Add more filter options as needed */}
        </select>
      </div>
  )
}

export default TimeFilter