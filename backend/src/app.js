const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');
const { errorHandler } = require('./middleware/errorMiddleware');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');
const fileRoutes = require('./routes/fileRoutes');
dotenv.config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: ['http://localhost:3000', 'https://task-management-gilt-pi.vercel.app'],
  credentials: true,
}));
app.use(helmet({ crossOriginResourcePolicy: false })); 
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
let swaggerDocument;
try {
  swaggerDocument = YAML.load(path.join(__dirname, '../swagger.yaml'));
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
} catch (error) {
  console.log('Swagger documentation not found or invalid');
}
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/files', fileRoutes);
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'API is running' });
});
app.use(errorHandler);
module.exports = app;
