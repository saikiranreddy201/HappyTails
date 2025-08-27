import express from 'express';
import { 
  addService,
  getAllServices,
  getServicesList,
  getServicesByCategory,
  getPopularServices,
  changeServiceAvailability,
  updateService,
  deleteService,
  getServiceCategories
} from '../controllers/serviceController.js';
import authAdmin from '../middleware/authAdmin.js';
import upload from '../middleware/multer.js';

const serviceRouter = express.Router();

// Public routes (for users)
serviceRouter.get('/list', getServicesList);
serviceRouter.get('/category/:category', getServicesByCategory);
serviceRouter.get('/popular', getPopularServices);
serviceRouter.get('/categories', getServiceCategories);

// Admin only routes
serviceRouter.post('/add', authAdmin, upload.single('image'), addService);
serviceRouter.get('/all', authAdmin, getAllServices);
serviceRouter.post('/change-availability', authAdmin, changeServiceAvailability);
serviceRouter.put('/update/:serviceId', authAdmin, upload.single('image'), updateService);
serviceRouter.delete('/delete/:serviceId', authAdmin, deleteService);

export default serviceRouter;