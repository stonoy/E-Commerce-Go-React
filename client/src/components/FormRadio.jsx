import React, { useState } from 'react'
import { useDispatch } from 'react-redux'

const FormRadio = ({name, value, label, handleChange}) => {
  const dispatch = useDispatch()
  // console.log(value.isSelected)

  
  const handle = () => {
    
    // const {name, value} = e.target
  //  const name = "shipping"
  //  const value = "on"
    dispatch(handleChange({name, id:value.id}))
  }
  
  return (
    <label className="block mb-2">
    <input type="checkbox" onChange={handle} name={name} checked={value.isSelected} className="option form-radio mr-2"/>
    {value.option}
</label>
  )
}

export default FormRadio