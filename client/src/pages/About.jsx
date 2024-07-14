import React from 'react'

const About = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            About Us
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Welcome to our online store. We are dedicated to providing you with the best products and services.
          </p>
          <p className="mt-4 text-lg text-gray-600">
            Our mission is to make shopping easy and enjoyable for you. We offer a wide range of products to meet your needs.
          </p>
          <p className="mt-4 text-lg text-gray-600">
            Thank you for choosing us. We appreciate your business!
          </p>
        </div>
      </div>
    </div>
  );
}

export default About