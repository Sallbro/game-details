const express=require('express');
const gameInfoRouter=express.Router();

gameInfoRouter.get('/single_game/:id','');
gameInfoRouter.get('/requirements/:id','');
gameInfoRouter.get('/tags/:id','');
gameInfoRouter.get('/languages_supported/:id','');
gameInfoRouter.get('/about_game/:id','');
gameInfoRouter.get('/external_links/:id','');


module.exports=gameInfoRouter;