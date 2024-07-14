import React from 'react'

const AdminInput = ({name, label, type, defaultValue}) => {
  return (
    <div className="mb-4 w-full">
            <label htmlFor={name} className="block text-gray-700 font-semibold mb-2">
              {label}
            </label>
            <input
              
              type={type}
              id={name}
              name={name}
              defaultValue={defaultValue || ""}
              className="border border-gray-300 rounded-lg px-3 py-2 w-full"
              required
            />
          </div>
  )
}

export default AdminInput