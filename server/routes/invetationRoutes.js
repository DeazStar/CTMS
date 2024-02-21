import express from 'express';
import {
  acceptInvetation,
  sendInvetation,
} from '../controllers/invetationController.js';
import { protectRoute } from '../controllers/authController.js';
const router = express.Router();

router.use(protectRoute);

router.route('/:projectId').post(sendInvetation);
router.route('/:invetationToken').patch(acceptInvetation);

export default router;
