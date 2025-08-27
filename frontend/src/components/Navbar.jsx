import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { NavLink, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

// Icons
const UserIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
const CalendarIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
const LogoutIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
const ChevronDownIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>

const Navbar = () => {

  const navigate = useNavigate()

  const [showMenu, setShowMenu] = useState(false)
  const { token, setToken, userData } = useContext(AppContext)

  const logout = () => {
    localStorage.removeItem('token')
    setToken(false)
    navigate('/login')
  }

  return (
    <div className='flex items-center justify-between text-sm py-4 mb-5 border-b border-b-[#ADADAD]'>
      {/* <img onClick={() => navigate('/')} className='w-24 cursor-pointer' src={assets.new_logo} alt="" /> */}
      <div onClick={() => navigate('/')} className='w-30 cursor-pointer text-2xl' alt="">Happy Tails</div>
      <ul className='md:flex items-start gap-5 font     -medium hidden'>
        <NavLink to='/' >
          <li className='py-1'>HOME</li>
          <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
        </NavLink>
        <NavLink to='/doctors' >
          <li className='py-1'>ALL BREEDS</li>
          <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
        </NavLink>
        <NavLink to='/gallery' >
          <li className='py-1'>GALLERY</li>
          <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
        </NavLink>
        <NavLink to='/about' >
          <li className='py-1'>ABOUT</li>
          <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
        </NavLink>
        <NavLink to='/contact' >
          <li className='py-1'>CONTACT</li>
          <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
        </NavLink>
      </ul>

      <div className='flex items-center gap-4 '>
        {
          token && userData
            ? <div className='flex items-center gap-2 cursor-pointer group relative'>
              <div className='flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors'>
                <img className='w-9 h-9 rounded-full object-cover border-2 border-blue-100' src={userData.image} alt={userData.name} />
                <div className='hidden md:block'>
                  <p className='text-sm font-medium text-gray-800 truncate max-w-24'>{userData.name}</p>
                  <p className='text-xs text-gray-500'>Pet Parent</p>
                </div>
                <ChevronDownIcon className="text-gray-400 group-hover:text-gray-600 transition-colors" />
              </div>
              
              <div className='absolute top-0 right-0 pt-16 z-20 hidden group-hover:block'>
                <div className='bg-white rounded-xl shadow-lg border border-gray-200 py-2 min-w-48 overflow-hidden'>
                  {/* User Info Header */}
                  <div className='px-4 py-3 border-b border-gray-100'>
                    <div className='flex items-center gap-3'>
                      <img className='w-10 h-10 rounded-full object-cover border-2 border-blue-100' src={userData.image} alt={userData.name} />
                      <div className='min-w-0'>
                        <p className='text-sm font-semibold text-gray-800 truncate'>{userData.name}</p>
                        <p className='text-xs text-gray-500 truncate'>{userData.email}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Menu Items */}
                  <div className='py-1'>
                    <button 
                      onClick={() => navigate('/my-profile')} 
                      className='w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors'
                    >
                      <UserIcon className="text-gray-400" />
                      <span className='font-medium'>My Profile</span>
                    </button>
                    
                    <button 
                      onClick={() => navigate('/my-appointments')} 
                      className='w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors'
                    >
                      <CalendarIcon className="text-gray-400" />
                      <span className='font-medium'>My Appointments</span>
                    </button>
                  </div>
                  
                  {/* Logout Section */}
                  <div className='border-t border-gray-100 py-1'>
                    <button 
                      onClick={logout} 
                      className='w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors'
                    >
                      <LogoutIcon className="text-red-500" />
                      <span className='font-medium'>Sign Out</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            : <button onClick={() => navigate('/login')} className='bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-light hidden md:block'>Create account</button>
        }
        <img onClick={() => setShowMenu(true)} className='w-6 md:hidden' src={assets.menu_icon} alt="" />

        {/* ---- Mobile Menu ---- */}
        <div className={`md:hidden ${showMenu ? 'fixed w-full' : 'h-0 w-0'} right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all`}>
          <div className='flex items-center justify-between px-5 py-6'>
            <img src={assets.logo} className='w-36' alt="" />
            <img onClick={() => setShowMenu(false)} src={assets.cross_icon} className='w-7' alt="" />
          </div>
          <ul className='flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium'>
            <NavLink onClick={() => setShowMenu(false)} to='/'><p className='px-4 py-2 rounded full inline-block'>HOME</p></NavLink>
            <NavLink onClick={() => setShowMenu(false)} to='/doctors' ><p className='px-4 py-2 rounded full inline-block'>ALL DOCTORS</p></NavLink>
            <NavLink onClick={() => setShowMenu(false)} to='/about' ><p className='px-4 py-2 rounded full inline-block'>ABOUT</p></NavLink>
            <NavLink onClick={() => setShowMenu(false)} to='/contact' ><p className='px-4 py-2 rounded full inline-block'>CONTACT</p></NavLink>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Navbar