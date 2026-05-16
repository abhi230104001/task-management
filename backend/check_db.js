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
      console.log(`Task ${t._id}: has attachedDocuments = ${!!t.attachedDocuments}, has attachments = ${!!t.attachments}`);
      if (t.attachedDocuments && t.attachedDocuments.length > 0) {
        console.log(`  attachedDocuments length: ${t.attachedDocuments.length}`);
        console.log(`  first doc:`, t.attachedDocuments[0]);
      }
      if (t.attachments && t.attachments.length > 0) {
        console.log(`  attachments length: ${t.attachments.length}`);
        console.log(`  first doc:`, t.attachments[0]);
      }
    }
  } catch (err) {
    console.error(err);
  } finally {
    mongoose.disconnect();
  }
}

checkTasks();
