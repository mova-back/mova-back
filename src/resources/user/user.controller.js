const cryptoRandomString = require('crypto-random-string');
const userModel = require('./user.model');
const codeModel = require('../secretCode/secretCode.model');
const profileModel = require('../profile/profile.model');
const refreshTokenModel = require('../refreshToken/refreshToken.model');
const emailService = require('../../utils/nodemailer');
const { EMAIL_USERNAME } = require('../../config/index');

const User = require('./user.schema');
const Code = require('../secretCode/secretCode.schema');
const Profile = require('../profile/profile.schema');
const RefreshToken = require('../refreshToken/refreshToken.schema');

const { NotFound, UnprocessableEntity, BadRequest, Unauthorized } = require('../../error');
const { UR } = require('../../constants');

const { catchErrors } = require('../../middlewares/errorMiddleware');
const {
  generateAccessTokenAndRefreshToken,
  getJwtValueByKey,
  isValidToken
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
    throw new BadRequest('Please fill all fields correctly.');
  }

  // Password validation ???
  // if (!reqPassword.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{6,}$/)) {
  //   throw new BadRequest(
  //     'Your password must be at least 6 characters long and contain a lowercase letter, an uppercase letter, a numeric digit and a special character.'
  //   );
  // }

  // test validation
  if (
    !reqEmail.match(
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
    )
  ) {
    throw new BadRequest('Your email must be at correctly (with @ symbol)');
  }

  const email = await userModel.findEmail(reqEmail);
  if (email) {
    throw new UnprocessableEntity('Email already registered');
  }

  const username = await userModel.findUserName(reqUsername);
  if (username) {
    throw new UnprocessableEntity('Username already registered');
  }

  const newUser = await userModel.registerUser(req.body);

  // create profile
  const profile = new Profile({
    userId: newUser._id
  });
  await profileModel.save(profile);

  // create token
  const token = await generateAccessTokenAndRefreshToken(newUser);

  const baseUrl = `${req.protocol}://${req.get('host')}`;
  const secretCode = cryptoRandomString({
    length: 6
  });

  // create email verification code
  const newCode = new Code({
    code: secretCode,
    email: newUser.email
  });
  await codeModel.save(newCode);
  const data = {
    from: `YOUR NAME <${EMAIL_USERNAME}>`,
    to: newUser.email,
    subject: 'Your Activation Link for YOUR APP',
    text: `Please use the following link within the next 10 minutes to activate your account on YOUR APP: ${baseUrl}/api/auth/verification/verify-account/${newUser._id}/${secretCode}`,
    html: `<p>Please use the following link within the next 10 minutes to activate your account on YOUR APP: <strong><a href="${baseUrl}/api/auth/verification/verify-account/${newUser._id}/${secretCode}" target="_blank">Email confirm</a></strong></p>`
  };

  await emailService.sendMail(data);

  const result = User.toResponse(newUser);
  return res.status(200).json({ ...result, ...token });
});

// #route:  POST /user/login
// #desc:   login a user
// #access: Public
const loginUser = catchErrors(async (req, res) => {
  const { password: reqPassword, email: reqEmail } = req.body;

  const email = await userModel.findEmail(reqEmail.toLowerCase());
  if (!email) {
    throw new UnprocessableEntity('Authentication failed, email not found');
  }

  const user = await userModel.findEmail(reqEmail);

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

  const user = await userModel.findId(req.userId);
  if (!user) {
    throw new NotFound(`User with the id ${req.userId} was not found`);
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

  const user = await userModel.findId(getJwtValueByKey(reqAccessToken, 'userId'));
  if (!user) {
    throw new NotFound('User does not exist');
  }

  const jwtId = getJwtValueByKey(reqAccessToken, 'jti');
  const reqRefreshToken = await refreshTokenModel.findId(reqIdRefreshToken);

  // if refreshToken is expired
  if (!reqRefreshToken) {
    throw new Unauthorized('Refresh Token has expired');
  }

  // if refreshToken linked that jwt token
  if (reqRefreshToken.jwtId !== jwtId) {
    throw new Unauthorized('Token does not match with RefreshToken');
  }

  // dead-token logic for security
  if (reqRefreshToken.used || reqRefreshToken.invalidated) {
    throw new Unauthorized('Refresh Token has been used or invalidated');
  }

  // reqRefreshToken.used = true;
  // const refreshToken = new RefreshToken(reqRefreshToken);
  // await refreshTokenModel.save(refreshToken);

  // TODO kill token
  await refreshTokenModel.deleteRefreshToken(reqRefreshToken);

  // retrieve refreshToken and accessToken
  const token = await generateAccessTokenAndRefreshToken(user);

  const result = User.toResponse(user);
  return res.status(200).json({ ...result, ...token });
});

const updateUser = catchErrors(async (req, res) => {
  const { password } = req.body;

  const user = await userModel.findId(req.userId);

  const isMatch = await isComparePassword(password, user.password);
  if (!isMatch) {
    throw new BadRequest('Password is incorrect!');
  }

  const result = await userModel.findAndUpdate(req.userId, req.body);

  return res.status(200).json(User.toResponse(result));
});

const changePassword = catchErrors(async (req, res) => {
  const { userId } = req;

  const { old_password, new_password1, new_password2 } = req.body;

  const user = await userModel.findId(req.userId);

  const isMatch = await isComparePassword(old_password, user.password);
  if (!isMatch) {
    throw new BadRequest('Old password is incorrect!');
  }

  if (new_password1 !== new_password2) {
    throw new BadRequest('new_password1 does not match new_password2!');
  }

  userModel.findAndUpdate(userId, { password: new_password1 });

  return res.status(200).json({ message: 'User password has been changed successfully!' });
});

// #route:  POST /user/logout
// #desc:   logout a user
// #access: Public
const logout = catchErrors(async (req, res) => {
  const accessToken = getBearerTokenFromRequest(req);
  if (!isValidToken(accessToken)) {
    throw new Unauthorized('Unauthorized');
  }

  // TODO update token
  const jwtId = getJwtValueByKey(accessToken, 'jti');
  const reqRefreshToken = await refreshTokenModel.findJwtId(jwtId);
  if (!reqRefreshToken) {
    throw new Unauthorized('Refresh Token does not exist');
  }

  reqRefreshToken.invalidated = true;
  const refreshToken = new RefreshToken(reqRefreshToken);
  await refreshTokenModel.save(refreshToken);

  return res.status(204).json({ message: 'Logout successfully' });
});

// #route:  GET /user/send-user-verification-email
// #desc:   Send activation email to registered users email address
// #access: Private
// кнопка "Адправиць яшчэ раз"
const sendVerifyEmail = catchErrors(async (req, res) => {
  const baseUrl = `${req.protocol}://${req.get('host')}`;

  const user = await userModel.findId(req.userId);

  if (!user) {
    throw new NotFound(`User with the id ${req.userId} was not found`);
  }

  await codeModel.deleteMatches(user.email);

  const secretCode = cryptoRandomString({
    length: 6
  });

  const newCode = new Code({
    code: secretCode,
    email: user.email
  });
  await codeModel.save(newCode);

  const data = {
    from: `YOUR NAME <${EMAIL_USERNAME}>`,
    to: user.email,
    subject: 'Your Activation Link for YOUR APP',
    text: `Please use the following link within the next 10 minutes to activate your account on YOUR APP: ${baseUrl}/api/user/verify_email/${user._id}/${secretCode}`,
    html: `<p>Please use the following link within the next 10 minutes to activate your account on YOUR APP: <strong><a href="${baseUrl}/api/user/verify_email/${user._id}/${secretCode}" target="_blank">Email confirm</a></strong></p>`
  };
  await emailService.sendMail(data);

  return res
    .status(204)
    .json({ message: 'The activation link was sent to your registered email address.' });
});

// #route:  GET /user/verify_email:userId/:secretCode
// #desc:   Verify user's email address
// #access: Public
const verifyEmail = catchErrors(async (req, res) => {
  const user = await userModel.findId(req.params.userId);

  const response = await codeModel.findEmailAndSecret(user.email, req.params.secretCode);

  // check is code activated before ? update status used
  if (!response) {
    throw new Unauthorized('Secret Code does not exist');
  }

  if (!user) {
    throw new Unauthorized('Unauthorized');
  }

  // Это поле удалено , потому что появились роли
  // const verifyStatus = true;
  // await codeModel.updateVerifyStatus(user.email, verifyStatus);
  await Profile.updateOne({ userId: user.id }, { role: UR }).exec();
  await codeModel.deleteMatches(user.email);

  const result = User.toResponse(user);
  return res.status(200).json(result);
});

// #route:  POST /user/send-password-reset-email
// #desc:   Reset password of user
// #access: Public
const resetPasswordByEmail = catchErrors(async (req, res) => {
  const { email: reqEmail } = req.body;

  if (!reqEmail) {
    throw new BadRequest('Please provide your registered email address!');
  }

  const user = await userModel.findEmail(reqEmail);
  if (!user) {
    throw new NotFound('User does not exist');
  }

  const secretCode = cryptoRandomString({
    length: 6
  });

  const newCode = new Code({
    code: secretCode,
    email: reqEmail
  });
  await codeModel.save(newCode);

  const data = {
    from: `YOUR NAME <${EMAIL_USERNAME}>`,
    to: reqEmail,
    subject: 'Your Password Reset Code for YOUR APP',
    text: `Please use the following code within the next 10 minutes to reset your password on YOUR APP: ${secretCode}`,
    html: `<p>Please use the following code within the next 10 minutes to reset your password on YOUR APP: <strong>${secretCode}</strong></p>`
  };
  await emailService.sendMail(data);

  return res
    .status(204)
    .json({ message: 'The reset password link was sent to your registered email address.' });
});

module.exports = {
  registerUser,
  loginUser,
  getUser,
  updateToken,
  updateUser,
  changePassword,
  logout,
  sendVerifyEmail,
  verifyEmail,
  resetPasswordByEmail
};
