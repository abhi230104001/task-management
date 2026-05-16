const express = require('express');
const { downloadFile } = require('../controllers/fileController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();
router.get('/download/:filename', protect, downloadFile);
module.exports = router;
