import serviceModel from '../models/serviceModel.js';
import { v2 as cloudinary } from 'cloudinary';

// Add new service (Admin only)
const addService = async (req, res) => {
  try {
    const { 
      name, 
      description, 
      category, 
      price, 
      duration, 
      suitableFor, 
      features,
      popular,
      discount 
    } = req.body;

    // Validate required fields
    if (!name || !description || !category || !price || !duration) {
      return res.json({ success: false, message: 'All required fields must be filled' });
    }

    const imageFile = req.file;
    let imageUrl = '';

    // Upload image to cloudinary if provided
    if (imageFile) {
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
        folder: "grooming_services"
      });
      imageUrl = imageUpload.secure_url;
    }

    const serviceData = {
      name: name.trim(),
      description: description.trim(),
      category,
      price: parseFloat(price),
      duration: parseInt(duration),
      image: imageUrl,
      suitableFor: Array.isArray(suitableFor) ? suitableFor : [suitableFor].filter(Boolean),
      features: Array.isArray(features) ? features : features?.split(',').map(f => f.trim()).filter(Boolean) || [],
      popular: popular === 'true' || popular === true,
      discount: parseFloat(discount) || 0,
      slots: {} // Initialize empty slots
    };

    const service = new serviceModel(serviceData);
    await service.save();

    res.json({ success: true, message: 'Service added successfully', service });

  } catch (error) {
    console.error('Add service error:', error);
    res.json({ success: false, message: error.message });
  }
};

// Get all services (Admin)
const getAllServices = async (req, res) => {
  try {
    const services = await serviceModel.find({}).sort({ createdAt: -1 });
    res.json({ success: true, services });
  } catch (error) {
    console.error('Get all services error:', error);
    res.json({ success: false, message: error.message });
  }
};

// Get services list for users (available only)
const getServicesList = async (req, res) => {
  try {
    const services = await serviceModel.find({ available: true }).sort({ createdAt: -1 });
    res.json({ success: true, services });
  } catch (error) {
    console.error('Get services list error:', error);
    res.json({ success: false, message: error.message });
  }
};

// Get services by category
const getServicesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const services = await serviceModel.getByCategory(category);
    res.json({ success: true, services });
  } catch (error) {
    console.error('Get services by category error:', error);
    res.json({ success: false, message: error.message });
  }
};

// Get popular services
const getPopularServices = async (req, res) => {
  try {
    const services = await serviceModel.getPopular();
    res.json({ success: true, services });
  } catch (error) {
    console.error('Get popular services error:', error);
    res.json({ success: false, message: error.message });
  }
};

// Update service availability (Admin)
const changeServiceAvailability = async (req, res) => {
  try {
    const { serviceId } = req.body;
    
    const serviceData = await serviceModel.findById(serviceId);
    if (!serviceData) {
      return res.json({ success: false, message: 'Service not found' });
    }

    await serviceModel.findByIdAndUpdate(serviceId, { available: !serviceData.available });
    
    res.json({ 
      success: true, 
      message: `Service ${serviceData.available ? 'disabled' : 'enabled'} successfully` 
    });

  } catch (error) {
    console.error('Change service availability error:', error);
    res.json({ success: false, message: error.message });
  }
};

// Update service (Admin)
const updateService = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const { 
      name, 
      description, 
      category, 
      price, 
      duration, 
      suitableFor, 
      features,
      popular,
      discount,
      available
    } = req.body;

    const service = await serviceModel.findById(serviceId);
    if (!service) {
      return res.json({ success: false, message: 'Service not found' });
    }

    const imageFile = req.file;
    let imageUrl = service.image;

    // Upload new image if provided
    if (imageFile) {
      // Delete old image from cloudinary if exists
      if (service.image) {
        const publicId = service.image.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`grooming_services/${publicId}`);
      }

      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
        folder: "grooming_services"
      });
      imageUrl = imageUpload.secure_url;
    }

    const updateData = {
      name: name?.trim() || service.name,
      description: description?.trim() || service.description,
      category: category || service.category,
      price: price ? parseFloat(price) : service.price,
      duration: duration ? parseInt(duration) : service.duration,
      image: imageUrl,
      suitableFor: suitableFor ? (Array.isArray(suitableFor) ? suitableFor : [suitableFor].filter(Boolean)) : service.suitableFor,
      features: features ? (Array.isArray(features) ? features : features.split(',').map(f => f.trim()).filter(Boolean)) : service.features,
      popular: popular !== undefined ? (popular === 'true' || popular === true) : service.popular,
      discount: discount !== undefined ? parseFloat(discount) : service.discount,
      available: available !== undefined ? (available === 'true' || available === true) : service.available
    };

    await serviceModel.findByIdAndUpdate(serviceId, updateData);
    
    res.json({ success: true, message: 'Service updated successfully' });

  } catch (error) {
    console.error('Update service error:', error);
    res.json({ success: false, message: error.message });
  }
};

// Delete service (Admin)
const deleteService = async (req, res) => {
  try {
    const { serviceId } = req.params;

    const service = await serviceModel.findById(serviceId);
    if (!service) {
      return res.json({ success: false, message: 'Service not found' });
    }

    // Delete image from cloudinary if exists
    if (service.image) {
      const publicId = service.image.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`grooming_services/${publicId}`);
    }

    await serviceModel.findByIdAndDelete(serviceId);
    
    res.json({ success: true, message: 'Service deleted successfully' });

  } catch (error) {
    console.error('Delete service error:', error);
    res.json({ success: false, message: error.message });
  }
};

// Get service categories
const getServiceCategories = async (req, res) => {
  try {
    const categories = [
      'Basic Grooming',
      'Premium Grooming', 
      'Spa & Wellness',
      'Nail & Paw Care',
      'Dental Care',
      'Specialty Services'
    ];
    
    res.json({ success: true, categories });
  } catch (error) {
    console.error('Get service categories error:', error);
    res.json({ success: false, message: error.message });
  }
};

export {
  addService,
  getAllServices,
  getServicesList,
  getServicesByCategory,
  getPopularServices,
  changeServiceAvailability,
  updateService,
  deleteService,
  getServiceCategories
};