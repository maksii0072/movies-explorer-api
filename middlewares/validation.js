const { celebrate, Joi } = require('celebrate');

const regexLink = /https?:\/\/(www\.)?[a-z0-9.-@_:%=]{1,128}\.[a-z]{1,64}[a-z0-9-_~:\/?#[\]@!\$&'()*+,;=]*/i;
const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const validateUserInfo = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().required().pattern(regexEmail),
    password: Joi.string().required(),
  }),
});

const validateUserAuth = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().pattern(regexEmail),
    password: Joi.string().required(),
  }),
});

const validateUpdateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().required().pattern(regexEmail),
  }),
});

const validateMovieInfo = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.number().required(),
    description: Joi.string().required(),
    image: Joi.string().required().pattern(regexLink),
    trailerLink: Joi.string().required().pattern(regexLink),
    thumbnail: Joi.string().required().pattern(regexLink),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});

const validateMovieId = celebrate({
  params: Joi.object().keys({
    _id: Joi.string().hex().length(24).required(),
  }),
});

module.exports = {
  validateUserInfo,
  validateUserAuth,
  validateUpdateUser,
  validateMovieInfo,
  validateMovieId
};