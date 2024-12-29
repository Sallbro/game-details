const express = require('express');
const gameInfoRouter = require('./gameInfo');
const newsRouter = require('./news');
const reviewRouter = require('./review');
const mediaRouter = require('./media');
const guideRouter = require('./guide');
const devInfoRouter = require('./developerInfo');
const v2Router = express.Router();

v2Router.use('/gameinfo', gameInfoRouter);
v2Router.use('/devinfo', devInfoRouter);
v2Router.use('/guide', guideRouter);
v2Router.use('/media', mediaRouter);
v2Router.use('/review', reviewRouter);
v2Router.use('/news', newsRouter);


module.exports = v2Router;