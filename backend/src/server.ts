import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import session from 'express-session';
import passport from './config/passport';
import dotenv from 'dotenv';

import Database from './config/database';
import logger from './config/logger';
import { apiLimiter } from './middleware/rateLimiter';
import { errorHandler } from './middleware/errorHandler';
import { 
  sanitizeHtml, 
  removeNullBytes, 
  normalizeWhitespace, 
  sanitizeQuery,
  trackRequestMetrics 
} from './middleware/sanitization';

// Import routes
import authRoutes from './routes/auth';
import projectRoutes from './routes/projects';
import blogRoutes from './routes/blogs';
import skillRoutes from './routes/skills';
import contactRoutes from './routes/contact';
import analyticsRoutes from './routes/analytics';
import uploadRoutes from './routes/upload';
import commentRoutes from './routes/comments';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

app.use(cors({
  origin: [
    'http://localhost:3000', // Client frontend
    'http://localhost:3001', // Admin frontend
    process.env.CLIENT_URL || 'http://localhost:3000',
    process.env.ADMIN_URL || 'http://localhost:3001'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET!,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Security and optimization middleware
app.use(mongoSanitize());
app.use(removeNullBytes);
app.use(normalizeWhitespace);
app.use(sanitizeQuery);
app.use(sanitizeHtml);
app.use(trackRequestMetrics);
app.use(compression());
app.use(apiLimiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// API routes
const API_VERSION = process.env.API_VERSION || 'v1';
app.use(`/api/${API_VERSION}/auth`, authRoutes);
app.use(`/api/${API_VERSION}/projects`, projectRoutes);
app.use(`/api/${API_VERSION}/blogs`, blogRoutes);
app.use(`/api/${API_VERSION}/skills`, skillRoutes);
app.use(`/api/${API_VERSION}/contact`, contactRoutes);
app.use(`/api/${API_VERSION}/analytics`, analyticsRoutes);
app.use(`/api/${API_VERSION}/upload`, uploadRoutes);
app.use(`/api/${API_VERSION}/comments`, commentRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// Global error handler
app.use(errorHandler);

// Graceful shutdown
const gracefulShutdown = async () => {
  logger.info('Received shutdown signal, closing server gracefully...');
  
  try {
    const db = Database.getInstance();
    await db.disconnect();
    logger.info('Server closed gracefully');
    process.exit(0);
  } catch (error) {
    logger.error('Error during graceful shutdown:', error);
    process.exit(1);
  }
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Start server
const startServer = async () => {
  try {
    const db = Database.getInstance();
    await db.connectMongoDB();
    await db.connectRedis();

    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
      logger.info(`API available at http://localhost:${PORT}/api/${API_VERSION}`);
      logger.info(`MongoDB connected to: ${process.env.MONGODB_URI}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;