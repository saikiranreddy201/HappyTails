import React, { useContext, useState } from 'react'
import { assets } from '../../assets/assets'
import { AdminContext } from '../../context/AdminContext'
import { toast } from 'react-toastify'
import axios from 'axios'

const AddService = () => {
  const [docImg, setDocImg] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('Basic Grooming')
  const [price, setPrice] = useState('')
  const [duration, setDuration] = useState('')
  const [suitableFor, setSuitableFor] = useState([])
  const [features, setFeatures] = useState('')
  const [popular, setPopular] = useState(false)
  const [discount, setDiscount] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const { backendUrl, aToken } = useContext(AdminContext)

  const categories = [
    'Basic Grooming',
    'Premium Grooming', 
    'Spa & Wellness',
    'Nail & Paw Care',
    'Dental Care',
    'Specialty Services'
  ]

  const breedSizes = [
    'Small Breed',
    'Medium Breed', 
    'Large Breed',
    'Extra Large Breed',
    'All Breeds'
  ]

  const handleSuitableForChange = (breed) => {
    setSuitableFor(prev => 
      prev.includes(breed) 
        ? prev.filter(b => b !== breed)
        : [...prev, breed]
    )
  }

  const onSubmitHandler = async (event) => {
    event.preventDefault()
    setIsLoading(true)

    try {
      if (!docImg) {
        toast.error('Image Not Selected')
        setIsLoading(false)
        return
      }

      if (!name || !description || !price || !duration) {
        toast.error('Please fill all required fields')
        setIsLoading(false)
        return
      }

      const formData = new FormData()
      formData.append('image', docImg)
      formData.append('name', name)
      formData.append('description', description)
      formData.append('category', category)
      formData.append('price', price)
      formData.append('duration', duration)
      formData.append('popular', popular)
      formData.append('discount', discount || 0)
      
      // Add suitable for breeds
      suitableFor.forEach(breed => {
        formData.append('suitableFor', breed)
      })

      // Add features (comma-separated string)
      formData.append('features', features)

      const { data } = await axios.post(backendUrl + '/api/service/add', formData, {
        headers: { aToken }
      })

      if (data.success) {
        toast.success(data.message)
        // Reset form
        setDocImg(false)
        setName('')
        setDescription('')
        setCategory('Basic Grooming')
        setPrice('')
        setDuration('')
        setSuitableFor([])
        setFeatures('')
        setPopular(false)
        setDiscount('')
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }

    setIsLoading(false)
  }

  return (
    <form onSubmit={onSubmitHandler} className='m-5 w-full'>
      <p className='mb-3 text-lg font-medium'>Add Grooming Service</p>

      <div className='bg-white px-8 py-8 border rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll'>
        
        {/* Service Image */}
        <div className='flex items-center gap-4 mb-8 text-gray-500'>
          <label htmlFor="doc-img">
            <img 
              className='w-16 bg-gray-100 rounded-full cursor-pointer' 
              src={docImg ? URL.createObjectURL(docImg) : assets.upload_area} 
              alt="" 
            />
          </label>
          <input onChange={(e) => setDocImg(e.target.files[0])} type="file" id="doc-img" hidden />
          <p>Upload service image</p>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          
          {/* Left Column */}
          <div className='space-y-4'>
            
            {/* Service Name */}
            <div className='flex flex-col gap-1'>
              <p>Service Name *</p>
              <input 
                onChange={(e) => setName(e.target.value)} 
                value={name} 
                className='border rounded px-3 py-2' 
                type="text" 
                placeholder='Full Grooming Package'
                required 
              />
            </div>

            {/* Category */}
            <div className='flex flex-col gap-1'>
              <p>Category *</p>
              <select 
                onChange={(e) => setCategory(e.target.value)} 
                value={category} 
                className='border rounded px-3 py-2'
                required
              >
                {categories.map((cat, index) => (
                  <option key={index} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Price & Duration */}
            <div className='grid grid-cols-2 gap-4'>
              <div className='flex flex-col gap-1'>
                <p>Price (₹) *</p>
                <input 
                  onChange={(e) => setPrice(e.target.value)} 
                  value={price} 
                  className='border rounded px-3 py-2' 
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder='2500'
                  required 
                />
              </div>
              <div className='flex flex-col gap-1'>
                <p>Duration (minutes) *</p>
                <input 
                  onChange={(e) => setDuration(e.target.value)} 
                  value={duration} 
                  className='border rounded px-3 py-2' 
                  type="number"
                  min="15"
                  max="300"
                  placeholder='90'
                  required 
                />
              </div>
            </div>

            {/* Discount */}
            <div className='flex flex-col gap-1'>
              <p>Discount (%)</p>
              <input 
                onChange={(e) => setDiscount(e.target.value)} 
                value={discount} 
                className='border rounded px-3 py-2' 
                type="number"
                min="0"
                max="100"
                placeholder='10'
              />
            </div>

          </div>

          {/* Right Column */}
          <div className='space-y-4'>
            
            {/* Description */}
            <div className='flex flex-col gap-1'>
              <p>Description *</p>
              <textarea 
                onChange={(e) => setDescription(e.target.value)} 
                value={description} 
                className='border rounded px-3 py-2' 
                placeholder='Complete grooming package including bath, brush, nail trim, and styling...'
                rows="4"
                maxLength="500"
                required 
              />
              <small className='text-gray-500'>{description.length}/500 characters</small>
            </div>

            {/* Features */}
            <div className='flex flex-col gap-1'>
              <p>Features (comma-separated)</p>
              <input 
                onChange={(e) => setFeatures(e.target.value)} 
                value={features} 
                className='border rounded px-3 py-2' 
                type="text" 
                placeholder='Bath, Brush, Nail Trim, Ear Cleaning, Styling'
              />
            </div>

            {/* Suitable For */}
            <div className='flex flex-col gap-2'>
              <p>Suitable For</p>
              <div className='grid grid-cols-2 gap-2'>
                {breedSizes.map((breed, index) => (
                  <label key={index} className='flex items-center gap-2 cursor-pointer'>
                    <input 
                      type="checkbox"
                      checked={suitableFor.includes(breed)}
                      onChange={() => handleSuitableForChange(breed)}
                      className='rounded'
                    />
                    <span className='text-sm'>{breed}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Popular Service */}
            <div className='flex items-center gap-2'>
              <input 
                onChange={(e) => setPopular(e.target.checked)} 
                checked={popular}
                type="checkbox" 
                id="popular"
                className='rounded'
              />
              <label htmlFor="popular" className='cursor-pointer'>Mark as Popular Service</label>
            </div>

          </div>
        </div>

        {/* Submit Button */}
        <button 
          type='submit' 
          disabled={isLoading}
          className='bg-primary px-10 py-3 mt-6 text-white rounded-full disabled:bg-gray-400'
        >
          {isLoading ? 'Adding Service...' : 'Add Service'}
        </button>
      </div>
    </form>
  )
}

export default AddService