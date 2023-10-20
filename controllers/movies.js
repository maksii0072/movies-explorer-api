const Movie = require('../models/movie');
const BadRequest = require('../error/BadDataError');
const NotFound = require('../error/NotFoundError');
const Forbidden = require('../error/ForbiddenError');

const getMovies = (req, res, next) => {
  const userId = req.user._id;

  Movie.find({ owner: userId })
    .then((movie) => {
      res.send(movie);
    })
    .catch(next);
};

const createMovies = (req, res, next) => {
  const owner = req.user._id;
  const { country, director, duration, year, description, image, trailerLink, thumbnail, movieId, nameRU, nameEN } = req.body;
  Movie.create({ country, director, duration, year, description, image, trailerLink, thumbnail, movieId, nameRU, nameEN, owner })
    .then((movie) => {
      res.status(201).send(movie);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
}

const deleteMovies = (req, res, next) => {
  const { _id } = req.params;

  Movie.findById(_id)
    .then((movie) => {
      if (!movie) {
        return next(new NotFound('Фильм не найден'));
      }
      if (!movie.owner.equals(req.user._id)) {
        next(new Forbidden('Нет прав на удаление'));
      } else {
        movie.deleteOne()
          .then(() => res.send({ message: 'Фильм успешно удалён' }))
          .catch(next);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Некорректный Id фильма'));
      } else {
        next(err);
      }
    });
}

module.exports = {
  getMovies,
  createMovies,
  deleteMovies
}