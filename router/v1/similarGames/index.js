const express=require('express');
const { similarGames } = require('../../../controller/similarGame.controller');
const similarGamesRouter=express.Router();

similarGamesRouter.get('/:id',similarGames);

module.exports=similarGamesRouter;