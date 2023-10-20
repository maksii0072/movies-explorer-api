const jwt = require('jsonwebtoken');
const NotAuth = require('../error/AuthorizationError');

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new NotAuth('Необходима авторизация'));
    return;
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, process.env.NODE_ENV === 'production' ? process.env.JWT_SECRET : 'dev-secret');
  } catch (err) {
    next(new NotAuth('Необходима авторизация'));
    return;
  }

  req.user = payload;
  next();
};

module.exports = auth;