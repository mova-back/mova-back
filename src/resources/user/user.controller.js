const userModel = require('./user.model');
const refreshTokenModel = require('../refreshToken/refreshToken.model');

const User = require('./user.schema');

const { NotFound, UnprocessableEntity, BadRequest, Unauthorized } = require('../../error');

const { catchErrors } = require('../../middlewares/errorMiddleware');
const {
  generateAccessTokenAndRefreshToken,
  getJwtValueByKey,
  isValidToken,
  isRefreshTokenExpired
} = require('../../utils/security/jwt');
const { isComparePassword } = require('../../utils/security/hash');
const { getBearerTokenFromRequest } = require('../../utils/security/http');

// #route:  POST /user
// #desc:   Register a user
// #access: Public
const registerUser = catchErrors(async (req, res) => {
  const { username: reqUsername, password: reqPassword, email: reqEmail } = req.body;

  if (
    (!reqUsername || !reqPassword || !reqEmail) &&
    req.body.constructor === Object &&
    Object.keys(req.body).length !== 0
  ) {
    throw new NotFound('Unable create user.');
  }

  const email = await userModel.findEmail(reqEmail);
  if (email) {
    throw new UnprocessableEntity('Email already registered');
  }

  const username = await userModel.findUserName(reqUsername);
  if (username) {
    throw new UnprocessableEntity('User already registered');
  }

  const newUser = await userModel.registerUser(req.body);

  // create token
  const token = await generateAccessTokenAndRefreshToken(newUser);

  const result = User.toResponse(newUser);
  return res.status(200).json({ ...result, ...token });
});

// #route:  POST /user/login
// #desc:   login a user
// #access: Public
const loginUser = catchErrors(async (req, res) => {
  const { username: reqUsername, password: reqPassword, email: reqEmail } = req.body;

  // TODO Authentication for email or username ??????????????
  const email = await userModel.findEmail(reqEmail.toLowerCase());
  if (!email) {
    throw new UnprocessableEntity('Authentication failed, email not found');
  }

  const user = await userModel.findUserName(reqUsername);
  if (!user) {
    throw new UnprocessableEntity('Authentication failed, user not found');
  }

  // check if the password is valid
  const isMatch = await isComparePassword(reqPassword, user.password);
  if (!isMatch) {
    throw new BadRequest('Wrong password');
  }

  // retrieve refreshToken and accessToken
  const token = await generateAccessTokenAndRefreshToken(user);

  const result = User.toResponse(user);
  return res.status(200).json({ ...result, ...token });
});

// #route:  GET /user
// #desc:   get a user
// #access: Private
const getUser = catchErrors(async (req, res) => {
  // TODO , I suppose that code is found below need wrap to function because it will be use with all request
  const token = getBearerTokenFromRequest(req);

  const userId = getJwtValueByKey(token, 'id');

  const user = await userModel.findId(userId);
  if (!user) {
    throw new NotFound(`User with the id ${userId} was not found`);
  }

  const result = User.toResponse(user);
  return res.status(200).json(result);
});

// #route:  POST /user/refresh
// #desc:   refresh a token
// #access: Public
const updateToken = catchErrors(async (req, res) => {
  const { accessToken: reqAccessToken, refreshToken: reqIdRefreshToken } = req.body;

  const accessToken = isValidToken(reqAccessToken);
  if (!accessToken) {
    throw new Unauthorized('JWT is not valid');
  }

  const user = await userModel.findId(getJwtValueByKey(reqAccessToken, 'id'));
  if (!user) {
    throw new NotFound('User does not exist');
  }

  const jwtId = getJwtValueByKey(reqAccessToken, 'jti');
  const reqRefreshToken = await refreshTokenModel.findId(reqIdRefreshToken);

  // if refreshToken linked that jwt token
  if (reqRefreshToken.jwtId !== jwtId) {
    throw new Unauthorized('Token does not match with RefreshToken');
  }

  // if refreshToken is expired
  if (isRefreshTokenExpired(reqRefreshToken)) {
    throw new Unauthorized('Refresh Token has expired');
  }

  // dead-token logic for security
  if (reqRefreshToken.used || reqRefreshToken.invalidated) {
    throw new Unauthorized('Refresh Token has been used or invalidated');
  }

  reqRefreshToken.used = true;
  await refreshTokenModel.save(reqRefreshToken);

  // retrieve refreshToken and accessToken
  const token = await generateAccessTokenAndRefreshToken(user);

  const result = User.toResponse(user);
  return res.status(200).json({ ...result, ...token });
});

const updateUser = catchErrors(async (req, res) => {
  const token = getBearerTokenFromRequest(req);

  const userId = getJwtValueByKey(token, 'id');

  const { password } = req.body;

  const user = await userModel.findId(userId);

  const isMatch = await isComparePassword(password, user.password);
  if (!isMatch) {
    throw new BadRequest('Password is incorrect!');
  }

  const result = await userModel.findAndUpdate(userId, req.body);

  return res.status(200).json(User.toResponse(result));
});

// #route:  POST /user/logout
// #desc:   logout a user
// #access: Public
const logout = catchErrors(async (req, res) => {
  const accessToken = getBearerTokenFromRequest(req);
  if (isValidToken(accessToken)) {
    throw new Unauthorized('Unauthorized');
  }

  const jwtId = getJwtValueByKey(accessToken, 'jti');
  const refreshToken = await refreshTokenModel.findJwtId(jwtId);
  if (!refreshToken) {
    throw new Unauthorized('Refresh Token does not exist');
  }

  refreshToken.invalidated = true;
  await refreshTokenModel.save(refreshToken);

  return res.status(200).json({ message: 'Logout successfully' });
});

// #route:  POST /user/logout
// #desc:   logout a user
// #access: Public

module.exports = {
  registerUser,
  loginUser,
  getUser,
  updateToken,
  updateUser,
  logout
};
