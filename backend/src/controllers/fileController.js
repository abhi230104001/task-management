const path = require('path');
const fs = require('fs');
exports.downloadFile = async (req, res, next) => {
  try {
    const filename = req.params.filename;
    const file = path.join(__dirname, '../../uploads', filename);
    if (fs.existsSync(file)) {
      res.download(file);
    } else {
      res.status(404);
      throw new Error('File not found');
    }
  } catch (error) {
    next(error);
  }
};
