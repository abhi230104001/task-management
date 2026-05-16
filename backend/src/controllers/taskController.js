const Task = require('../models/Task');
const emitTaskEvent = (req, event, task) => {
  const io = req.app.get('io');
  if (io) {
    io.emit(event, task);
  }
};
exports.getTasks = async (req, res, next) => {
  try {
    let query = {};
    if (req.user.role !== 'admin') {
      query = {
        $or: [{ createdBy: req.user.id }, { assignedTo: req.user.id }]
      };
    }
    if (req.query.type === 'assigned') {
      query.assignedTo = req.user.id;
    } else if (req.query.type === 'created') {
      query.createdBy = req.user.id;
    } else if (req.query.scope === 'assignedToMe') {
      query.assignedTo = req.user.id;
    } else if (req.query.scope === 'createdByMe') {
      query.createdBy = req.user.id;
    }
    if (req.query.status) query.status = req.query.status;
    if (req.query.priority) query.priority = req.query.priority;
    if (req.query.dueDate) {
      const date = new Date(req.query.dueDate);
      query.dueDate = {
        $gte: new Date(date.setHours(0, 0, 0, 0)),
        $lte: new Date(date.setHours(23, 59, 59, 999))
      };
    }
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    let sort = '-createdAt';
    if (req.query.sort) {
      sort = req.query.sort.split(',').join(' ');
    }
    const total = await Task.countDocuments(query);
    const tasks = await Task.find(query)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .sort(sort)
      .skip(startIndex)
      .limit(limit);
    res.status(200).json({
      success: true,
      count: tasks.length,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      },
      data: tasks,
    });
  } catch (error) {
    next(error);
  }
};
exports.getTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'email role name')
      .populate('createdBy', 'email role name');
    let taskData = task.toObject();
    if ((!taskData.attachments || taskData.attachments.length === 0) && taskData.attachedDocuments && taskData.attachedDocuments.length > 0) {
      taskData.attachments = taskData.attachedDocuments.map(doc => ({
        _id: doc._id,
        public_id: doc.filename,
        originalName: doc.originalName || doc.filename,
        secure_url: `/api/files/download/${doc.filename}`,
        createdAt: doc.uploadedAt || doc.createdAt
      }));
    }
    res.status(200).json({
      success: true,
      data: taskData,
    });
  } catch (error) {
    next(error);
  }
};
exports.createTask = async (req, res, next) => {
  try {
    req.body.createdBy = req.user.id;
    if (req.files && req.files.length > 0) {
      console.log('Uploaded files from Cloudinary:', req.files);
      req.body.attachments = req.files.map(file => ({
        originalName: file.originalname,
        secure_url: file.path,
        public_id: file.filename || file.public_id,
      }));
    }
    const task = await Task.create(req.body);
    const populatedTask = await Task.findById(task._id)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');
    emitTaskEvent(req, 'taskCreated', populatedTask);
    res.status(201).json({
      success: true,
      data: populatedTask,
    });
  } catch (error) {
    next(error);
  }
};
exports.updateTask = async (req, res, next) => {
  try {
    if (req.isAssigneeOnly) {
      const allowedStatus = req.body.status;
      req.body = {};
      if (allowedStatus) req.body.status = allowedStatus;
      req.files = []; 
    }
    if (req.files && req.files.length > 0) {
      console.log('Uploaded files from Cloudinary:', req.files);
      req.body.attachments = req.files.map(file => ({
        originalName: file.originalname,
        secure_url: file.path,
        public_id: file.filename || file.public_id,
      }));
    }
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('assignedTo', 'email role name')
      .populate('createdBy', 'email role name');
    emitTaskEvent(req, 'taskUpdated', task);
    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
};
exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    await Task.findByIdAndDelete(req.params.id);
    emitTaskEvent(req, 'taskDeleted', { id: req.params.id });
    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};
exports.getTaskFiles = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    res.status(200).json({
      success: true,
      data: task.attachments || [],
    });
  } catch (error) {
    next(error);
  }
};
exports.getTaskFile = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    const file = task.attachments.find(doc => doc._id.toString() === req.params.fileId);
    if (!file) {
      res.status(404);
      throw new Error('File not found');
    }
    res.status(200).json({
      success: true,
      data: file,
    });
  } catch (error) {
    next(error);
  }
};
