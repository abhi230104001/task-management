const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Task = require('./src/models/Task');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  const token = jwt.sign({ id: '6a082467fa71ecb4ceb7b71b' }, process.env.JWT_SECRET, { expiresIn: '30d' }); // fake user id
  console.log("Token:", token);
  
  // We can just create a task directly in the DB to test the schema!
  const task = await Task.create({
    title: "Test Task with Attachment",
    description: "desc",
    createdBy: '6a082467fa71ecb4ceb7b71b', // fake user id
    attachments: [
      {
        originalName: 'test.pdf',
        secure_url: 'http://example.com/test.pdf',
        public_id: 'test_123'
      }
    ]
  });
  
  console.log("Created task:", task.title);
  console.log("Attachments length:", task.attachments ? task.attachments.length : 'undefined');
  
  // Now retrieve it
  const fetched = await Task.findById(task._id);
  console.log("Fetched attachments:", fetched.attachments);
  
  mongoose.disconnect();
}

run();
