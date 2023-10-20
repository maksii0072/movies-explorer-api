const router = require('express').Router();
const usersRouter = require('./users');
const moviesRouter = require('./movies');
const { createUser, login } = require('../controllers/users');
const { validateUserInfo, validateUserAuth } = require('../middlewares/validation');
const auth = require('../middlewares/auth');
const NotFoundError = require('../error/NotFoundError');

router.post('/signup', validateUserInfo, createUser);
router.post('/signin', validateUserAuth, login);
router.use(auth);
router.use('/users', usersRouter);
router.use('/movies', moviesRouter);
router.use('*', (req, res, next) => {
  next(new NotFoundError('Нет такой страницы'));
});

module.exports = router;