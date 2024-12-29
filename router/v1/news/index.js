const express=require('express');
const { allnews, announcements } = require('../../../controller/news.controller');
const newsRouter=express.Router();

newsRouter.get('/allnews/:id',allnews);
newsRouter.get('/announcements/:id',announcements);

module.exports=newsRouter;