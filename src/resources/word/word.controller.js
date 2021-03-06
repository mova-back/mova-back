const wordModel = require('./word.model');
const wordSchema = require('./word.schema');
const ratingModel = require('../rating/rating.model');
const profileModel = require('../profile/profile.model');

const { NotFound, UnprocessableEntity } = require('../../error');
const { catchErrors } = require('../../middlewares/errorMiddleware');

// #route:  POST /word
// #desc:   create a word
// #access: Private
const createWord = catchErrors(async (req, res) => {
  const { wordname: reqWordname, meaning: reqMeaning } = req.body;
  const { userId } = req;

  if (!userId) {
    throw new NotFound('Not found user');
  }

  if ((!reqWordname || !reqMeaning) && req.body.constructor === Object && Object.keys(req.body).length !== 0) {
    throw new NotFound('Unable create word.');
  }

  const word = await wordModel.createWord({ ...req.body, userId });
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
    await wordModel.updateWord({ _id: id }, { $inc: { likes: -1 } });
    await ratingModel.deleteRating();
    return res.status(200).json(false);
  }

  if (isRating.value === 'dislike') {
    await ratingModel.updateRating(isRating, 'like');
    await wordModel.updateWord({ _id: id }, { $inc: { dislikes: -1, likes: 1 } });
    return res.status(200).json(true);
  }

  throw new NotFound('ERROR');
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
    await wordModel.updateWord({ _id: id }, { $inc: { dislikes: -1 } });
    await ratingModel.deleteRating();
    return res.status(200).json(false);
  }

  if (isRating.value === 'like') {
    await ratingModel.updateRating(isRating, 'dislike');
    await wordModel.updateWord({ _id: id }, { $inc: { likes: -1, dislikes: 1 } });
    return res.status(200).json(true);
  }

  throw new NotFound('ERROR');
});

// #route:  GET /feed
// #desc:   get feed
// #access: Private
const feedWords = catchErrors(async (_, res) => {
  // req ?query
  const offset = 0;
  const limitPage = 20;
  const feed = await wordModel.sortByFilter(offset, limitPage);

  if (!feed) {
    throw new NotFound('Feed not found.');
  }

  return res.status(200).json({ data: feed.map(wordSchema.toResponse) });
});

// #route:  POST /word/:id/favorite
// #desc:   add a favorite word
// #access: Private
const favoriteWord = catchErrors(async (req, res) => {
  const { id } = req.params;
  const { userId } = req;
  const word = await wordModel.getWordById(id);

  if (!word) {
    throw new NotFound('Word not found.');
  }

  if (word.favorites.includes(userId)) {
    throw new UnprocessableEntity('Word was added');
  }

  const addFavorite = await wordSchema.findByIdAndUpdate(
    { _id: id },
    {
      $push: { favorites: userId },
    },
    {
      new: true,
    }
  );

  return res.status(200).json(wordSchema.toResponse(addFavorite));
});

// #route:  DELETE /word/:id/unfavorite
// #desc:   delete a favorite word
// #access: Private
const unfavoriteWord = catchErrors(async (req, res) => {
  const { id } = req.params;
  const { userId } = req;
  const word = await wordModel.getWordById(id);

  if (!word) {
    throw new NotFound('Word not found.');
  }

  if (!word.favorites.includes(userId)) {
    throw new UnprocessableEntity('Word was not added');
  }

  const deleteFavorite = await wordSchema.findByIdAndUpdate(
    { _id: id },
    {
      $pull: { favorites: userId },
    },
    {
      new: true,
    }
  );

  return res.status(200).json(wordSchema.toResponse(deleteFavorite));
});

module.exports = {
  createWord,
  getAllWords,
  getWordById,
  updateWord,
  deleteWord,
  likeWord,
  dislikeWord,
  feedWords,
  favoriteWord,
  unfavoriteWord,
};
