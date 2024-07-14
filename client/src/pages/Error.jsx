import React from 'react'
import { Link, useRouteError } from 'react-router-dom'

const Error = () => {
  const appError = useRouteError()
  console.log(`Error from error page: ${appError}`)

  if(appError.status == "404"){
    return (
      <div className="bg-red-100 p-8 flex items-center justify-center min-h-screen">
      <div className="container mx-auto text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Error</h1>
        <p className="text-red-600 mb-6">
          Oops! Something went wrong. The page you're looking for does not exist.
        </p>
        <Link to='/' className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-300">
          Back to Home Page
        </Link>
      </div>
    </div>
    )
  }
  return (
    <div className='align-element w-fit mx-auto my-10 text-red-500'>Something went wrong! Check Console...</div>
  )
}

export default Error