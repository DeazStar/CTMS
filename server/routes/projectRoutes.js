import express from 'express';
import {
  createProject,
  listProject,
  editProject,
  deleteProject,
} from '../controllers/projectController.js';
import { protectRoute } from '../controllers/authController.js';
import taskRouter from './taskRoutes.js';

const router = express.Router();

router.use(protectRoute);

router.use('/:projectId/tasks', taskRouter);

router.route('/create').post(createProject);
router.route('/').get(listProject);
router.route('/:id').patch(editProject).delete(deleteProject);

export default router;
