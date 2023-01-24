import mongoose from 'mongoose';

const listSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      unique: true,
      required: [true, 'A list must have a title'],
    },
    type: {
      type: String,
    },
    genre: {
      type: String,
    },
    content: {
      type: Array,
    },
  },
  {
    timestamps: true,
  }
);

const List = mongoose.model('List', listSchema);

export default List;
