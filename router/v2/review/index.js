const express=require('express');
const { specificReviews, reviews } = require('../../../controller/review.controller');
const reviewRouter=express.Router();

reviewRouter.get('/:id',reviews);
reviewRouter.get('/:category/:id',specificReviews);

module.exports=reviewRouter;