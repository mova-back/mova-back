const mongoose = require('mongoose');

const { Schema } = mongoose;
const ObjectIdSchema = Schema.ObjectId;

const schema = new Schema(
  {
    // TODO :connect to userSchema
    _id: {
      type: ObjectIdSchema,
      auto: true,
      validate: {
        validator: (v) => typeof v === 'object',
        message: (prop) => `${prop.value} - object`,
      },
    },
    wordname: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (v) => typeof v === 'string' && v.length >= 2 && v.length <= 100,
        message: (prop) => `${prop.value} - string; min 2 chars; max 100 chars`,
      },
    },
    userId: {
      type: String,
      required: true,
      // TODO: populate
    },
    meaning: {
      type: String,
      required: true,
      validate: {
        validator: (v) => typeof v === 'string' && v.length >= 1 && v.length <= 250,
        message: (prop) => `${prop.value} - string; min 2 chars; max 100 chars`,
      },
    },
    extended_description: {
      type: String,
      validate: {
        validator: (v) => typeof v === 'string' && v.length >= 1 && v.length <= 250,
        message: (prop) => `${prop.value} - string; min 2 chars; max 100 chars`,
      },
    },
    tags: {
      type: Array,
      validate: {
        validator: (v) => Array.isArray(v),
        message: (prop) => `${prop.value} - Array`,
      },
    },
    rating: {},
    likes: {
      type: Number,
      required: true,
      default: 0,
      validate: {
        validator: (v) => Number.isInteger(v),
        message: (prop) => `${prop.value} - number`,
      },
    },
    dislikes: {
      type: Number,
      required: true,
      default: 0,
      validate: {
        validator: (v) => Number.isInteger(v),
        message: (prop) => `${prop.value} - number`,
      },
    },
  },
  { timestamps: true }
);

const WordSchema = mongoose.model('word', schema);

module.exports = { WordSchema };
