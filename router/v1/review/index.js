const express=require('express');
const { specificReviews, reviewById } = require('../../../controller/review.controller');
const reviewRouter=express.Router();

reviewRouter.get('/:review_id',reviewById);
reviewRouter.get('/:category/:id',specificReviews);

module.exports=reviewRouter;