import React from 'react'
import Navbar from './components/Navbar'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Doctors from './pages/Doctors'
import Login from './pages/Login'
import About from './pages/About'
import Contact from './pages/Contact'
import Appointment from './pages/Appointment'
import MyAppointments from './pages/MyAppointments'
import MyProfile from './pages/MyProfile'
import Footer from './components/Footer'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Verify from './pages/Verify'
import Gallery from './pages/Gallery'
import ProtectedRoute from './components/ProtectedRoute'
import NotFound from './pages/NotFound'

const App = () => {
  return (
    <div className='mx-4 sm:mx-[10%]'>
      <ToastContainer />
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path='/' element={<Home />} />
        <Route path='/doctors' element={<Doctors />} />
        <Route path='/gallery' element={<Gallery />} />
        <Route path='/doctors/:speciality' element={<Doctors />} />
        <Route path='/login' element={<Login />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        
        {/* Protected Routes */}
        <Route path='/appointment/:docId' element={
          <ProtectedRoute>
            <Appointment />
          </ProtectedRoute>
        } />
        <Route path='/my-appointments' element={
          <ProtectedRoute>
            <MyAppointments />
          </ProtectedRoute>
        } />
        <Route path='/my-profile' element={
          <ProtectedRoute>
            <MyProfile />
          </ProtectedRoute>
        } />
        <Route path='/verify' element={
          <ProtectedRoute>
            <Verify />
          </ProtectedRoute>
        } />
        
        {/* 404 Route */}
        <Route path='*' element={<NotFound />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App