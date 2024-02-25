import express from 'express';
import { signup, login, protectRoute } from '../controllers/authController.js';
import {
  updateProfile,
  updatePassword,
  updateAvatar,
} from '../controllers/userController.js';
import multer from 'multer';

const upload = multer({ dest: `${process.cwd()}/public/user/` });

const router = express.Router();

router.route('/signup').post(signup);
router.route('/login').post(login);

router.use(protectRoute);

router.route('/profile/update-profile').post(updateProfile);
router.route('/profile/update-password').post(updatePassword);
router
  .route('/profile/update-avatar')
  .post(upload.single('avatar'), updateAvatar);
export default router;
