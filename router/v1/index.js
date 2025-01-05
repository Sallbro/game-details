const express = require('express');
const gameInfoRouter = require('./gameInfo');
const newsRouter = require('./news');
const reviewRouter = require('./review');
const mediaRouter = require('./media');
const guideRouter = require('./guide');
const devInfoRouter = require('./developerInfo');
const gameRouter = require('./game');
const v1Router = express.Router();

v1Router.get('/healthcheck', (req, res) => {
    try {
        res.send('everything good api/v1')
    } catch (error) {
        res.send('something went wrong api/v1');
    }
});
v1Router.use('/', gameRouter);
v1Router.use('/gameinfo', gameInfoRouter);
v1Router.use('/devinfo', devInfoRouter);
v1Router.use('/guides', guideRouter);
v1Router.use('/media', mediaRouter);
v1Router.use('/review', reviewRouter);
v1Router.use('/news', newsRouter);


module.exports = v1Router;