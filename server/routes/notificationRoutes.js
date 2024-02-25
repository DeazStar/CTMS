import express from 'express';
import {
  getUnreadNotification,
  getAllNotification,
  readSingleNotification,
  readAllNotification,
} from '../controllers/reminderController.js';

const router = express.Router();

router.route('/:projectId/get-all-notification').get(getAllNotification);
router.route('/:projectId/get-unread-notification').get(getUnreadNotification);
router.route('/:projectId/read-all-notification').patch(readAllNotification);
router
  .route('/:projectId/read-single-notification/:notificationId')
  .patch(readSingleNotification);

export default router;
