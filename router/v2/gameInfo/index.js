const express=require('express');
const { single_game, requirements, tags, languages_supported, about_game, external_links } = require('../../../controller/gameInfo.controller');
const gameInfoRouter=express.Router();

gameInfoRouter.get('/single_game/:id',single_game);
gameInfoRouter.get('/requirements/:id',requirements);
gameInfoRouter.get('/tags/:id',tags);
gameInfoRouter.get('/languages_supported/:id',languages_supported);
gameInfoRouter.get('/about_game/:id',about_game);
gameInfoRouter.get('/external_links/:id',external_links);

module.exports=gameInfoRouter;