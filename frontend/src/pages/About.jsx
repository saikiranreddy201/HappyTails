import React from 'react'
import { assets } from '../assets/assets'

const About = () => {
  return (
    <div>

      <div className='text-center text-2xl pt-10 text-[#707070]'>
        <p>ABOUT <span className='text-gray-700 font-semibold'>US</span></p>
      </div>

      <div className='my-10 flex flex-col md:flex-row gap-12'>
        <img className='w-full md:max-w-[360px]' src={assets.Medium_Breed} alt="" />
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600'>
          <p>Welcome to Happy Tails, your trusted partner in convenient and professional at-home pet grooming services. At Paws & Co, we understand how important your pet's well-being is, and we strive to make grooming easier and more comfortable for both you and your furry friend.</p>
          <p>Our commitment at Paws & Co is to provide the highest level of care and convenience. We bring expert grooming services directly to your home, ensuring a stress-free and comfortable experience for your pet. Whether it's a routine trim, a full grooming session, or specialized care, we're here to meet your pet's grooming needs with professionalism and love.</p>
          <b className='text-gray-800'>Our Vision</b>
          <p>At happy Tails, our vision is to create an effortless and enjoyable grooming experience for every pet. We aim to make grooming simple and accessible by bringing quality care directly to your door, allowing your pet to feel pampered and cared for in the comfort of their own home.</p>
        </div>
      </div>

      <div className='text-xl my-4'>
        <p>WHY  <span className='text-gray-700 font-semibold'>CHOOSE US</span></p>
      </div>

      <div className='flex flex-col md:flex-row mb-20'>
        <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
          <b>EFFICIENCY:</b>
          <p>Streamlined appointment scheduling that fits into your busy lifestyle.</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
          <b>CONVENIENCE: </b>
          <p>Access to a network of trusted healthcare professionals in your area.</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
          <b>PERSONALIZATION:</b>
          <p >Tailored recommendations and reminders to help you stay on top of your health.</p>
        </div>
      </div>

    </div>
  )
}

export default About
