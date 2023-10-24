const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  updateProfile, getUserInfo,
} = require('../controllers/users');

router.get('/me', getUserInfo);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required(),
  }),
}), updateProfile);

module.exports = router;
