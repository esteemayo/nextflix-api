import path from 'path';
import dotenv from 'dotenv';
import fs from 'fs';
import { fileURLToPath } from 'url';
import 'colors';

// models
import List from '../../models/List.js';
import User from '../../models/User.js';
import Movie from '../../models/Movie.js';
import User from '../../models/User.js';
import connectDB from '../../config/db.js';

dotenv.config({ path: './config.env' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// MongoDB connection
connectDB();

// read JSON file
const lists = JSON.parse(fs.readFileSync(`${__dirname}/lists.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const movies = JSON.parse(fs.readFileSync(`${__dirname}/movies.json`, 'utf-8'));

// import data into database
const loadData = async () => {
  try {
    await List.create(lists);
    await Movie.create(movies);
    await User.create(users, { validateBeforeSave: false });
    console.log('👍👍👍👍👍👍👍👍 Done!'.green.bold);
    process.exit();
  } catch (err) {
    console.log(
      '\n👎👎👎👎👎👎👎👎 Error! The Error info is below but if you are importing sample data make sure to drop the existing database first with.\n\n\t npm run blowitallaway\n\n\n'
        .red.bold
    );
    console.log(err);
    process.exit();
  }
};

// delete data from database
const removeData = async () => {
  try {
    console.log('😢😢 Goodbye Data...'.blue.bold);
    await List.deleteMany();
    await User.deleteMany();
    await Movie.deleteMany();
    console.log(
      'Data Deleted. To load sample data, run\n\n\t npm run sample\n\n'.green
        .bold
    );
    process.exit();
  } catch (err) {
    console.log(err);
    process.exit();
  }
};

if (process.argv.includes('--delete')) {
  removeData();
} else {
  loadData();
}
