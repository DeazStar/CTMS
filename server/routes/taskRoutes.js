import express from 'express';
import {
  createTask,
  editTask,
  deleteTask,
  listTask,
  getTaskById,
  assignTask,
  getAssgiendTask,
} from '../controllers/taskController.js';
const router = express.Router({ mergeParams: true });

router.route('/').post(createTask).get(listTask);
router.route('/:taskId').patch(editTask).delete(deleteTask).get(getTaskById);
router.route('/:taskId/assign-task').post(assignTask);
router.route('/assigned-task/:taskId').get(getAssgiendTask);

export default router;
