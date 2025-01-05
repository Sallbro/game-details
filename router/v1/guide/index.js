const express=require('express');
const { guides, fullGuide } = require('../../../controller/guide.controller');
const guideRouter=express.Router();

guideRouter.get('/:id/:page_no',guides);
guideRouter.get('/:guide_id',fullGuide);

module.exports=guideRouter;