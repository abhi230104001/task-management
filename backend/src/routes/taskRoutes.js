const express = require('express');
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  getTaskFiles,
  getTaskFile,
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const { canViewTask, canEditTask, canDeleteTask } = require('../middleware/taskAuthMiddleware');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getTasks)
  .post(upload.array('documents', 3), createTask);

router.route('/:id')
  .get(canViewTask, getTask)
  .put(canEditTask, upload.array('documents', 3), updateTask)
  .delete(canDeleteTask, deleteTask);

router.route('/:id/files')
  .get(canViewTask, getTaskFiles);

router.route('/:id/files/:fileId')
  .get(canViewTask, getTaskFile);

module.exports = router;
