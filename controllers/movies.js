const httpConstants = require('http2').constants;
const { default: mongoose } = require('mongoose');
const Movie = require('../models/movie');
const BadReqError = require('../errors/bad-req-err');
const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbid-err');

const getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => {
      const myMovies = [];
      movies.forEach((movie) => {
        const ownerId = movie.owner.toString();
        if (ownerId === req.user._id) {
          myMovies.push(movie);
        }
        return myMovies;
      });
      res.send({ myMovies });
    })
    .catch((e) => {
      if (e instanceof mongoose.Error.CastError) {
        return next(new BadReqError('Переданы некорректные данные'));
      }
      return next(e);
    });
};

const createMovie = (req, res, next) => {
  const {
    country, director, duration,
    year, description, image, trailerLink,
    nameRU, nameEN, thumbnail, movieId,
  } = req.body;
  const owner = req.user._id;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    nameRU,
    nameEN,
    movieId,
    owner,
  })
    .then((movie) => res.status(httpConstants.HTTP_STATUS_CREATED).send({ movie }))
    .catch((e) => {
      if (e instanceof mongoose.Error.ValidationError) {
        return next(new BadReqError('Переданы некорректные данные'));
      }
      return next(e);
    });
};

const deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .orFail()
    .then((movie) => {
      const ownerId = movie.owner.toString();
      if (ownerId !== req.user._id) {
        return next(new ForbiddenError('Карточка принадлежит не вам'));
      }
      return Movie.deleteOne(movie)
        .orFail()
        .then(() => res.send({ movie }));
    })
    .catch((e) => {
      if (e instanceof mongoose.Error.DocumentNotFoundError) {
        return next(new NotFoundError('Карточка не найдена'));
      }
      return next(e);
    });
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
