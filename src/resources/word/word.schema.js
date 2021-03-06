const mongoose = require('mongoose');

const { Schema } = mongoose;

const wordSchema = new Schema(
  {
    wordname: {
      type: String,
      required: true,
      createIndexes: {
        unique: true,
      },
    },
    meaning: {
      type: String,
      required: true,
    },
    extended_description: {
      type: String,
      default: null,
    },
    usages: {
      type: String,
      default: null,
    },
    synonyms: {
      type: String,
      default: null,
    },
    is_anonymous: {
      type: Boolean,
      default: false,
    },
    is_on_report_feed: {
      type: Boolean,
      default: false,
    },
    tags: [
      {
        type: String,
        tagname: String,
      },
    ],
    userId: { type: Schema.Types.ObjectId, ref: 'profiles' },
    favorites: [{ type: Schema.Types.ObjectId, ref: 'profiles', default: null }],
    likes: {
      type: Number,
      default: 0,
    },
    dislikes: {
      type: Number,
      default: 0,
    },
    createdAt: { type: Date },
    updatedAt: { type: Date },
  },
  { timestamps: true }
);

wordSchema.statics.toResponse = (word) => {
  const {
    id,
    wordname,
    meaning,
    extended_description,
    usages,
    synonyms,
    createdAt,
    updatedAt,
    is_anonymous,
    is_on_report_feed,
    tags,
    userId,
    favorites,
    likes,
    dislikes,
  } = word;
  return {
    id,
    wordname,
    meaning,
    extended_description,
    usages,
    synonyms,
    createdAt,
    updatedAt,
    is_anonymous,
    is_on_report_feed,
    tags,
    userId,
    favorites,
    likes,
    dislikes,
  };
};

const Word = mongoose.model('words', wordSchema);

module.exports = Word;
