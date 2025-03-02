const express=require('express');
const { comments } = require('../../../controller/comment.controller');
const commentRouter=express.Router();

commentRouter.get('/:comment_id',comments);

module.exports=commentRouter;