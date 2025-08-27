import express from 'express';
import { 
  getAllPets, 
  createPet, 
  updatePet, 
  deletePet, 
  getPetById 
} from '../controllers/petController.js';
import authUser from '../middleware/authUser.js';
import upload from '../middleware/multer.js';

const petRouter = express.Router();

// GET /api/pets - Get all pets for logged-in user
petRouter.get("/", authUser, getAllPets);

// GET /api/pets/:id - Get specific pet by ID
petRouter.get("/:id", authUser, getPetById);

// POST /api/pets - Create new pet (with optional image upload)
petRouter.post("/", authUser, upload.single('image'), createPet);

// PUT /api/pets/:id - Update pet (with optional image upload)
petRouter.put("/:id", authUser, upload.single('image'), updatePet);

// DELETE /api/pets/:id - Delete pet (soft delete)
petRouter.delete("/:id", authUser, deletePet);

export default petRouter;