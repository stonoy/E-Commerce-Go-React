import React from 'react'
import { useDispatch } from 'react-redux'

const FormRange = ({name, label, value, handleChange}) => {
  const dispatch = useDispatch()
  const handle = (e) => {
    const {name, value} = e.target
    dispatch(handleChange({name, value}))
  }

  const step = 1000
  const maxPrice = 20000

  return (
    <div className='h-24'>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <div className="relative mt-1">
      {/* Min price label */}
      <span className="absolute left-0 top-5 text-xs text-gray-500">$0</span>
    <input 
    type="range" 
    min="0" 
    name={name}
    max={maxPrice} 
    step={step}
    value={value}
    onChange={handle}  
    className="w-full" />

    {/* Max price label */}
    <span className="absolute right-0 top-5 text-xs text-gray-500">${maxPrice}</span>
    </div>
  </div>
  )
}

export default FormRange