import React, { useContext, useEffect, useState } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { toast } from 'react-toastify'
import axios from 'axios'

const ServicesList = () => {
  const [services, setServices] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [editingService, setEditingService] = useState(null)
  const [editForm, setEditForm] = useState({})

  const { aToken, backendUrl } = useContext(AdminContext)

  const getAllServices = async () => {
    setIsLoading(true)
    try {
      const { data } = await axios.get(backendUrl + '/api/service/all', {
        headers: { aToken }
      })
      if (data.success) {
        setServices(data.services)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
    setIsLoading(false)
  }

  const changeAvailability = async (serviceId) => {
    try {
      const { data } = await axios.post(backendUrl + '/api/service/change-availability', 
        { serviceId }, 
        { headers: { aToken } }
      )
      if (data.success) {
        toast.success(data.message)
        getAllServices()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const deleteService = async (serviceId) => {
    if (!window.confirm('Are you sure you want to delete this service?')) {
      return
    }

    try {
      const { data } = await axios.delete(backendUrl + `/api/service/delete/${serviceId}`, {
        headers: { aToken }
      })
      if (data.success) {
        toast.success(data.message)
        getAllServices()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const startEdit = (service) => {
    setEditingService(service._id)
    setEditForm({
      name: service.name,
      description: service.description,
      category: service.category,
      price: service.price,
      duration: service.duration,
      discount: service.discount,
      popular: service.popular,
      features: service.features.join(', ')
    })
  }

  const cancelEdit = () => {
    setEditingService(null)
    setEditForm({})
  }

  const saveEdit = async (serviceId) => {
    try {
      const { data } = await axios.put(backendUrl + `/api/service/update/${serviceId}`, 
        editForm, 
        { headers: { aToken } }
      )
      if (data.success) {
        toast.success(data.message)
        setEditingService(null)
        setEditForm({})
        getAllServices()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const formatPrice = (price, discount = 0) => {
    const discountedPrice = discount > 0 ? price * (1 - discount / 100) : price
    return `₹${discountedPrice.toFixed(0)}`
  }

  useEffect(() => {
    if (aToken) {
      getAllServices()
    }
  }, [aToken])

  if (isLoading) {
    return (
      <div className='m-5'>
        <p className='mb-3 text-lg font-medium'>Loading Services...</p>
      </div>
    )
  }

  return (
    <div className='m-5 max-h-[90vh] overflow-y-scroll'>
      <h1 className='text-lg font-medium mb-4'>All Grooming Services</h1>

      <div className='w-full flex flex-wrap gap-4 pt-5 gap-y-6'>
        {services.map((item, index) => (
          <div 
            className='border border-indigo-200 rounded-xl max-w-56 overflow-hidden cursor-pointer group' 
            key={index}
          >
            <img 
              className='bg-indigo-50 group-hover:bg-indigo-100 transition-all duration-500' 
              src={item.image} 
              alt={item.name} 
            />
            
            <div className='p-4'>
              {editingService === item._id ? (
                // Edit Mode
                <div className='space-y-2'>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                    className='w-full px-2 py-1 border rounded text-sm'
                  />
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                    className='w-full px-2 py-1 border rounded text-xs h-16'
                    rows="3"
                  />
                  <div className='grid grid-cols-2 gap-1'>
                    <input
                      type="number"
                      value={editForm.price}
                      onChange={(e) => setEditForm({...editForm, price: e.target.value})}
                      className='px-2 py-1 border rounded text-xs'
                      placeholder='Price'
                    />
                    <input
                      type="number"
                      value={editForm.duration}
                      onChange={(e) => setEditForm({...editForm, duration: e.target.value})}
                      className='px-2 py-1 border rounded text-xs'
                      placeholder='Duration'
                    />
                  </div>
                  <div className='flex gap-1'>
                    <button
                      onClick={() => saveEdit(item._id)}
                      className='text-xs bg-green-500 text-white px-2 py-1 rounded'
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className='text-xs bg-gray-500 text-white px-2 py-1 rounded'
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // View Mode
                <div>
                  <div className='flex items-center gap-2 text-sm'>
                    <div className={`w-2 h-2 rounded-full ${item.available ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                    <p className='text-xs text-gray-600'>{item.category}</p>
                  </div>
                  
                  <p className='text-gray-900 text-lg font-medium'>{item.name}</p>
                  <p className='text-gray-600 text-xs mt-1 line-clamp-2'>{item.description}</p>
                  
                  <div className='mt-2 flex items-center justify-between'>
                    <div>
                      <div className='flex items-center gap-2'>
                        {item.discount > 0 && (
                          <span className='text-xs text-gray-500 line-through'>₹{item.price}</span>
                        )}
                        <span className='text-sm font-medium text-green-600'>
                          {formatPrice(item.price, item.discount)}
                        </span>
                      </div>
                      <p className='text-xs text-gray-500'>{item.duration} mins</p>
                    </div>
                    
                    {item.popular && (
                      <span className='bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full'>
                        Popular
                      </span>
                    )}
                  </div>

                  {/* Features */}
                  {item.features && item.features.length > 0 && (
                    <div className='mt-2'>
                      <p className='text-xs text-gray-500'>
                        {item.features.slice(0, 2).join(', ')}
                        {item.features.length > 2 && '...'}
                      </p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className='flex gap-1 mt-3'>
                    <button
                      onClick={() => startEdit(item)}
                      className='text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600'
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => changeAvailability(item._id)}
                      className={`text-xs px-2 py-1 rounded ${
                        item.available 
                          ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                          : 'bg-green-100 text-green-600 hover:bg-green-200'
                      }`}
                    >
                      {item.available ? 'Disable' : 'Enable'}
                    </button>
                    <button
                      onClick={() => deleteService(item._id)}
                      className='text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600'
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {services.length === 0 && (
        <div className='text-center py-10'>
          <p className='text-gray-600'>No services added yet</p>
        </div>
      )}
    </div>
  )
}

export default ServicesList