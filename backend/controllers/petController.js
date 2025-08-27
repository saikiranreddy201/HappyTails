import petModel from '../models/petModel.js';
import { v2 as cloudinary } from 'cloudinary';

// Get all pets for the authenticated user
const getAllPets = async (req, res) => {
  try {
    const pets = await petModel.find({ 
      owner: req.userId, // from authUser middleware
      isActive: true 
    }).sort({ createdAt: -1 });

    res.json({ 
      success: true, 
      pets: pets.map(pet => pet.getBasicInfo()) 
    });
  } catch (error) {
    console.error('Error fetching pets:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch pets' 
    });
  }
};

// Get specific pet by ID
const getPetById = async (req, res) => {
  try {
    const pet = await petModel.findOne({ 
      _id: req.params.id,
      owner: req.userId,
      isActive: true 
    });

    if (!pet) {
      return res.status(404).json({ 
        success: false, 
        message: 'Pet not found' 
      });
    }

    res.json({ 
      success: true, 
      pet: pet.getBasicInfo() 
    });
  } catch (error) {
    console.error('Error fetching pet:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch pet' 
    });
  }
};

// Create new pet
const createPet = async (req, res) => {
  try {
    console.log("=== CREATE PET DEBUG ===")
    console.log("req.body:", req.body)
    console.log("req.userId:", req.userId)
    console.log("req.body.userId:", req.body.userId)
    
    const { name, breed, age, weight, gender } = req.body;
    
    // Validation
    if (!name || !breed || !age || !weight || !gender) {
      return res.status(400).json({ 
        success: false, 
        message: 'All required fields must be provided' 
      });
    }

    let imageUrl = '';
    
    // Handle image upload if provided
    if (req.file) {
      try {
        const imageUpload = await cloudinary.uploader.upload(req.file.path, {
          resource_type: 'image',
          folder: 'pets'
        });
        imageUrl = imageUpload.secure_url;
      } catch (uploadError) {
        console.error('Image upload failed:', uploadError);
        // Continue without image if upload fails
      }
    }

    const pet = new petModel({
      name,
      breed,
      age,
      weight,
      gender,
      image: imageUrl,
      owner: req.userId
    });

    await pet.save();
    
    res.status(201).json({ 
      success: true, 
      message: 'Pet added successfully',
      pet: pet.getBasicInfo() 
    });
  } catch (error) {
    console.error('Error creating pet:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create pet' 
    });
  }
};

// Update pet
const updatePet = async (req, res) => {
  try {
    const { name, breed, age, weight, gender } = req.body;
    
    const pet = await petModel.findOne({ 
      _id: req.params.id, 
      owner: req.userId, 
      isActive: true 
    });

    if (!pet) {
      return res.status(404).json({ 
        success: false, 
        message: 'Pet not found' 
      });
    }

    // Handle image upload if provided
    let imageUrl = pet.image;
    if (req.file) {
      try {
        const imageUpload = await cloudinary.uploader.upload(req.file.path, {
          resource_type: 'image',
          folder: 'pets'
        });
        imageUrl = imageUpload.secure_url;
      } catch (uploadError) {
        console.error('Image upload failed:', uploadError);
        // Keep existing image if upload fails
      }
    }

    // Update fields
    pet.name = name || pet.name;
    pet.breed = breed || pet.breed;
    pet.age = age || pet.age;
    pet.weight = weight || pet.weight;
    pet.gender = gender || pet.gender;
    pet.image = imageUrl;

    await pet.save();
    
    res.json({ 
      success: true, 
      message: 'Pet updated successfully',
      pet: pet.getBasicInfo() 
    });
  } catch (error) {
    console.error('Error updating pet:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update pet' 
    });
  }
};

// Delete pet (soft delete)
const deletePet = async (req, res) => {
  try {
    const pet = await petModel.findOne({ 
      _id: req.params.id, 
      owner: req.userId, 
      isActive: true 
    });

    if (!pet) {
      return res.status(404).json({ 
        success: false, 
        message: 'Pet not found' 
      });
    }

    await petModel.findByIdAndDelete(pet._id);
    
    res.json({ 
      success: true, 
      message: 'Pet deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting pet:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete pet' 
    });
  }
};

export { getAllPets, createPet, updatePet, deletePet, getPetById };