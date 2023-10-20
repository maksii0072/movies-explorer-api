const bcrypt = require('bcryptjs');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const BadRequest = require('../error/BadDataError');
const NotFound = require('../error/NotFoundError');
const Conflict = require('../error/ConflictError');
const NotAuth = require('../error/AuthorizationError');

const createUser = (req, res, next) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return next(new BadRequest('Поля не могут быть пустыми'));
  }
  return bcrypt.hash(password, 10, (error, hash) => {
    return User.create({ name, email, password: hash })
      .then((data) => {
        res.status(201).send({
          email: data.email,
          name: data.name
        });
      })
      .catch((err) => {
        if (err.name === 'ValidationError') {
          return next(new BadRequest(err.message));
        }
        if (err.code === 11000) {
          next(new Conflict('Пользователь с таким Email уже зарегистрирован'));
        } else {
          next(err);
        }
      });
  })
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new BadRequest('Поля email или пароль не могут быть пустыми'));
  }
  return User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user || !user.password) {
        return next(new NotAuth('Неправильные почта или пароль'));
      }
      return bcrypt.compare(password, user.password, (error, isValidPassword) => {
        if (!isValidPassword) {
          return next(new NotAuth('Неправильные почта или пароль'));
        }
        const token = jwt.sign({ _id: user._id }, process.env.NODE_ENV === 'production' ? process.env.JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
        res.send({ token });
      })
    })
}

const getAuthUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        next(new NotFound('Пользователь с указанным _id не найден.'));
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Некорректный _id пользователя.'));
      } else {
        next(err);
      }
    });
}

const updateUser = (req, res, next) => {
  const userId = req.user._id;

  const { name, email } = req.body;
  User.findByIdAndUpdate(userId, { name, email }, {
    new: true,
    runVlidators: true
  })
    .then((user) => {
      if (!user) {
        return next(new NotFound('Пользователь с указанным _id не найден.'));
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные.'));
      } else {
        next(err);
      }
    });
}

module.exports = {
  createUser,
  login,
  getAuthUser,
  updateUser,
}