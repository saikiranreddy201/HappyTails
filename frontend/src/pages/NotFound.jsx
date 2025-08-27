import React from 'react'
import { useNavigate } from 'react-router-dom'

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <div className='min-h-[60vh] flex items-center justify-center p-4'>
      <div className='text-center'>
        <div className='mb-8'>
          <div className='text-9xl font-bold text-gray-300 mb-4'>404</div>
          <h1 className='text-3xl font-bold text-gray-800 mb-2'>Page Not Found</h1>
          <p className='text-gray-600 max-w-md mx-auto'>
            Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or doesn't exist.
          </p>
        </div>
        
        <div className='space-x-4'>
          <button 
            onClick={() => navigate('/')}
            className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors'
          >
            Go Home
          </button>
          <button 
            onClick={() => navigate(-1)}
            className='border border-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors'
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  )
}

export default NotFound