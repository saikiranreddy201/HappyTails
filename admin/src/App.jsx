import React, { useContext } from 'react'
import { DoctorContext } from './context/DoctorContext';
import { AdminContext } from './context/AdminContext';
import { Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Admin/Dashboard';
import AllAppointments from './pages/Admin/AllAppointments';
import AddService from './pages/Admin/AddService';
import ServicesList from './pages/Admin/ServicesList';
import Login from './pages/Login';
import DoctorAppointments from './pages/Doctor/DoctorAppointments';
import DoctorDashboard from './pages/Doctor/DoctorDashboard';
import DoctorProfile from './pages/Doctor/DoctorProfile';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {

  const { dToken } = useContext(DoctorContext)
  const { aToken } = useContext(AdminContext)

  return dToken || aToken ? (
    <div className='bg-[#F8F9FD]'>
      <ToastContainer />
      <Navbar />
      <div className='flex items-start'>
        <Sidebar />
        <Routes>
          <Route path='/' element={<></>} />
          
          {/* Admin Only Routes */}
          <Route path='/admin-dashboard' element={
            <ProtectedRoute requiredRole="admin">
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path='/all-appointments' element={
            <ProtectedRoute requiredRole="admin">
              <AllAppointments />
            </ProtectedRoute>
          } />
          <Route path='/add-service' element={
            <ProtectedRoute requiredRole="admin">
              <AddService />
            </ProtectedRoute>
          } />
          <Route path='/services-list' element={
            <ProtectedRoute requiredRole="admin">
              <ServicesList />
            </ProtectedRoute>
          } />
          
          {/* Doctor Only Routes */}
          <Route path='/doctor-dashboard' element={
            <ProtectedRoute requiredRole="doctor">
              <DoctorDashboard />
            </ProtectedRoute>
          } />
          <Route path='/doctor-appointments' element={
            <ProtectedRoute requiredRole="doctor">
              <DoctorAppointments />
            </ProtectedRoute>
          } />
          <Route path='/doctor-profile' element={
            <ProtectedRoute requiredRole="doctor">
              <DoctorProfile />
            </ProtectedRoute>
          } />
          
          {/* 404 - Fallback Route */}
          <Route path='*' element={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
                <p className="text-gray-600">Page not found</p>
              </div>
            </div>
          } />
        </Routes>
      </div>
    </div>
  ) : (
    <>
      <ToastContainer />
      <Login />
    </>
  )
}

export default App