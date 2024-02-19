import express from 'express';
import { sendInvetation } from '../controllers/invetationController.js';
import { protectRoute } from '../controllers/authController.js';
const router = express.Router();

router.use(protectRoute);

router.route('/:projectId').post(sendInvetation);

export default router;
