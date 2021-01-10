const mongoose = require('mongoose');

const { Schema } = mongoose;

const RatingSchema = new Schema(
  {
    value: {
      type: String,
      enum: ['like', 'dislike'],
      required: true
    },
    profile_id: {
      type: mongoose.Schema.ObjectId,
      ref: 'profiles',
      required: true
    },
    word_id: {
      type: mongoose.Schema.ObjectId,
      ref: 'words',
      required: true
    },
    created_at: {
      type: Date,
      default: Date.now()
    },
    updated_at: {
      type: Date,
      default: Date.now()
    }
  },
  { timestamps: true }
);

const rating = mongoose.model('rating', RatingSchema);
module.exports = rating;
