import React, { useContext } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const ProtectedRoute = ({ children }) => {
  const { token } = useContext(AppContext)
  const location = useLocation()
  
  if (!token) {
    // Redirect to login with return URL
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  
  return children
}

export default ProtectedRoute