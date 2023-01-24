import slugify from 'slugify';
import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      unique: true,
      required: [true, 'A movie must have a title'],
    },
    desc: {
      type: String,
    },
    slug: {
      type: String,
    },
    img: {
      type: String,
    },
    imgTitle: {
      type: String,
    },
    imgSm: {
      type: String,
    },
    trailer: {
      type: String,
    },
    video: {
      type: String,
    },
    year: {
      type: String,
    },
    limit: {
      type: Number,
    },
    genre: {
      type: String,
    },
    isSeries: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

movieSchema.index({
  title: 'text',
  desc: 'text',
});

movieSchema.index({ title: 1, genre: 1 });
movieSchema.index({ slug: 1 });

movieSchema.pre('save', async function (next) {
  if (!this.isModified('title')) return next();
  this.slug = slugify(this.title, { lower: true });

  const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i');
  const movieWithSlug = await this.constructor.find({ slug: slugRegEx });

  if (movieWithSlug.length) {
    this.slug = `${this.slug}-${movieWithSlug.length + 1}`;
  }
});

const Movie = mongoose.models.Movie || mongoose.model('Movie', movieSchema);

export default Movie;
