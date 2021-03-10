const nodemailer = require('nodemailer');

const { EMAIL_HOST, EMAIL_PORT, EMAIL_USERNAME, EMAIL_PW } = require('../config/index');

const emailService = nodemailer.createTransport({
  host: EMAIL_HOST,
  port: EMAIL_PORT,
  secure: false,
  auth: {
    user: EMAIL_USERNAME,
    pass: EMAIL_PW,
  },
});

module.exports = emailService;
