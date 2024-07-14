import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-4">
      <div className="max-w-7xl align-element mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <p>&copy; 2024 Your Company</p>
          <ul className="flex space-x-4">
            <li>
              <a href="#" className="hover:text-gray-300">Terms of Service</a>
            </li>
            <li>
              <a href="#" className="hover:text-gray-300">Privacy Policy</a>
            </li>
            <li>
              <a href="#" className="hover:text-gray-300">Contact Us</a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

export default Footer