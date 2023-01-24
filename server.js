import mongoose from 'mongoose';
import dotenv from 'dotenv';
require('colors');

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 🔥 Shutting down...'.red.bold);
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });
import app from './app.js';

// db local
const dbLocal = process.env.DATABASE_LOCAL;

// atlas mongo uri
const mongoURI = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

// MongoDB connection
mongoose
  .connect(dbLocal)
  .then(() =>
    console.log(`Connected to MongoDB successfully → ${dbLocal}`.gray.bold)
  );

app.set('port', process.env.PORT || 9900);

const server = app.listen(app.get('port'), () =>
  console.log(`Server running on port ${server.address().port}`.blue.bold)
);

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 🔥 Shutting down...'.red.bold);
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
