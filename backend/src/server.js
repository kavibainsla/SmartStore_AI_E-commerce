import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { connectDB } from './config/db.js';
import { config } from './config/env.js';
import { corsOptions } from './config/cors.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { apiLimiter, aiLimiter } from './middleware/rateLimiter.js';
import apiRoutes from './routes/index.js';

const app = express();

app.use(helmet());
app.use(cors(corsOptions));
app.use('/api/', apiLimiter);
app.use('/api/ai', aiLimiter);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'SmartStore AI API is running', version: '1.0.0' });
});

app.use('/api', apiRoutes);

app.use(notFound);
app.use(errorHandler);

const start = async () => {
  try {
    await connectDB();

    const server = app.listen(config.port, () => {
      console.log(`SmartStore AI server running on port ${config.port}`);
      console.log(`Environment: ${config.nodeEnv}`);
      console.log(`Health check: http://localhost:${config.port}/api/health`);
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`\nPort ${config.port} is already in use.`);
        console.error('Fix: Stop the other process, or change PORT in backend/.env\n');
        console.error('Windows — free port 5000:');
        console.error('  netstat -ano | findstr :5000');
        console.error('  taskkill /PID <pid> /F\n');
      } else {
        console.error('Server error:', err.message);
      }
      process.exit(1);
    });
  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
};

start();

export default app;
