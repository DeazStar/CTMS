import express from 'express';
import { signup, login, protectRoute } from '../controllers/authController.js';

const router = express.Router();

router.route('/signup').post(signup);
router.route('/login').post(login);

router.use(protectRoute);

export default router;
