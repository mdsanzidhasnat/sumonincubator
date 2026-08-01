import mongoose from 'mongoose';

import { env } from './env.js';

export async function connectDb(): Promise<void> {
  mongoose.set('strictQuery', true);
  await mongoose.connect(env.DATABASE_URL);
  mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error', err);
  });
}

export async function disconnectDb(): Promise<void> {
  await mongoose.disconnect();
}
