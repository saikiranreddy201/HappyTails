// import React from 'react'
// import { assets } from '../assets/assets'
// import { useNavigate } from 'react-router-dom'

// const Banner = () => {

//     const navigate = useNavigate()

//     return (
//         <div className='flex bg-primary rounded-lg  px-6 sm:px-10 md:px-14 lg:px-12 my-20 md:mx-10'>

//             {/* ------- Left Side ------- */}
//             <div className='flex-1 py-6 sm:py-8 md:py-12 lg:py-20 lg:pl-5'>
//                 <div className='text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-white'>
//                     <p>Schedule Your Appointment</p>
//                     <p className='mt-4'>With Groomers having 10+ years of professional grooming experience</p>
//                 </div>
//                 <button onClick={() => { navigate('/login'); scrollTo(0, 0) }} className='bg-white text-sm sm:text-base text-[#595959] px-8 py-3 rounded-full mt-6 hover:scale-105 transition-all '>Create account</button>
//             </div>

//             {/* ------- Right Side ------- */}
//             <div className='hidden md:block md:w-1/2 lg:w-[370px] relative'>
//                 <img className='w-full absolute bottom-0 right-0 max-w-md' src={assets.bgimage3} alt="" />
//             </div>
//         </div>
//     )
// }

// export default Banner


import React from 'react'

const Banner = () => {
    const navigate = () => {
        // This would be your actual navigate function
        console.log('Navigate to login')
    }

    return (
        <div className='relative overflow-hidden bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 rounded-3xl mx-4 md:mx-10 my-20 shadow-2xl'>
            
            {/* Animated background elements */}
            <div className='absolute inset-0 opacity-20'>
                <div className='absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl animate-pulse'></div>
                <div className='absolute bottom-10 right-20 w-40 h-40 bg-pink-300 rounded-full blur-3xl animate-pulse delay-1000'></div>
                <div className='absolute top-1/2 left-1/3 w-24 h-24 bg-yellow-200 rounded-full blur-2xl animate-pulse delay-500'></div>
            </div>

            {/* Floating paw prints */}
            <div className='absolute inset-0 pointer-events-none overflow-hidden'>
                <div className='absolute top-8 right-1/4 text-white/10 text-2xl animate-bounce delay-300'>🐾</div>
                <div className='absolute bottom-20 left-1/4 text-white/10 text-xl animate-bounce delay-700'>🐾</div>
                <div className='absolute top-1/3 right-1/3 text-white/10 text-lg animate-bounce delay-1000'>🐾</div>
            </div>

            <div className='flex relative z-10'>
                {/* Left Side */}
                <div className='flex-1 py-8 sm:py-10 md:py-14 lg:py-20 px-6 sm:px-10 md:px-14 lg:px-16'>
                    
                    {/* Main heading with gradient text */}
                    <div className='space-y-6'>
                        <div className='inline-block'>
                            <span className='bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium border border-white/30'>
                                ✨ Premium Pet Care
                            </span>
                        </div>
                        
                        <div className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight'>
                            <p className='bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent'>
                                Schedule Your
                            </p>
                            <p className='bg-gradient-to-r from-yellow-200 to-pink-200 bg-clip-text text-transparent mt-2'>
                                Dream Appointment
                            </p>
                        </div>
                        
                        <p className='text-blue-100 text-lg md:text-xl font-light leading-relaxed max-w-lg'>
                            With certified groomers having <span className='font-semibold text-yellow-200'>10+ years</span> of 
                            professional experience in making pets look absolutely stunning! 
                        </p>
                    </div>

                    {/* CTA Button with hover effects */}
                    <div className='mt-8 flex flex-col sm:flex-row gap-4'>
                        <button 
                            onClick={() => { navigate('/login'); scrollTo(0, 0) }} 
                            className='group relative bg-white text-gray-800 px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 overflow-hidden'
                        >
                            <span className='relative z-10 flex items-center justify-center gap-2'>
                                Get Started Now
                                <svg className='w-5 h-5 group-hover:translate-x-1 transition-transform' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 8l4 4m0 0l-4 4m4-4H3' />
                                </svg>
                            </span>
                            <div className='absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                        </button>
                        
                        <button className='text-white border-2 border-white/30 px-6 py-4 rounded-full font-medium hover:bg-white/10 backdrop-blur-sm transition-all duration-300'>
                            Watch Demo
                        </button>
                    </div>

                    {/* Stats */}
                    <div className='mt-12 flex gap-8'>
                        <div className='text-center'>
                            <div className='text-2xl font-bold text-yellow-200'>500+</div>
                            <div className='text-blue-100 text-sm'>Happy Pets</div>
                        </div>
                        <div className='text-center'>
                            <div className='text-2xl font-bold text-pink-200'>4.9★</div>
                            <div className='text-blue-100 text-sm'>Rating</div>
                        </div>
                        <div className='text-center'>
                            <div className='text-2xl font-bold text-green-200'>24/7</div>
                            <div className='text-blue-100 text-sm'>Support</div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Enhanced image section */}
                <div className='hidden md:block md:w-1/2 lg:w-[400px] relative'>
                    <div className='absolute inset-0 bg-gradient-to-l from-transparent via-white/5 to-white/20 rounded-r-3xl'></div>
                    
                    {/* Mock pet grooming image with enhanced styling */}
                    <div className='relative h-full flex items-end justify-center p-8'>
                        <div className='relative'>
                            {/* Decorative elements around the image */}
                            <div className='absolute -top-4 -right-4 w-8 h-8 bg-yellow-400 rounded-full animate-pulse'></div>
                            <div className='absolute -bottom-2 -left-4 w-6 h-6 bg-pink-400 rounded-full animate-pulse delay-500'></div>
                            <div className='absolute top-1/2 -right-8 w-4 h-4 bg-blue-300 rounded-full animate-pulse delay-1000'></div>
                            
                            {/* Main image placeholder with modern styling */}
                            <div className='w-80 h-96 bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 shadow-2xl overflow-hidden'>
                                <div className='w-full h-full bg-gradient-to-br from-white/20 to-transparent flex items-center justify-center'>
                                    <div className='text-white/30 text-center'>
                                        <div className='text-6xl mb-4'>🐕‍🦺</div>
                                        <div className='text-lg font-light'>Professional</div>
                                        <div className='text-xl font-semibold'>Pet Grooming</div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Floating badges */}
                            <div className='absolute -top-6 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg animate-bounce'>
                                Certified ✓
                            </div>
                            <div className='absolute -bottom-6 right-4 bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg animate-bounce delay-300'>
                                Trusted 💎
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom gradient overlay */}
            <div className='absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400'></div>
        </div>
    )
}

export default Banner