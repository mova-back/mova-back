const mongoose = require('mongoose');

const { Schema } = mongoose;

const wordSchema = new Schema({
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
  userId: { type: Schema.Types.ObjectId, ref: 'userProfile' },
  favorites: { type: Schema.Types.ObjectId, ref: 'userProfile' },
  likesCount: { type: Number, require: true }
});

const Word = mongoose.model('words', wordSchema);

module.exports = Word;
