const rating = require('./rating.schema');

const createRating = async (value, word_id, profile_id) => rating.create({ value, word_id, profile_id });

const findRatingById = async (word_id, profile_id) => rating.findOne({ word_id, profile_id });

const updateRating = async (isRating, type) =>
  rating.updateOne({ _id: isRating._id }, { ...isRating.toObject(), updated_at: Date.now(), value: type });

const deleteRating = async () => rating.deleteOne({});

module.exports = { createRating, findRatingById, deleteRating, updateRating };
