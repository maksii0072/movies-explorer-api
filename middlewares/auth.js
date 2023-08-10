const token = require('jsonwebtoken');
const AuthorizationError = require('../error/AuthorizationError');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { jwt } = req.cookies;

  if (!jwt) {
    next(new AuthorizationError('Необходима авторизация!'));
    return;
  }

  let payload;

  try {
    payload = token.verify(jwt, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    next(new AuthorizationError('Необходима авторизация!!'));
    return;
  }

  req.user = payload;

  next();
};