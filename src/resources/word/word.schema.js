const mongoose = require('mongoose');

const { Schema } = mongoose;

const wordSchema = new Schema(
  {
    wordname: {
      type: String,
      required: true,
      createIndexes: {
        unique: true
      }
    },
    author: { type: String },
    meaning: {
      type: String,
      required: true
    },
    extended_description: {
      type: String,
      default: null
    },
    usages: {
      type: String,
      default: null
    },
    synonyms: {
      type: String,
      default: null
    },
    created_at: {
      type: Date,
      default: Date.now()
    },
    updated_at: {
      type: Date,
      default: Date.now()
    },
    is_anonymous: {
      type: Boolean,
      default: false
    },
    is_on_report_feed: {
      type: Boolean,
      default: false
    },
    tags: [
      {
        type: String,
        tagname: String
      }
    ],
    userId: { type: Schema.Types.ObjectId, ref: 'profiles' },
    favorites: { type: Schema.Types.ObjectId, ref: 'profiles' },
    likes: {
      type: Number,
      default: 0
    },
    dislikes: {
      type: Number,
      default: 0
    }
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
    created_at,
    updated_at,
    is_anonymous,
    is_on_report_feed,
    tags,
    userId,
    favoriters,
    likes,
    dislikes
  } = word;
  return {
    id,
    wordname,
    meaning,
    extended_description,
    usages,
    synonyms,
    created_at,
    updated_at,
    is_anonymous,
    is_on_report_feed,
    tags,
    userId,
    favoriters,
    likes,
    dislikes
  };
};

const Word = mongoose.model('words', wordSchema);

module.exports = Word;
