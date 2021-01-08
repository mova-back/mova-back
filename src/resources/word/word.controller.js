const wordModel = require('./word.model');
const wordSchema = require('./word.schema');
const ratingModel = require('../rating/rating.model');

const { NotFound } = require('../../error');
const { catchErrors } = require('../../middlewares/errorMiddleware');

const createWord = catchErrors(async (req, res) => {
  const { wordname: reqWordname, meaning: reqMeaning } = req.body;

  if (
    (!reqWordname || !reqMeaning) &&
    req.body.constructor === Object &&
    Object.keys(req.body).length !== 0
  ) {
    throw new NotFound('Unable create word.');
  }

  const word = await wordModel.createWord(req.body);
  return res.status(200).json(wordSchema.toResponse(word));
});

const getAllWords = catchErrors(async (_, res) => {
  const words = await wordModel.getAllWords();

  if (!words) {
    throw new NotFound('Words not found.');
  }

  return res.status(200).json(words.map(wordSchema.toResponse));
});

const getWordById = catchErrors(async (req, res) => {
  const { id } = req.params;
  const word = await wordModel.getWordById(id);

  if (!word) {
    throw new NotFound('Word not found.');
  }

  return res.status(200).json(wordSchema.toResponse(word));
});

const updateWord = catchErrors(async (req, res) => {
  const { id } = req.params;
  const word = await wordModel.updateWord(id, req.body);

  if (!word) {
    throw new NotFound('Word not found.');
  }

  const updatedWord = await wordModel.getWordById(id);
  return res.status(200).json(wordSchema.toResponse(updatedWord));
});

const deleteWord = catchErrors(async (req, res) => {
  const { id } = req.params;
  const word = await wordModel.deleteWord(id);

  if (!word) {
    throw new NotFound('Word not found.');
  }

  return res.status(200).json({ message: 'Word was deleted.' });
});

const likeWord = catchErrors(async (req, res) => {
  const { id } = req.params;

  /*
  get userId from auth middleware => get Profile
  */
  const userId = '';

  // roles

  const profile_id = await wordModel.getWordById(userId);

  if (!profile_id) {
    throw new NotFound('Profile not found.');
  }

  const word = await wordModel.getWordById(id);

  if (!word) {
    throw new NotFound('Word not found.');
  }

  const isRating = await ratingModel.findRatingById(id, profile_id);

  if (!isRating) {
    await ratingModel.createRating('like', id, profile_id);
    await wordModel.updateWord({ _id: id }, { $inc: { likes: 1 } });
    return res.status(200).json(true);
  }

  if (isRating.value === 'like') {
    await ratingModel.deleteRating();
    await wordModel.updateWord({ _id: id }, { $inc: { likes: -1 } });
    return res.status(200).json(false);
  }

  const ult = await ratingModel.updateRating(isRating, 'like');
  await wordModel.updateWord({ _id: id }, { $inc: { dislikes: 1, likes: -1 } });

  return res.status(200).json(ult);
});

const dislikeWord = catchErrors(async (req, res) => {
  const { id } = req.params;

  /*
  get userId from auth middleware => get Profile
  */
  const userId = '';

  // roles

  const profile_id = await wordModel.getWordById(userId);

  if (!profile_id) {
    throw new NotFound('Profile not found.');
  }

  const word = await wordModel.getWordById(id);

  if (!word) {
    throw new NotFound('Word not found.');
  }

  const isRating = await ratingModel.findRatingById(id, profile_id);

  if (!isRating) {
    await ratingModel.createRating('dislike', id, profile_id);
    await wordModel.updateWord({ _id: id }, { $inc: { dislikes: 1 } });
    return res.status(200).json(true);
  }

  if (isRating.value === 'dislike') {
    await ratingModel.deleteRating();
    await wordModel.updateWord({ _id: id }, { $inc: { dislikes: -1 } });
    return res.status(200).json(false);
  }

  await ratingModel.updateRating(isRating, 'dislike');
  await wordModel.updateWord({ _id: id }, { $inc: { likes: 1, dislikes: -1 } });

  return res.status(200).json(false);
});

module.exports = {
  createWord,
  getAllWords,
  getWordById,
  updateWord,
  deleteWord,
  likeWord,
  dislikeWord
};
