const router = require('express').Router();
const { validateMovieInfo, validateMovieId } = require('../middlewares/validation');

const {
  getMovies,
  createMovies,
  deleteMovies,
} = require('../controllers/movies');

router.get('/', getMovies);
router.post('/', validateMovieInfo, createMovies);
router.delete('/:_id', validateMovieId, deleteMovies);

module.exports = router;