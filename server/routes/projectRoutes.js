import express from 'express';
import { createProject } from '../controllers/projectController.js';
import { protectRoute } from '../controllers/authController.js';

const router = express.Router();

router.use(protectRoute);

router.route('/create').post(createProject);

export default router;
