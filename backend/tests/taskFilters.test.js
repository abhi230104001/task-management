const request = require('supertest');
const express = require('express');
const { getTasks } = require('../src/controllers/taskController');
const Task = require('../src/models/Task');

jest.mock('../src/models/Task');

const app = express();

app.use((req, res, next) => {
  req.user = req.headers.user ? JSON.parse(req.headers.user) : { id: 'user123', role: 'user' };
  next();
});

app.get('/api/tasks', getTasks);

app.use((err, req, res, next) => {
  res.status(res.statusCode || 500).json({ message: err.message });
});

describe('Task Filtering and Sorting API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Task.countDocuments.mockResolvedValue(10);
    Task.find.mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue([{ _id: '1', title: 'Test Task' }])
    });
  });

  it('handles "All Tasks" properly (no assignedTo/createdBy overrides)', async () => {
    await request(app).get('/api/tasks?type=all');
    
    expect(Task.find).toHaveBeenCalledWith(
      expect.objectContaining({
        $or: [{ createdBy: 'user123' }, { assignedTo: 'user123' }]
      })
    );
    // Should NOT have createdBy or assignedTo set at the root of the query
    const callArgs = Task.find.mock.calls[0][0];
    expect(callArgs.assignedTo).toBeUndefined();
    expect(callArgs.createdBy).toBeUndefined();
  });

  it('handles "Assigned To Me" filter', async () => {
    await request(app).get('/api/tasks?type=assigned');
    
    const callArgs = Task.find.mock.calls[0][0];
    expect(callArgs.assignedTo).toBe('user123');
  });

  it('handles "Created By Me" filter', async () => {
    await request(app).get('/api/tasks?type=created');
    
    const callArgs = Task.find.mock.calls[0][0];
    expect(callArgs.createdBy).toBe('user123');
  });

  it('combines sorting and filtering correctly', async () => {
    await request(app).get('/api/tasks?type=assigned&status=completed&priority=high&sort=-dueDate');
    
    const findCallArgs = Task.find.mock.calls[0][0];
    expect(findCallArgs.assignedTo).toBe('user123');
    expect(findCallArgs.status).toBe('completed');
    expect(findCallArgs.priority).toBe('high');
    
    // Sort should be called with '-dueDate'
    const findObj = Task.find(); 
    expect(findObj.sort).toHaveBeenCalledWith('-dueDate');
  });

  it('filters empty query parameters', async () => {
    await request(app).get('/api/tasks?type=all&status=&priority=&dueDate=&sort=-createdAt');
    
    const findCallArgs = Task.find.mock.calls[0][0];
    expect(findCallArgs.status).toBeUndefined();
    expect(findCallArgs.priority).toBeUndefined();
    expect(findCallArgs.dueDate).toBeUndefined();
  });
});
