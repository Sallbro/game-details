const express=require('express');
const { screenshots, videos, broadcasts, artwork } = require('../../../controller/media.controller');
const mediaRouter=express.Router();

// mediaRouter.get('/','');
mediaRouter.get('/screenshots/:id',screenshots);
mediaRouter.get('/videos/:id',videos);
mediaRouter.get('/broadcasts/:id',broadcasts);
mediaRouter.get('/artworks/:id',artwork);

module.exports=mediaRouter;