const express=require('express');
const { search } = require('../../../controller/search.controller');
const { pageNo } = require('../../../controller/pageNo.controller');
const gameRouter=express.Router();

gameRouter.get('/page/:page_no',pageNo);
gameRouter.get('/search',search);

module.exports=gameRouter;