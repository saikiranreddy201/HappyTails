import React, { useState, useContext, useEffect } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate, useLocation } from 'react-router-dom'

const Login = () => {
  const [step, setStep] = useState(2) // 1 = login, 2 = sign up, 3 = OTP verification, 4 = forgot password
  const [name, setName] = useState('')
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [otpToken, setOtpToken] = useState('')
  
  // UI State
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [otpTimer, setOtpTimer] = useState(0)
  
  // Validation states
  const [identifierError, setIdentifierError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [nameError, setNameError] = useState('')

  const { backendUrl, setToken, token } = useContext(AppContext)
  const navigate = useNavigate()
  const location = useLocation()

  // Get the page user was trying to access
  const from = location.state?.from?.pathname || '/'

  // Redirect if already logged in
  useEffect(() => {
    if (token) {
      navigate(from, { replace: true })
    }
  }, [token, navigate, from])

  // OTP Timer
  useEffect(() => {
    let interval = null
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer(timer => timer - 1)
      }, 1000)
    } else if (interval) {
      clearInterval(interval)
    }
    return () => clearInterval(interval)
  }, [otpTimer])

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePhone = (phone) => {
    const phoneRegex = /^\+[1-9]\d{1,14}$/
    return phoneRegex.test(phone)
  }

  const validatePassword = (password) => {
    const minLength = password.length >= 8
    const hasUpper = /[A-Z]/.test(password)
    const hasLower = /[a-z]/.test(password)
    const hasNumber = /\d/.test(password)
    const hasSpecial = /[@$!%*?&]/.test(password)
    
    return {
      isValid: minLength && hasUpper && hasLower && hasNumber && hasSpecial,
      minLength,
      hasUpper,
      hasLower,
      hasNumber,
      hasSpecial
    }
  }

  const validateName = (name) => {
    return name.trim().length >= 2
  }

  // Real-time validation
  const handleIdentifierChange = (e) => {
    const value = e.target.value
    setIdentifier(value)
    
    if (value && !validateEmail(value) && !validatePhone(value)) {
      setIdentifierError('Please enter a valid email or phone number (+country code)')
    } else {
      setIdentifierError('')
    }
  }

  const handlePasswordChange = (e) => {
    const value = e.target.value
    setPassword(value)
    
    if (step === 2 && value) {
      const validation = validatePassword(value)
      if (!validation.isValid) {
        let errors = []
        if (!validation.minLength) errors.push('8+ characters')
        if (!validation.hasUpper) errors.push('uppercase letter')
        if (!validation.hasLower) errors.push('lowercase letter')
        if (!validation.hasNumber) errors.push('number')
        if (!validation.hasSpecial) errors.push('special character')
        setPasswordError(`Password needs: ${errors.join(', ')}`)
      } else {
        setPasswordError('')
      }
    }
  }

  const handleNameChange = (e) => {
    const value = e.target.value
    setName(value)
    
    if (value && !validateName(value)) {
      setNameError('Name must be at least 2 characters')
    } else {
      setNameError('')
    }
  }

  // Reset form when switching steps
  const resetForm = () => {
    setName('')
    setIdentifier('')
    setPassword('')
    setConfirmPassword('')
    setOtp('')
    setOtpToken('')
    setIdentifierError('')
    setPasswordError('')
    setNameError('')
    setIsLoading(false)
  }

  // Step 1: Login
  const submitLogin = async () => {
    if (!identifier.trim() || !password) {
      toast.error('Please fill in all fields')
      return
    }

    if (identifierError) {
      toast.error('Please fix the validation errors')
      return
    }

    setIsLoading(true)
    try {
      const { data } = await axios.post(`${backendUrl}/api/user/login`, { 
        identifier: identifier.trim(), 
        password 
      })
      
      if (data.success) {
        localStorage.setItem('token', data.token)
        setToken(data.token)
        toast.success('Login successful!')
        navigate(from, { replace: true })
      } else {
        toast.error(data.message || 'Login failed')
      }
    } catch (err) {
      console.error('Login error:', err)
      toast.error(err.response?.data?.message || 'Error logging in')
    } finally {
      setIsLoading(false)
    }
  }

  // Step 2: Send OTP for Sign Up
  const signUp = async () => {
    if (!name.trim() || !identifier.trim() || !password || !confirmPassword) {
      toast.error('Please fill in all fields')
      return
    }

    if (nameError || identifierError || passwordError) {
      toast.error('Please fix the validation errors')
      return
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    setIsLoading(true)
    try {
      const { data } = await axios.post(`${backendUrl}/api/user/send-otp`, { 
        identifier: identifier.trim() 
      })
      
      if (data.success) {
        toast.success(`OTP sent to your ${validateEmail(identifier) ? 'email' : 'phone'}!`)
        setOtpToken(data.otpToken)
        setStep(3)
        setOtpTimer(120) // 2 minutes timer
      } else {
        toast.error(data.message || 'Failed to send OTP')
      }
    } catch (err) {
      console.error('Send OTP error:', err)
      toast.error(err.response?.data?.message || 'Error sending OTP')
    } finally {
      setIsLoading(false)
    }
  }

  // Step 3: Verify OTP
  const verifyOtpAndSignUp = async () => {
    if (!otp.trim() || otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP')
      return
    }

    setIsLoading(true)
    try {
      const { data } = await axios.post(`${backendUrl}/api/user/verify-otp-signup`, {
        name: name.trim(),
        identifier: identifier.trim(),
        password,
        otp: otp.trim(),
        otpToken,
      })
      
      if (data.success) {
        toast.success('Account created successfully!')
        localStorage.setItem('token', data.token)
        setToken(data.token)
        navigate(from, { replace: true })
      } else {
        toast.error(data.message || 'OTP verification failed')
      }
    } catch (err) {
      console.error('OTP verification error:', err)
      toast.error(err.response?.data?.message || 'Error verifying OTP')
    } finally {
      setIsLoading(false)
    }
  }

  // Resend OTP
  const resendOtp = async () => {
    setIsLoading(true)
    try {
      const { data } = await axios.post(`${backendUrl}/api/user/send-otp`, { 
        identifier: identifier.trim() 
      })
      
      if (data.success) {
        toast.success('OTP resent!')
        setOtpToken(data.otpToken)
        setOtpTimer(120)
        setOtp('')
      } else {
        toast.error(data.message || 'Failed to resend OTP')
      }
    } catch (err) {
      console.error('Resend OTP error:', err)
      toast.error('Error resending OTP')
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmitHandler = (e) => {
    e.preventDefault()
    if (isLoading) return

    if (step === 1) {
      submitLogin()
    } else if (step === 2) {
      signUp()
    } else if (step === 3) {
      verifyOtpAndSignUp()
    }
  }

  const switchStep = (newStep) => {
    if (newStep !== step) {
      resetForm()
      setStep(newStep)
    }
  }

  // Format timer display
  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className='min-h-[80vh] flex items-center justify-center p-4'>
      <div className='w-full max-w-md'>
        <form onSubmit={onSubmitHandler} className='bg-white rounded-xl shadow-lg border border-gray-200 p-8 space-y-4'>
          {/* Header */}
          <div className='text-center mb-6'>
            <h1 className='text-2xl font-semibold text-gray-800 mb-2'>
              {step === 1 ? 'Welcome Back' : step === 2 ? 'Create Account' : 'Verify OTP'}
            </h1>
            <p className='text-gray-600 text-sm'>
              {step === 1 ? 'Please sign in to your account' : 
               step === 2 ? 'Please fill in your details' : 
               'Enter the verification code sent to you'}
            </p>
          </div>

          {/* Login Form */}
          {step === 1 && (
            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Email or Phone Number
                </label>
                <input
                  value={identifier}
                  onChange={handleIdentifierChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    identifierError ? 'border-red-300' : 'border-gray-300'
                  }`}
                  type="text"
                  placeholder="Enter email or phone"
                  required
                  disabled={isLoading}
                />
                {identifierError && (
                  <p className='text-red-500 text-xs mt-1'>{identifierError}</p>
                )}
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Password
                </label>
                <div className='relative'>
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors pr-10'
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600'
                    disabled={isLoading}
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>

              <button 
                type="submit"
                disabled={isLoading || identifierError}
                className='w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-2 px-4 rounded-lg font-medium transition-colors'
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>

              <div className='text-center pt-4 border-t'>
                <p className='text-gray-600 text-sm'>
                  Don't have an account?{' '}
                  <button 
                    type="button"
                    onClick={() => switchStep(2)}
                    className='text-blue-600 hover:text-blue-700 font-medium'
                    disabled={isLoading}
                  >
                    Sign Up
                  </button>
                </p>
              </div>
            </div>
          )}

          {/* Sign Up Form */}
          {step === 2 && (
            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Full Name
                </label>
                <input
                  value={name}
                  onChange={handleNameChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    nameError ? 'border-red-300' : 'border-gray-300'
                  }`}
                  type="text"
                  placeholder="Enter your full name"
                  required
                  disabled={isLoading}
                />
                {nameError && (
                  <p className='text-red-500 text-xs mt-1'>{nameError}</p>
                )}
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Email or Phone Number
                </label>
                <input
                  value={identifier}
                  onChange={handleIdentifierChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    identifierError ? 'border-red-300' : 'border-gray-300'
                  }`}
                  type="text"
                  placeholder="Enter email or phone with country code"
                  required
                  disabled={isLoading}
                />
                {identifierError && (
                  <p className='text-red-500 text-xs mt-1'>{identifierError}</p>
                )}
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Password
                </label>
                <div className='relative'>
                  <input
                    value={password}
                    onChange={handlePasswordChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors pr-10 ${
                      passwordError ? 'border-red-300' : 'border-gray-300'
                    }`}
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600'
                    disabled={isLoading}
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
                {passwordError && (
                  <p className='text-red-500 text-xs mt-1'>{passwordError}</p>
                )}
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Confirm Password
                </label>
                <div className='relative'>
                  <input
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors pr-10 ${
                      confirmPassword && password !== confirmPassword ? 'border-red-300' : 'border-gray-300'
                    }`}
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600'
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
                {confirmPassword && password !== confirmPassword && (
                  <p className='text-red-500 text-xs mt-1'>Passwords do not match</p>
                )}
              </div>

              <button 
                type="submit"
                disabled={isLoading || nameError || identifierError || passwordError || password !== confirmPassword}
                className='w-full  bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-2 px-4 rounded-lg font-medium transition-colors'
              >
                {isLoading ? 'Sending OTP...' : 'Send Verification Code'}
              </button>

              <div className='text-center pt-4 border-t'>
                <p className='text-gray-600 text-sm'>
                  Already have an account?{' '}
                  <button 
                    type="button"
                    onClick={() => switchStep(1)}
                    className='text-blue-600 hover:text-blue-700 font-medium'
                    disabled={isLoading}
                  >
                    Sign In
                  </button>
                </p>
              </div>
            </div>
          )}

          {/* OTP Verification */}
          {step === 3 && (
            <div className='space-y-4'>
              <div className='text-center mb-4'>
                <p className='text-gray-600 text-sm'>
                  We've sent a verification code to
                </p>
                <p className='font-medium text-gray-800'>{identifier}</p>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Verification Code
                </label>
                <input
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-center text-lg tracking-widest'
                  type="text"
                  placeholder="000000"
                  maxLength="6"
                  required
                  disabled={isLoading}
                />
                <p className='text-gray-500 text-xs mt-1 text-center'>
                  Enter the 6-digit code sent to you
                </p>
              </div>

              <button 
                type="submit"
                disabled={isLoading || otp.length !== 6}
                className='w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-2 px-4 rounded-lg font-medium transition-colors'
              >
                {isLoading ? 'Verifying...' : 'Verify & Create Account'}
              </button>

              <div className='text-center pt-4 border-t'>
                {otpTimer > 0 ? (
                  <p className='text-gray-500 text-sm'>
                    Resend code in {formatTimer(otpTimer)}
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={resendOtp}
                    disabled={isLoading}
                    className='text-blue-600 hover:text-blue-700 font-medium text-sm'
                  >
                    {isLoading ? 'Sending...' : 'Resend Code'}
                  </button>
                )}
                <p className='text-gray-600 text-sm mt-2'>
                  Wrong email/phone?{' '}
                  <button 
                    type="button"
                    onClick={() => switchStep(2)}
                    className='text-blue-600 hover:text-blue-700 font-medium'
                    disabled={isLoading}
                  >
                    Go Back
                  </button>
                </p>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

export default Login