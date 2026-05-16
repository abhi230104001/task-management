const Task = require('../models/Task');
exports.canViewTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      res.status(404);
      return next(new Error('Task not found'));
    }
    const isCreator = req.user.id === task.createdBy.toString();
    const isAssignee = task.assignedTo && req.user.id === task.assignedTo.toString();
    const isAdmin = req.user.role === 'admin';
    if (!isCreator && !isAssignee && !isAdmin) {
      res.status(403);
      return next(new Error('Not authorized to access this task'));
    }
    req.task = task;
    next();
  } catch (error) {
    next(error);
  }
};
exports.canEditTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      res.status(404);
      return next(new Error('Task not found'));
    }
    const isCreator = req.user.id === task.createdBy.toString();
    const isAssignee = task.assignedTo && req.user.id === task.assignedTo.toString();
    const isAdmin = req.user.role === 'admin';
    if (!isAdmin && !isCreator && !isAssignee) {
      res.status(403);
      return next(new Error('Not authorized to update this task'));
    }
    req.task = task;
    req.isAssigneeOnly = isAssignee && !isCreator && !isAdmin;
    next();
  } catch (error) {
    next(error);
  }
};
exports.canDeleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      res.status(404);
      return next(new Error('Task not found'));
    }
    const isCreator = req.user.id === task.createdBy.toString();
    const isAdmin = req.user.role === 'admin';
    if (!isAdmin && !isCreator) {
      res.status(403);
      return next(new Error('Not authorized to delete this task'));
    }
    req.task = task;
    next();
  } catch (error) {
    next(error);
  }
};
