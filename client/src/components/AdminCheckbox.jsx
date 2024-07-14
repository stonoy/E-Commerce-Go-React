import React from 'react'

const AdminCheckbox = ({name, label, defaultChecked}) => {
  return (
    <div className="mb-4 w-full flex items-center">
            <input
              type="checkbox"
              id={name}
              name={name}
              defaultChecked={defaultChecked || false}
              className="mr-2"
            />
            <label htmlFor={name} className="text-gray-700 font-semibold">
              {label}
            </label>
          </div>
  )
}

export default AdminCheckbox