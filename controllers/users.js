const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Joi } = require('celebrate');
const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;
const BadDataError = require('../error/BadDataError');
const NotFoundError = require('../error/NotFoundError');
const ConflictError = require('../error/ConflictError');

module.exports.celebrateParams = {
  name: Joi.string().required().min(2).max(30),
  email: Joi.string().required().email(),
  password: Joi.string().required(),
};

const getUserById = (userId, req, res, next) => {
  User.findById(userId)
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        throw new NotFoundError('Пользователь не найден');
      }
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadDataError('Пользователь не найден'));
      } else { next(err); }
    });
};

const userDataUpdate = (params, req, res, next) => {
  const id = req.user._id;
  User.findByIdAndUpdate(id, params, { new: true, runValidators: true })
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        throw new NotFoundError('Пользователь не найден');
      }
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadDataError('Переданы некорректные данные'));
      } else if (err.code === 11000 || err.code === 409) {
        next(new ConflictError('Данный email уже зарегистрирован.'));
      } else { next(err); }
    });
};
module.exports.createUser = (req, res, next) => {
  const {
    name,
    email,
    password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        name,
        email,
        password: hash,
      })
        .then((user) => {
          const dataUser = user.toObject();
          delete dataUser.password;
          res
            .status(200)
            .send(dataUser);
        })
        .catch((err) => {
          if (err instanceof mongoose.Error.ValidationError) {
            next(new BadDataError('Переданы некорректные данные'));
          } else if (err.code === 11000 || err.code === 409) {
            next(new ConflictError('Данный email уже зарегистрирован.'));
          } else { next(err); }
        });
    })
    .catch((err) => { next(err); });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: 'none',
        secure: true,

      });
      res.status(200).send({ message: 'Успешный вход!' });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.logout = (req, res) => {
  res.clearCookie('jwt', {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
  });
  res.status(200).send({ message: 'Успешный выход!' });
};

module.exports.getUserInfo = (req, res, next) => {
  const userId = req.user._id;
  getUserById(userId, req, res, next);
};

module.exports.updateUserInfo = (req, res, next) => {
  const { name, email } = req.body;
  userDataUpdate({ name, email }, req, res, next);
};
