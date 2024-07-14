import React from 'react'
import { useDispatch } from 'react-redux'

const SearchInput = ({ name, label, value, handleChange}) => {
    const dispatch = useDispatch()
    const handle = (e) => {
      const {name, value} = e.target
      dispatch(handleChange({name, value}))
    }
  return (
    <div >
              <label htmlFor={name} className="inline-block text-md font-medium text-gray-700">
                {label}
              </label>
              <div className="mt-1">
                <input
                  id={name}
                  name={name}
                  type='text'
                  value={value}
                  onChange={handle}
                  placeholder="Search..." 
                  className="border w-full border-gray-300 rounded-md px-2 py-1 mb-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                //   defaultValue={defaultValue}
                />
              </div>
            </div>
  )
}

export default SearchInput