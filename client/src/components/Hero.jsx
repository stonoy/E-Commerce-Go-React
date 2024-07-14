import React from 'react'
import banner from '../assets/Images/banner.png'
import { Link } from 'react-router-dom'

const Hero = () => {
  return (
    <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between items-center gap-4 sm:flex-row">
            {/* Introduction */}
            <div className="w-full sm:w-1/2">
              <h1 className="text-3xl font-extrabold text-gray-900 mb-4">Welcome to our website</h1>
              <p className="text-sm text-gray-700 mb-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
              <Link to="/products" className="text-sm inline-block font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg">
                Explore More
              </Link>
            </div>
            {/* Image */}
            <div className="w-full sm:w-1/2">
              <img src={banner} alt="Introduction" className="w-full h-auto" />
            </div>
          </div>
        </div>
      </header>
  )
}

export default Hero