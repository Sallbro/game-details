const express=require('express');
const { developerName, publisher, franchise } = require('../../../controller/devInfo.controller');
const devInfoRouter=express.Router();

// devInfoRouter.get('/','');
devInfoRouter.get('/franchise/:id',franchise);
devInfoRouter.get('/publisher/:id',publisher);
devInfoRouter.get('/developer_name/:id',developerName);

module.exports=devInfoRouter;