const mongoose = require('mongoose');
const Movie = require('../models/movie');

const BadDataError = require('../error/BadDataError');
const NotFoundError = require('../error/NotFoundError');
const ForbiddenError = require('../error/ForbiddenError');

module.exports.getMovies = (req, res, next) => {
  const owner = req.user._id;
  Movie.find({ owner })
    .populate(['owner'])
    .then((movies) => {
      res.send(movies);
    })
    .catch((err) => { next(err); });
};

module.exports.createMovie = (req, res, next) => {
  const owner = req.user._id;
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner,
  })
    .then((movie) => {
      movie.populate('owner')
        .then((newMovie) => res.status(200).send(newMovie))
        .catch((err) => next(err));
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadDataError('Переданы некорректные данные'));
      } else { next(err); }
    });
};

module.exports.deleteMovie = (req, res, next) => {
  const userId = req.user._id;
  const { movieId } = req.params;
  Movie.findById(movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError(`Фильм с id:${movieId} не найден`);
      } else if (movie.owner.valueOf() === userId) {
        movie.deleteOne()
          .then(res.send({ message: 'Фильм удалён!' }))
          .catch((err) => next(err));
      } else {
        throw new ForbiddenError('Вы не можете удалить чужой фильм');
      }
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadDataError('Передан некорректный id'));
      } else { next(err); }
    });
};
