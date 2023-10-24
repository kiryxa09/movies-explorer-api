const jwt = require('jsonwebtoken');
const UnAuthError = require('../errors/unauth-err');

const handleAuthError = () => {
  throw new UnAuthError('Необходима авторизация');
};

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return handleAuthError(res);
  }

  let payload;

  try {
    payload = jwt.verify(token, 'super-strong-secret');
  } catch (err) {
    return handleAuthError(res);
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
  return true;
};
