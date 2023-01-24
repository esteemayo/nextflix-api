import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config({ path: './config.env' });

const devEnv = process.env.NODE_ENV !== 'production';
const { DATABASE, DATABASE_PASSWORD, DATABASE_LOCAL } = process.env;

const dbLocal = DATABASE_LOCAL;
const mongoURI = DATABASE.replace('<PASSWORD>', DATABASE_PASSWORD);

const db = devEnv ? dbLocal : mongoURI;

const connectDB = async () => {
  try {
    const conn = mongoose.connect(db);
    console.log(`Connected to MongoDB successfully → ${conn.connection.port}`.gray.bold);
  } catch (err) {
    throw err;
  }
};

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
})

export default connectDB;
