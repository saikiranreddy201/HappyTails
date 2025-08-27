// Frontend Route Constants
export const ROUTES = {
  // Public Routes
  HOME: '/',
  LOGIN: '/login',
  ABOUT: '/about',
  CONTACT: '/contact',
  DOCTORS: '/doctors',
  GALLERY: '/gallery',
  
  // Dynamic Public Routes
  DOCTORS_BY_SPECIALITY: (speciality) => `/doctors/${speciality}`,
  
  // Protected Routes
  MY_PROFILE: '/my-profile',
  MY_APPOINTMENTS: '/my-appointments',
  APPOINTMENT: (docId) => `/appointment/${docId}`,
  VERIFY: '/verify',
  
  // Future Grooming Routes (for transformation)
  SERVICES: '/services',
  SERVICES_BY_CATEGORY: (category) => `/services/${category}`,
  BOOKING: '/booking',
  BOOKING_DETAILS: (id) => `/booking/${id}`,
}

// Admin Panel Route Constants
export const ADMIN_ROUTES = {
  ROOT: '/',
  
  // Admin Only
  ADMIN_DASHBOARD: '/admin-dashboard',
  ALL_APPOINTMENTS: '/all-appointments',
  ADD_DOCTOR: '/add-doctor',
  DOCTOR_LIST: '/doctor-list',
  
  // Doctor Only
  DOCTOR_DASHBOARD: '/doctor-dashboard',
  DOCTOR_APPOINTMENTS: '/doctor-appointments',
  DOCTOR_PROFILE: '/doctor-profile',
  
  // Future Admin Routes (for grooming transformation)
  ADD_GROOMER: '/add-groomer',
  GROOMER_LIST: '/groomer-list',
  SERVICES_MANAGEMENT: '/services-management',
  BOOKING_MANAGEMENT: '/booking-management',
}

// API Route Constants
export const API_ROUTES = {
  BASE_URL: process.env.VITE_BACKEND_URL || 'http://localhost:4000',
  
  // User Routes
  USER: {
    LOGIN: '/api/user/login',
    REGISTER: '/api/user/register',
    SEND_OTP: '/api/user/send-otp',
    VERIFY_OTP: '/api/user/verify-otp-signup',
    GET_PROFILE: '/api/user/get-profile',
    UPDATE_PROFILE: '/api/user/update-profile',
    BOOK_APPOINTMENT: '/api/user/book-appointment',
    LIST_APPOINTMENTS: '/api/user/appointments',
    CANCEL_APPOINTMENT: '/api/user/cancel-appointment',
    PAYMENT_RAZORPAY: '/api/user/payment-razorpay',
    VERIFY_RAZORPAY: '/api/user/verifyRazorpay',
    PAYMENT_STRIPE: '/api/user/payment-stripe',
    VERIFY_STRIPE: '/api/user/verifyStripe',
  },
  
  // Doctor Routes
  DOCTOR: {
    LIST: '/api/doctor/list',
    LOGIN: '/api/doctor/login',
    APPOINTMENTS: '/api/doctor/appointments',
    CANCEL_APPOINTMENT: '/api/doctor/cancel-appointment',
    CHANGE_AVAILABILITY: '/api/doctor/change-availability',
    COMPLETE_APPOINTMENT: '/api/doctor/complete-appointment',
    DASHBOARD: '/api/doctor/dashboard',
    PROFILE: '/api/doctor/profile',
    UPDATE_PROFILE: '/api/doctor/update-profile',
  },
  
  // Pet Routes
  PET: {
    BASE: '/api/pet',
    GET_ALL: '/api/pet',
    GET_BY_ID: (id) => `/api/pet/${id}`,
    CREATE: '/api/pet',
    UPDATE: (id) => `/api/pet/${id}`,
    DELETE: (id) => `/api/pet/${id}`,
  },
  
  // Admin Routes
  ADMIN: {
    LOGIN: '/api/admin/login',
    ADD_DOCTOR: '/api/admin/add-doctor',
    ALL_DOCTORS: '/api/admin/all-doctors',
    DELETE_DOCTOR: '/api/admin/delete-doctor',
    APPOINTMENTS: '/api/admin/appointments',
    CANCEL_APPOINTMENT: '/api/admin/cancel-appointment',
    CHANGE_AVAILABILITY: '/api/admin/change-availability',
    DASHBOARD: '/api/admin/dashboard',
  }
}

export default ROUTES