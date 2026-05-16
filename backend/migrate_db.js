const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './.env' });

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const taskSchema = new mongoose.Schema({}, { strict: false });
const Task = mongoose.model('Task', taskSchema);

async function migrate() {
  try {
    const tasks = await Task.find({ attachedDocuments: { $exists: true, $ne: [] } });
    console.log(`Found ${tasks.length} tasks to migrate`);
    for (let t of tasks) {
      const attachments = t.get('attachedDocuments').map(doc => {
        return {
          public_id: doc.filename,
          originalName: doc.filename,
          secure_url: `local://${doc.filename}`, // special marker for local files
          createdAt: doc.uploadedAt || new Date()
        }
      });
      
      await Task.updateOne(
        { _id: t._id },
        { 
          $set: { attachments: attachments },
          $unset: { attachedDocuments: "" }
        }
      );
      console.log(`Migrated task ${t._id}`);
    }
  } catch(e) {
    console.error(e);
  } finally {
    mongoose.disconnect();
  }
}

migrate();
