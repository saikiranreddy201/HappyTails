import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'

// Icons
const UserIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
const PhoneIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
const MailIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
const MapPinIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
const CalendarIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
const GenderIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
const PlusIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
const EditIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
const SaveIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
const XIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
const TrashIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
const HeartIcon = () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg>
const CameraIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>

const MyProfile = () => {
  const { token, backendUrl, userData, setUserData, loadUserProfileData, pets, addPet, updatePet, deletePet } = useContext(AppContext)
  
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [isAddingPet, setIsAddingPet] = useState(false)
  const [editingPetId, setEditingPetId] = useState(null)
  const [image, setImage] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  const [newPet, setNewPet] = useState({
    name: "",
    breed: "",
    age: "",
    weight: "",
    gender: "Male",
    image: null
  })

  const handleSaveProfile = async () => {
    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append('name', userData.name)
      formData.append('phone', userData.phone || '')
      formData.append('address', JSON.stringify(userData.address))
      formData.append('gender', userData.gender || 'Not Selected')
      formData.append('dob', userData.dob || 'Not Selected')
      
      if (image) {
        formData.append('image', image)
      }

      const { data } = await axios.post(backendUrl + '/api/user/update-profile', formData, { headers: { token } })
      
      if (data.success) {
        toast.success(data.message)
        await loadUserProfileData()
        setIsEditingProfile(false)
        setImage(false)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddPet = async () => {
    if (newPet.name && newPet.breed) {
      const success = await addPet(newPet)
      if (success) {
        setNewPet({ name: "", breed: "", age: "", weight: "", gender: "Male", image: null })
        setIsAddingPet(false)
      }
    }
  }

  const handleDeletePet = async (petId) => {
    if (window.confirm('Are you sure you want to delete this pet?')) {
      await deletePet(petId)
    }
  }

  const handleEditPet = (pet) => {
    setEditingPetId(pet.id)
    setNewPet({ 
      name: pet.name,
      breed: pet.breed, 
      age: pet.age,
      weight: pet.weight,
      gender: pet.gender,
      image: null 
    })
  }

  const handleSavePet = async () => {
    const success = await updatePet(editingPetId, newPet)
    if (success) {
      setNewPet({ name: "", breed: "", age: "", weight: "", gender: "Male", image: null })
      setEditingPetId(null)
    }
  }

  return userData ? (
    <div className='min-h-[80vh] flex items-start justify-center p-4 bg-gray-50'>
      <div className='w-full max-w-6xl'>
        {/* Header */}
        <div className='text-center mb-8'>
          <h1 className='text-3xl font-bold text-gray-800 mb-2'>My Profile</h1>
          <p className='text-gray-600'>Manage your account and pet information</p>
        </div>

        <div className='grid lg:grid-cols-2 gap-8'>
          {/* Profile Section */}
          <div className='bg-white rounded-xl shadow-lg border border-gray-200 p-8'>
            <div className='text-center mb-6'>
              <div className='relative inline-block'>
                {isEditingProfile ? (
                  <label htmlFor="image" className="cursor-pointer">
                    <img 
                      src={image ? URL.createObjectURL(image) : userData.image} 
                      alt="Profile" 
                      className="w-28 h-28 rounded-full object-cover border-4 border-blue-100 opacity-75 hover:opacity-100 transition-opacity"
                    />
                    <div className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-2 text-white hover:bg-blue-600 transition-colors">
                      <CameraIcon />
                    </div>
                    <input onChange={(e) => setImage(e.target.files[0])} type="file" id="image" hidden accept="image/*" />
                  </label>
                ) : (
                  <img 
                    src={userData.image} 
                    alt="Profile" 
                    className="w-28 h-28 rounded-full object-cover border-4 border-blue-100"
                  />
                )}
              </div>
              
              {isEditingProfile ? (
                <input 
                  type="text" 
                  value={userData.name}
                  onChange={(e) => setUserData({...userData, name: e.target.value})}
                  className="text-2xl font-bold text-center border-b-2 border-blue-200 bg-transparent mt-4 w-full focus:outline-none focus:border-blue-500 transition-colors"
                />
              ) : (
                <h2 className="text-2xl font-bold text-gray-800 mt-4">{userData.name}</h2>
              )}
            </div>

            <div className='space-y-4'>
              {/* Email */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Email Address
                </label>
                <div className='flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200'>
                  <MailIcon className="text-blue-500" />
                  <span className="text-gray-700">{userData.email}</span>
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Phone Number
                </label>
                <div className='flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200'>
                  <PhoneIcon className="text-green-500" />
                  {isEditingProfile ? (
                    <input 
                      type="text" 
                      value={userData.phone || ''}
                      onChange={(e) => setUserData({...userData, phone: e.target.value})}
                      placeholder="Enter your phone number"
                      className="flex-1 bg-transparent border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1 transition-colors"
                    />
                  ) : (
                    <span className="text-gray-700">{userData.phone || 'Not provided'}</span>
                  )}
                </div>
              </div>

              {/* Date of Birth */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Date of Birth
                </label>
                <div className='flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200'>
                  <CalendarIcon className="text-purple-500" />
                  {isEditingProfile ? (
                    <input 
                      type="date" 
                      value={userData.dob === 'Not Selected' ? '' : userData.dob}
                      onChange={(e) => setUserData({...userData, dob: e.target.value})}
                      className="flex-1 bg-transparent border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1 transition-colors"
                    />
                  ) : (
                    <span className="text-gray-700">{userData.dob === 'Not Selected' ? 'Not provided' : userData.dob}</span>
                  )}
                </div>
              </div>

              {/* Gender */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Gender
                </label>
                <div className='flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200'>
                  <GenderIcon className="text-indigo-500" />
                  {isEditingProfile ? (
                    <select 
                      value={userData.gender || 'Not Selected'}
                      onChange={(e) => setUserData({...userData, gender: e.target.value})}
                      className="flex-1 bg-transparent border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1 transition-colors"
                    >
                      <option value="Not Selected">Not Selected</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  ) : (
                    <span className="text-gray-700">{userData.gender || 'Not Selected'}</span>
                  )}
                </div>
              </div>
              
              {/* Address */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Address
                </label>
                <div className='p-3 bg-gray-50 rounded-lg border border-gray-200'>
                  <div className="flex items-start space-x-3">
                    <MapPinIcon className="text-red-500 mt-1" />
                    <div className="flex-1 space-y-2">
                      {isEditingProfile ? (
                        <>
                          <input 
                            type="text" 
                            value={userData.address?.line1 || ''}
                            onChange={(e) => setUserData({...userData, address: {...(userData.address || {}), line1: e.target.value}})}
                            placeholder="Address Line 1"
                            className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                          />
                          <input 
                            type="text" 
                            value={userData.address?.line2 || ''}
                            onChange={(e) => setUserData({...userData, address: {...(userData.address || {}), line2: e.target.value}})}
                            placeholder="Address Line 2"
                            className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                          />
                        </>
                      ) : (
                        <div className="text-gray-700">
                          {userData.address?.line1 ? (
                            <>
                              <div>{userData.address.line1}</div>
                              {userData.address.line2 && <div>{userData.address.line2}</div>}
                            </>
                          ) : (
                            <div>Not provided</div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Action Buttons */}
            <div className="mt-6">
              {isEditingProfile ? (
                <div className="flex space-x-3">
                  <button 
                    onClick={handleSaveProfile}
                    disabled={isLoading}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                  >
                    <SaveIcon />
                    <span>{isLoading ? 'Saving...' : 'Save Changes'}</span>
                  </button>
                  <button 
                    onClick={() => {
                      setIsEditingProfile(false)
                      setImage(false)
                      loadUserProfileData() // Reset changes
                    }}
                    disabled={isLoading}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    <XIcon />
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setIsEditingProfile(true)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  <EditIcon />
                  <span>Edit Profile</span>
                </button>
              )}
            </div>
          </div>

          {/* Pets Section */}
          <div className='bg-white rounded-xl shadow-lg border border-gray-200 p-8'>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-pink-100 rounded-lg">
                  <HeartIcon className="text-pink-500" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">My Pets</h3>
                  <p className="text-sm text-gray-600">{pets.length} pet{pets.length !== 1 ? 's' : ''} registered</p>
                </div>
              </div>
              <button 
                onClick={() => setIsAddingPet(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 font-medium"
              >
                <PlusIcon />
                <span>Add Pet</span>
              </button>
            </div>

            {/* Add/Edit Pet Form */}
            {(isAddingPet || editingPetId) && (
              <div className="mb-6 bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <h4 className="text-xl font-bold text-gray-800 mb-4">
                  {editingPetId ? 'Edit Pet Information' : 'Add New Pet'}
                </h4>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>
                        Pet Name *
                      </label>
                      <input 
                        type="text" 
                        placeholder="Enter pet name"
                        value={newPet.name}
                        onChange={(e) => setNewPet({...newPet, name: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>
                        Breed *
                      </label>
                      <input 
                        type="text" 
                        placeholder="Enter pet breed"
                        value={newPet.breed}
                        onChange={(e) => setNewPet({...newPet, breed: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>
                        Age
                      </label>
                      <input 
                        type="text" 
                        placeholder="e.g. 3 years"
                        value={newPet.age}
                        onChange={(e) => setNewPet({...newPet, age: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>
                        Weight
                      </label>
                      <input 
                        type="text" 
                        placeholder="e.g. 25 lbs"
                        value={newPet.weight}
                        onChange={(e) => setNewPet({...newPet, weight: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>
                        Gender
                      </label>
                      <select 
                        value={newPet.gender}
                        onChange={(e) => setNewPet({...newPet, gender: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>
                        Pet Photo (optional)
                      </label>
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => setNewPet({...newPet, image: e.target.files[0]})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-4 file:py-1 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-colors"
                      />
                    </div>
                  </div>
                  <div className="flex space-x-3 pt-2">
                    <button 
                      onClick={editingPetId ? handleSavePet : handleAddPet}
                      disabled={!newPet.name || !newPet.breed}
                      className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                    >
                      <SaveIcon />
                      <span>{editingPetId ? 'Update Pet' : 'Add Pet'}</span>
                    </button>
                    <button 
                      onClick={() => {
                        setIsAddingPet(false)
                        setEditingPetId(null)
                        setNewPet({ name: "", breed: "", age: "", weight: "", gender: "Male", image: null })
                      }}
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Pets Grid */}
            {pets.length > 0 ? (
              <div className="grid gap-4">
                {pets.map((pet) => (
                  <div key={pet.id || pet._id} className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <img 
                          src={pet.image || "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=60&h=60&fit=crop&crop=face"} 
                          alt={pet.name}
                          className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-sm"
                        />
                        <div>
                          <h4 className="text-lg font-bold text-gray-800">{pet.name}</h4>
                          <p className="text-gray-600">{pet.breed}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                            {pet.age && <span>Age: <span className="font-medium text-gray-700">{pet.age}</span></span>}
                            {pet.weight && <span>Weight: <span className="font-medium text-gray-700">{pet.weight}</span></span>}
                            <span>Gender: <span className="font-medium text-gray-700">{pet.gender}</span></span>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleEditPet(pet)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Edit pet"
                        >
                          <EditIcon />
                        </button>
                        <button 
                          onClick={() => handleDeletePet(pet.id || pet._id)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                          title="Delete pet"
                        >
                          <TrashIcon />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <HeartIcon className="text-gray-400" />
                </div>
                <h4 className="text-lg font-medium text-gray-800 mb-2">No pets added yet</h4>
                <p className="text-gray-600 mb-4">Add your furry friends to get started with grooming appointments!</p>
                <button 
                  onClick={() => setIsAddingPet(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors inline-flex items-center space-x-2 font-medium"
                >
                  <PlusIcon />
                  <span>Add Your First Pet</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  ) : null
}

export default MyProfile