const router = require('express').Router();
const { validateUserAuth, validateUpdateUser } = require('../middlewares/validation');

const {
  getAuthUser,
  updateUser
} = require('../controllers/users');

router.get('/me', validateUserAuth, getAuthUser);
router.patch('/me', validateUpdateUser, updateUser);

module.exports = router;