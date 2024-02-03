import express from 'express';
import {
  createProject,
  listProject,
} from '../controllers/projectController.js';
import { protectRoute } from '../controllers/authController.js';

const router = express.Router();

router.use(protectRoute);

router.route('/create').post(createProject);
router.route('/').get(listProject);

export default router;
