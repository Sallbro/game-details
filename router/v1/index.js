const express = require('express');
const gameInfoRouter = require('./gameInfo');
const newsRouter = require('./news');
const reviewRouter = require('./review');
const mediaRouter = require('./media');
const guideRouter = require('./guide');
const devInfoRouter = require('./developerInfo');
const gameRouter = require('./game');
const commentRouter = require('./comment');
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
v1Router.use('/guides', guideRouter); // pending
v1Router.use('/media', mediaRouter); 
v1Router.use('/reviews', reviewRouter);
v1Router.use('/news', newsRouter);
v1Router.use('/comments', commentRouter);



module.exports = v1Router;