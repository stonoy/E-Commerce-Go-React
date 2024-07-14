import React from 'react'
import { useDispatch } from 'react-redux'

const FormSelect = ({name, label, options, value, handleChange}) => {
  
  const dispatch = useDispatch()
  const handle = (e) => {
    const {name, value} = e.target
    dispatch(handleChange({name, value}))
  }
  return (
    <div>
    <label htmlFor={name} className="block text-md font-medium text-gray-700">
      {label}
    </label>
    <div className="mt-1">
    <select id={name} name={name} value={value} onChange={handle} className="w-full border border-gray-300 rounded-md px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-indigo-500">
        {/* <option value="">Option 1</option>
        <option value="">Option 2</option>
        <option value="">Option 3</option> */}
        {options.map((option, i) => <option  key={i} value={option}>{option}</option>)}
      </select>
    </div>
  </div>
  )
}

export default FormSelect