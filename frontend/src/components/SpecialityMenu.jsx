import React from 'react'
import { specialityData } from '../assets/assets'
import { Link } from 'react-router-dom'

const SpecialityMenu = () => {
    return (
        <div id='speciality' className='flex flex-col items-center gap-4 py-16 text-[#262626]'>
            <h1 className='text-3xl font-medium'>Pick your package based on your Breed Size</h1>
            <p className='sm:w-1/3 text-center text-sm'>Simply browse through our extensive list of breeds, schedule your appointment hassle-free.</p>
            <div className='flex sm:justify-center gap-4 pt-5 w-full overflow-scroll '>
                {specialityData.map((item, index) => (
                    <Link to={`/doctors/${item.speciality}`} onClick={() => scrollTo(0, 0)} className='flex flex-col items-center text-xs cursor-pointer flex-shrink-0 hover:translate-y-[-10px] transition-all duration-500' key={index}>
                        <img 
                            className='w-28 h-28 sm:w-36 sm:h-36 mb-2 rounded-full object-cover' 
                            src={item.image} 
                            alt="" 
                        />
                        <p>{item.speciality}</p>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default SpecialityMenu