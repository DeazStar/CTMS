import express from 'express';
import {
  createProject,
  listProject,
  editProject,
} from '../controllers/projectController.js';
import { protectRoute } from '../controllers/authController.js';

const router = express.Router();

router.use(protectRoute);

router.route('/create').post(createProject);
router.route('/').get(listProject);
router.route('/:id').patch(editProject);

export default router;
