import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'dev_secret_change_me',
  jwtExpire: process.env.JWT_EXPIRE || '7d',
  openaiApiKey: process.env.OPENAI_API_KEY,
  geminiApiKey: process.env.GEMINI_API_KEY,
  geminiModel: process.env.GEMINI_MODEL || 'gemini-2.0-flash',
  aiProvider: (process.env.AI_PROVIDER || 'auto').toLowerCase(),
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  lowStockThreshold: parseInt(process.env.LOW_STOCK_THRESHOLD, 10) || 10,
};
