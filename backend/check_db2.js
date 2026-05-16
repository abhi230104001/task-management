const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './.env' });

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const taskSchema = new mongoose.Schema({}, { strict: false });
const Task = mongoose.model('Task', taskSchema);

async function checkTasks() {
  try {
    const tasks = await Task.find({}).lean();
    console.log(`Found ${tasks.length} tasks`);
    for (let t of tasks) {
      console.log(`Task ${t._id}: attachedDocuments=${JSON.stringify(t.attachedDocuments)}, attachments=${JSON.stringify(t.attachments)}`);
    }
  } catch (err) {
    console.error(err);
  } finally {
    mongoose.disconnect();
  }
}

checkTasks();
