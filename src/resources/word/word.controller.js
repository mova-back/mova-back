const wordModel = require('./word.model');
const wordSchema = require('./word.schema');
const ratingModel = require('../rating/rating.model');
const profileModel = require('../profile/profile.model');

const { NotFound } = require('../../error');
const { catchErrors } = require('../../middlewares/errorMiddleware');

// #route:  POST /word
// #desc:   create a word
// #access: Private
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

// #route:  GET /word
// #desc:   get words
// #access: Private
const getAllWords = catchErrors(async (_, res) => {
  const words = await wordModel.getAllWords();

  if (!words) {
    throw new NotFound('Words not found.');
  }

  return res.status(200).json(words.map(wordSchema.toResponse));
});

// #route:  GET /word/:id
// #desc:   get a word
// #access: Private
const getWordById = catchErrors(async (req, res) => {
  const { id } = req.params;
  const word = await wordModel.getWordById(id);

  if (!word) {
    throw new NotFound('Word not found.');
  }

  return res.status(200).json(wordSchema.toResponse(word));
});

// #route:  PUT /word/:id
// #desc:   update a word
// #access: Private
const updateWord = catchErrors(async (req, res) => {
  const { id } = req.params;
  const word = await wordModel.updateWord(id, req.body);

  if (!word) {
    throw new NotFound('Word not found.');
  }

  const updatedWord = await wordModel.getWordById(id);
  return res.status(200).json(wordSchema.toResponse(updatedWord));
});

// #route:  DELETE /word/:id
// #desc:   delete a word
// #access: Private
const deleteWord = catchErrors(async (req, res) => {
  const { id } = req.params;
  const word = await wordModel.deleteWord(id);

  if (!word) {
    throw new NotFound('Word not found.');
  }

  return res.status(200).json({ message: 'Word was deleted.' });
});

// #route:  PUT /word/:id/like
// #desc:   like a word
// #access: Private
const likeWord = catchErrors(async (req, res) => {
  const { id } = req.params;
  const { userId } = req;

  const profile_id = await profileModel.findProfileByUserId(userId);

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

// #route:  PUT /word/:id/dislike
// #desc:   like a word
// #access: Private
const dislikeWord = catchErrors(async (req, res) => {
  const { id } = req.params;
  const { userId } = req;

  const profile_id = await profileModel.findProfileByUserId(userId);

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

// #route:  GET /feed
// #desc:   get feed
// #access: Private
const feedWords = catchErrors(async (_, res) => {
  // req ?query
  const offset = 0;
  const limitPage = 20;
  const feed = await wordSchema.find({}, null, {
    skip: offset,
    limit: limitPage,
    sort: { likes: 'descending' }
  });

  return res.status(200).json(feed.map(wordSchema.toResponse));
});

module.exports = {
  createWord,
  getAllWords,
  getWordById,
  updateWord,
  deleteWord,
  likeWord,
  dislikeWord,
  feedWords
};
