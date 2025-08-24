// import React, { useContext, useEffect } from 'react'
// import { AdminContext } from '../../context/AdminContext'

// const DoctorsList = () => {

//   const { doctors, changeAvailability , aToken , getAllDoctors} = useContext(AdminContext)

//   useEffect(() => {
//     if (aToken) {
//         getAllDoctors()
//     }
// }, [aToken])

//   return (
//     <div className='m-5 max-h-[90vh] overflow-y-scroll'>
//       <h1 className='text-lg font-medium'>All Doctors</h1>
//       <div className='w-full flex flex-wrap gap-4 pt-5 gap-y-6'>
//         {doctors.map((item, index) => (
//           <div className='border border-[#C9D8FF] rounded-xl max-w-56 overflow-hidden cursor-pointer group' key={index}>
//             <img className='bg-[#EAEFFF] group-hover:bg-primary transition-all duration-500' src={item.image} alt="" />
//             <div className='p-4'>
//               <p className='text-[#262626] text-lg font-medium'>{item.name}</p>
//               <p className='text-[#5C5C5C] text-sm'>{item.speciality}</p>
//               <div className='mt-2 flex items-center gap-1 text-sm'>
//                 <input onChange={()=>changeAvailability(item._id)} type="checkbox" checked={item.available} />
//                 <p>Available</p>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }

// export default DoctorsList

import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'
import axios from 'axios'

const DoctorsList = () => {
  const { doctors, changeAvailability, aToken, getAllDoctors } = useContext(AdminContext)

  const { backendUrl } = useContext(AppContext)
  
  useEffect(() => {
    if (aToken) {
      getAllDoctors()
    }
  }, [aToken])

  // Function to delete a doctor
  const deleteDoctor = async (doctorId) => {
    try {
      console.log("Doctor ID to delete:", doctorId);

      // const response = await axios.delete(backendUrl + `/api/admin/delete-doctor`, {doctorId}, { headers: { aToken } })
      // const response = await axios.delete(`${backendUrl}/api/admin/delete-doctor`, {
      //   data: { doctorId },  // Pass doctorId inside data
      //   headers: { Authorization: aToken }, // Make sure to include the token as Authorization header
      // })
      // Send doctorId in the request body
      const {response} = await axios.delete(backendUrl + '/api/admin/delete-doctor', {
        headers: { atoken: aToken },  // Change Authorization header to atoken
        data: { doctorId }
      });

      if (response.success) {
        alert('Doctor deleted successfully!')
        getAllDoctors()
      } else {
        alert('Failed to delete the doctor.')
      }
    } catch (error) {
      console.error('Error deleting doctor:', error)
      alert('An error occurred while deleting the doctor.')
    }
  }

  return (
    <div className='m-5 max-h-[90vh] overflow-y-scroll'>
      <h1 className='text-lg font-medium'>All Doctors</h1>
      <div className='w-full flex flex-wrap gap-4 pt-5 gap-y-6'>
        {doctors.map((item, index) => (
          <div
            className='border border-[#C9D8FF] rounded-xl max-w-56 overflow-hidden cursor-pointer group'
            key={index}
          >
            <img
              className='bg-[#EAEFFF] group-hover:bg-primary transition-all duration-500'
              src={item.image}
              alt=""
            />
            <div className='p-4'>
              <p className='text-[#262626] text-lg font-medium'>{item.name}</p>
              <p className='text-[#5C5C5C] text-sm'>{item.speciality}</p>
              <div className='mt-2 flex items-center gap-1 text-sm'>
                <input
                  onChange={() => changeAvailability(item._id)}
                  type="checkbox"
                  checked={item.available}
                />
                <p>Available</p>
              </div>
              <button
                onClick={() => deleteDoctor(`${item._id}`) || console.log("hey this is the id")}
                className='bg-red-500 text-white px-4 py-2 rounded mt-4 hover:bg-red-600 transition-all'
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DoctorsList