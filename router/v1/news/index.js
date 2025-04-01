const express=require('express');
const { news } = require('../../../controller/news.controller');
const newsRouter=express.Router();

newsRouter.get('/:news_category/:id',news);

module.exports=newsRouter;