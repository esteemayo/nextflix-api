const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
require('colors');

// models
const List = require('../../models/List');
const User = require('../../models/User');
const Movie = require('../../models/Movie');

dotenv.config({ path: './config.env' });

// db local
const dbLocal = process.env.DATABASE_LOCAL;

// atlas mongo uri
const mongoURI = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

// MongoDB connection
mongoose
  .connect(mongoURI)
  .then(() =>
    console.log(`Connected to MongoDB successfully → ${mongoURI}`.gray.bold)
  )
  .catch((err) =>
    console.log(`Could not connect to MongoDB successfully → ${err}`)
  );

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
