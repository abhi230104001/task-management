const request = require('supertest');
const express = require('express');
const { canViewTask } = require('../src/middleware/taskAuthMiddleware');
const Task = require('../src/models/Task');

jest.mock('../src/models/Task');

const app = express();

app.use((req, res, next) => {
  // Mock user from protect middleware
  req.user = req.headers.user ? JSON.parse(req.headers.user) : null;
  next();
});

app.get('/api/tasks/:id/files', canViewTask, (req, res) => {
  res.status(200).json({ success: true, files: req.task.attachments });
});

app.use((err, req, res, next) => {
  res.status(res.statusCode || 500).json({ message: err.message });
});

describe('Task Attachment Authorization (canViewTask)', () => {
  const taskId = '605c72efb5b5b5b5b5b5b5b5';
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Creator can access attachments', async () => {
    const creatorId = 'creator123';
    Task.findById.mockResolvedValue({
      _id: taskId,
      createdBy: creatorId,
      assignedTo: 'someoneelse',
      attachments: [{ public_id: '123' }]
    });

    const res = await request(app)
      .get(`/api/tasks/${taskId}/files`)
      .set('user', JSON.stringify({ id: creatorId, role: 'user' }));

    expect(res.statusCode).toEqual(200);
    expect(res.body.files.length).toBe(1);
  });

  it('Assigned user can access attachments', async () => {
    const assigneeId = 'assignee123';
    Task.findById.mockResolvedValue({
      _id: taskId,
      createdBy: 'creator123',
      assignedTo: assigneeId,
      attachments: [{ public_id: '123' }]
    });

    const res = await request(app)
      .get(`/api/tasks/${taskId}/files`)
      .set('user', JSON.stringify({ id: assigneeId, role: 'user' }));

    expect(res.statusCode).toEqual(200);
  });

  it('Admin can access attachments', async () => {
    const adminId = 'admin123';
    Task.findById.mockResolvedValue({
      _id: taskId,
      createdBy: 'creator123',
      assignedTo: 'assignee123',
      attachments: [{ public_id: '123' }]
    });

    const res = await request(app)
      .get(`/api/tasks/${taskId}/files`)
      .set('user', JSON.stringify({ id: adminId, role: 'admin' }));

    expect(res.statusCode).toEqual(200);
  });

  it('Unauthorized user gets 403 Forbidden', async () => {
    const randomUserId = 'random123';
    Task.findById.mockResolvedValue({
      _id: taskId,
      createdBy: 'creator123',
      assignedTo: 'assignee123',
      attachments: [{ public_id: '123' }]
    });

    const res = await request(app)
      .get(`/api/tasks/${taskId}/files`)
      .set('user', JSON.stringify({ id: randomUserId, role: 'user' }));

    expect(res.statusCode).toEqual(403);
    expect(res.body.message).toBe('Not authorized to access this task');
  });
});
