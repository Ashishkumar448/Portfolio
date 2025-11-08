import mongoose from 'mongoose';
import { createClient } from 'redis';
import logger from './logger';

class Database {
  private static instance: Database;
  public redisClient: any;

  private constructor() {}

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public async connectMongoDB(): Promise<void> {
    try {
      const mongoUri = process.env.NODE_ENV === 'test' 
        ? process.env.MONGODB_TEST_URI 
        : process.env.MONGODB_URI;

      if (!mongoUri) {
        throw new Error('MongoDB URI is not defined');
      }

      await mongoose.connect(mongoUri);
      
      mongoose.connection.on('connected', () => {
        logger.info('MongoDB connected successfully');
      });

      mongoose.connection.on('error', (err) => {
        logger.error('MongoDB connection error:', err);
      });

      mongoose.connection.on('disconnected', () => {
        logger.warn('MongoDB disconnected');
      });

    } catch (error) {
      logger.error('MongoDB connection failed:', error);
      process.exit(1);
    }
  }

  public async connectRedis(): Promise<void> {
    try {
      this.redisClient = createClient({
        url: process.env.REDIS_URL,
        password: process.env.REDIS_PASSWORD || undefined,
      });

      this.redisClient.on('error', (err: Error) => {
        logger.error('Redis Client Error:', err);
      });

      this.redisClient.on('connect', () => {
        logger.info('Redis connected successfully');
      });

      this.redisClient.on('disconnect', () => {
        logger.warn('Redis disconnected');
      });

      await this.redisClient.connect();
    } catch (error) {
      logger.error('Redis connection failed:', error);
      // Don't exit process for Redis failure, continue without caching
    }
  }

  public async disconnect(): Promise<void> {
    try {
      await mongoose.connection.close();
      if (this.redisClient) {
        await this.redisClient.quit();
      }
      logger.info('Database connections closed');
    } catch (error) {
      logger.error('Error closing database connections:', error);
    }
  }
}

export default Database;