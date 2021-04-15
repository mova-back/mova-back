const mongoose = require('mongoose');

const { Schema } = mongoose;

const schema = new Schema(
  {
    wordname: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (v) => typeof v === 'string' && v.length >= 2 && v.length <= 100,
        message: (prop) => `${prop.value} - string; min 2 chars; max 100 chars`,
      },
    },
    meaning: {
      type: String,
      required: true,
      validate: {
        validator: (v) => typeof v === 'string' && v.length >= 1 && v.length <= 250,
        message: (prop) => `${prop.value} - string; min 1 chars; max 250 chars`,
      },
    },
    extended_description: {
      type: String,
      validate: {
        validator: (v) => typeof v === 'string' && v.length <= 250,
        message: (prop) => `${prop.value} - string; min 1 chars; max 250 chars`,
      },
    },
    tags: {
      type: Array,
      validate: {
        validator: (v) => Array.isArray(v),
        message: (prop) => `${prop.value} - Array`,
      },
    },
    usages: {
      type: String,
      validate: {
        validator: (v) => typeof v === 'string' && v.length <= 250,
        message: (prop) => `${prop.value} - string; min 5 chars; max 250 chars`,
      },
    },
    swearing: {
      type: Boolean,
      default: false,
      validate: {
        validator: (v) => typeof v === 'boolean',
        message: (prop) => `${prop.value} - string; min 5 chars; max 250 chars`,
      },
    },
    likes: {
      type: Array,
      validate: {
        validator: (v) => Array.isArray(v),
        message: (prop) => `${prop.value} - Array`,
      },
    },
    dislikes: {
      type: Array,
      validate: {
        validator: (v) => Array.isArray(v),
        message: (prop) => `${prop.value} - Array`,
      },
    },
    complaints: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'report',
      },
    ],
    createdByUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    favoriteByUserdIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
      },
    ],
  },
  { timestamps: true }
);

const WordSchema = mongoose.model('word', schema);

module.exports = { WordSchema };
