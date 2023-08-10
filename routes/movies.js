const moviesRouter = require('express').Router();
const { Joi, celebrate } = require('celebrate');
const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');
const { joiRegex } = require('../utils/regex');

moviesRouter.get('/', getMovies);
moviesRouter.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().custom(joiRegex),
    trailerLink: Joi.string().required().custom(joiRegex),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    thumbnail: Joi.string().required().custom(joiRegex),
    movieId: Joi.number().required(),
  }),
}), createMovie);
moviesRouter.delete('/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().hex().length(24).required(),
  }),
}), deleteMovie);

module.exports = moviesRouter;