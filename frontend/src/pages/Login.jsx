// import React, { useContext, useEffect, useState } from 'react'
// import { AppContext } from '../context/AppContext'
// import axios from 'axios'
// import { toast } from 'react-toastify'
// import { useNavigate } from 'react-router-dom'

// const Login = () => {

//   const [state, setState] = useState('Sign Up')

//   const [name, setName] = useState('')
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')

//   const navigate = useNavigate()
//   const { backendUrl, token, setToken } = useContext(AppContext)

//   const onSubmitHandler = async (event) => {
//     event.preventDefault();

//     if (state === 'Sign Up') {

//       const { data } = await axios.post(backendUrl + '/api/user/register', { name, email, password })

//       if (data.success) {
//         localStorage.setItem('token', data.token)
//         setToken(data.token)
//       } else {
//         toast.error(data.message)
//       }

//     } else {

//       const { data } = await axios.post(backendUrl + '/api/user/login', { email, password })

//       if (data.success) {
//         localStorage.setItem('token', data.token)
//         setToken(data.token)
//       } else {
//         toast.error(data.message)
//       }

//     }

//   }

//   useEffect(() => {
//     if (token) {
//       navigate('/')
//     }
//   }, [token])

//   return (
//     <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center'>
//       <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg'>
//         <p className='text-2xl font-semibold'>{state === 'Sign Up' ? 'Create Account' : 'Login'}</p>
//         <p>Please {state === 'Sign Up' ? 'sign up' : 'log in'} to book appointment</p>
//         {state === 'Sign Up'
//           ? <div className='w-full '>
//             <p>Full Name</p>
//             <input onChange={(e) => setName(e.target.value)} value={name} className='border border-[#DADADA] rounded w-full p-2 mt-1' type="text" required />
//           </div>
//           : null
//         }
//         <div className='w-full '>
//           <p>Email/Phone no</p>
//           <input onChange={(e) => setEmail(e.target.value)} value={email} className='border border-[#DADADA] rounded w-full p-2 mt-1' type="email" required />
//         </div>
//         <div className='w-full '>
//           <p>Password</p>
//           <input onChange={(e) => setPassword(e.target.value)} value={password} className='border border-[#DADADA] rounded w-full p-2 mt-1' type="password" required />
//         </div>
//         <button className='bg-primary text-white w-full py-2 my-2 rounded-md text-base'>{state === 'Sign Up' ? 'Create account' : 'Login'}</button>
//         {state === 'Sign Up'
//           ? <p>Already have an account? <span onClick={() => setState('Login')} className='text-primary underline cursor-pointer'>Login here</span></p>
//           : <p>Create an new account? <span onClick={() => setState('Sign Up')} className='text-primary underline cursor-pointer'>Click here</span></p>
//         }
//       </div>
//     </form>
//   )
// }

// export default Login

// import React, { useState, useContext } from 'react'
// import { AppContext } from '../context/AppContext'
// import axios from 'axios'
// import { toast } from 'react-toastify'
// import { useNavigate } from 'react-router-dom'

// const Login = () => {
//   const [step, setStep] = useState(1) // 1 = enter details, 2 = enter OTP
//   const [name, setName] = useState('')
//   const [identifier, setIdentifier] = useState('') // email or phone
//   const [password, setPassword] = useState('')
//   const [otp, setOtp] = useState('')
//   const [otpToken, setOtpToken] = useState('') // temporary token to validate OTP

//   const { backendUrl, setToken } = useContext(AppContext)
//   const navigate = useNavigate()

//   // Step 1: send OTP
//   const sendOtp = async () => {
//     try {
//       const { data } = await axios.post(`${backendUrl}/api/user/send-otp`, { identifier })
//       if (data.success) {
//         toast.success('OTP sent!')
//         setOtpToken(data.otpToken)
//         setStep(2)
//       } else {
//         toast.error(data.message)
//       }
//     } catch (err) {
//       console.error(err)
//       toast.error('Error sending OTP')
//     }
//   }

//   // Step 2: verify OTP and create account
//   const verifyOtpAndSignUp = async () => {
//     try {
//       const { data } = await axios.post(`${backendUrl}/api/user/verify-otp-signup`, {
//         name,
//         identifier,
//         password,
//         otp,
//         otpToken,
//       })
//       if (data.success) {
//         toast.success('Account created successfully!')
//         localStorage.setItem('token', data.token)
//         setToken(data.token)
//         navigate('/')
//       } else {
//         toast.error(data.message)
//       }
//     } catch (err) {
//       console.error(err)
//       toast.error('Error verifying OTP')
//     }
//   }

//   const onSubmitHandler = (e) => {
//     e.preventDefault()
//     if (step === 1) sendOtp()
//     else verifyOtpAndSignUp()
//   }

//   return (
//     <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center'>
//       <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg'>
//         <p className='text-2xl font-semibold'>Sign Up</p>

//         {step === 1 && (
//           <>
//             <div className='w-full'>
//               <p>Full Name</p>
//               <input
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 className='border border-[#DADADA] rounded w-full p-2 mt-1'
//                 type="text"
//                 required
//               />
//             </div>
//             <div className='w-full'>
//               <p>Email / Phone</p>
//               <input
//                 value={identifier}
//                 onChange={(e) => setIdentifier(e.target.value)}
//                 className='border border-[#DADADA] rounded w-full p-2 mt-1'
//                 type="text"
//                 required
//               />
//             </div>
//             <div className='w-full'>
//               <p>Password</p>
//               <input
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className='border border-[#DADADA] rounded w-full p-2 mt-1'
//                 type="password"
//                 required
//               />
//             </div>
//             <button className='bg-primary text-white w-full py-2 my-2 rounded-md text-base'>
//               Send OTP
//             </button>
//           </>
//         )}

//         {step === 2 && (
//           <>
//             <p>An OTP has been sent to your email/phone. Enter it below:</p>
//             <div className='w-full'>
//               <p>OTP</p>
//               <input
//                 value={otp}
//                 onChange={(e) => setOtp(e.target.value)}
//                 className='border border-[#DADADA] rounded w-full p-2 mt-1'
//                 type="text"
//                 required
//               />
//             </div>
//             <button className='bg-primary text-white w-full py-2 my-2 rounded-md text-base'>
//               Verify OTP & Sign Up
//             </button>
//           </>
//         )}
//       </div>
//     </form>
//   )
// }

// export default Login

import React, { useState, useContext } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const [step, setStep] = useState(1) // 1 = login, 2 = sign up, 3 = OTP verification
  const [name, setName] = useState('') // For sign up
  const [identifier, setIdentifier] = useState('') // email/phone
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [otpToken, setOtpToken] = useState('') // temp token to validate OTP

  const { backendUrl, setToken } = useContext(AppContext)
  const navigate = useNavigate()

  // Step 1: Submit Login credentials
  const submitLogin = async () => {
    console.log("logging with data:")
    try {
      const { data } = await axios.post(`${backendUrl}/api/user/login`, { identifier, password })
      if (data.success) {
        localStorage.setItem('token', data.token)
        setToken(data.token)
        navigate('/')
      } else {
        toast.error(data.message)
      }
    } catch (err) {
      console.error(err)
      toast.error('Error logging in')
    }
  }

  // Step 2: Send OTP (for Sign Up)
  const signUp = async () => {
    console.log("sending OTP with data:")
    try {
      const { data } = await axios.post(`${backendUrl}/api/user/send-otp`, { identifier })
      if (data.success) {
        toast.success('OTP sent!')
        setOtpToken(data.otpToken) // store the OTP token temporarily
        setStep(3)
      } else {
        toast.error(data.message)
      }
    } catch (err) {
      console.error(err)
      toast.error('Error sending OTP')
    }
  }

  // Step 3: Verify OTP and create account
  const verifyOtpAndSignUp = async () => {
    console.log("Verifying OTP with data:")
    try {
      const { data } = await axios.post(`${backendUrl}/api/user/verify-otp-signup`, {
        name,
        identifier,
        password,
        otp,
        otpToken,
      })
      if (data.success) {
        toast.success('Account created successfully!')
        localStorage.setItem('token', data.token)
        setToken(data.token)
        navigate('/')
      } else {
        toast.error(data.message)
      }
    } catch (err) {
      console.error(err)
      toast.error('Error verifying OTP')
    }
  }

  const onSubmitHandler = (e) => {
    e.preventDefault()
    console.log("Current step:", step)
    if (step === 1) {
      submitLogin()
    } else if (step === 2) {
      signUp()
    } else {
      verifyOtpAndSignUp()
    }
  }

  return (
    <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center'>
      <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg'>
        <p className='text-2xl font-semibold'>{step === 1 ? 'Login' : 'Sign Up'}</p>

        {step === 1 && (
          <>
            <div className='w-full'>
              <p>Email / Phone</p>
              <input
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className='border border-[#DADADA] rounded w-full p-2 mt-1'
                type="text"
                required
              />
            </div>
            <div className='w-full'>
              <p>Password</p>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='border border-[#DADADA] rounded w-full p-2 mt-1'
                type="password"
                required
              />
            </div>
            <button className='bg-primary text-white w-full py-2 my-2 rounded-md text-base'>
              Login
            </button>
            <p>
              Don't have an account? <span onClick={() => setStep(2)} className='text-primary underline cursor-pointer'>Sign Up</span>
            </p>
          </>
        )}

        {step === 2 && (
          <>
            <div className='w-full'>
              <p>Full Name</p>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className='border border-[#DADADA] rounded w-full p-2 mt-1'
                type="text"
                required
              />
            </div>
            <div className='w-full'>
              <p>Email / Phone</p>
              <input
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className='border border-[#DADADA] rounded w-full p-2 mt-1'
                type="text"
                required
              />
            </div>
            <div className='w-full'>
              <p>Password</p>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='border border-[#DADADA] rounded w-full p-2 mt-1'
                type="password"
                required
              />
            </div>
            <button className='bg-primary text-white w-full py-2 my-2 rounded-md text-base'>
              Sign Up
            </button>
            <p>
              Already have an account? <span onClick={() => setStep(1)} className='text-primary underline cursor-pointer'>Login</span>
            </p>
          </>
        )}

        {step === 3 && (
          <>
            <p>An OTP has been sent to your email/phone. Enter it below:</p>
            <div className='w-full'>
              <p>OTP</p>
              <input
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className='border border-[#DADADA] rounded w-full p-2 mt-1'
                type="text"
                required
              />
            </div>
            <button className='bg-primary text-white w-full py-2 my-2 rounded-md text-base'>
              Verify OTP & Sign Up
            </button>
            <p>
              Already have an account? <span onClick={() => setStep(1)} className='text-primary underline cursor-pointer'>Login</span>
            </p>
          </>
        )}
      </div>
    </form>
  )
}

export default Login
