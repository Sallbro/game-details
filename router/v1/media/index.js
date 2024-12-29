const express=require('express');
const mediaRouter=express.Router();

mediaRouter.get('/','');
mediaRouter.get('/screenshots/:id','');
mediaRouter.get('/videos/:id','');
mediaRouter.get('/broadcasts/:id','');
mediaRouter.get('/artwork/:id','');

module.exports=mediaRouter;