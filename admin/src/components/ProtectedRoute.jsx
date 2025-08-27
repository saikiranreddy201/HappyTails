import React, { useContext } from 'react'
import { AdminContext } from '../context/AdminContext'
import { DoctorContext } from '../context/DoctorContext'

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { aToken } = useContext(AdminContext)
  const { dToken } = useContext(DoctorContext)
  
  // Check if user has any valid token
  const hasValidToken = aToken || dToken
  
  // If no token, show login
  if (!hasValidToken) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h2>
        <p className="text-gray-600 mb-6">Please log in to access this page.</p>
        <button 
          onClick={() => window.location.reload()} 
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
        >
          Go to Login
        </button>
      </div>
    </div>
  }
  
  // Role-based access control
  if (requiredRole === 'admin' && !aToken) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Admin Access Required</h2>
        <p className="text-gray-600">This page is restricted to administrators only.</p>
      </div>
    </div>
  }
  
  if (requiredRole === 'doctor' && !dToken) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Doctor Access Required</h2>
        <p className="text-gray-600">This page is restricted to doctors only.</p>
      </div>
    </div>
  }
  
  return children
}

export default ProtectedRoute