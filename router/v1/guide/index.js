const express = require('express');
const { guides, fullGuide } = require('../../../controller/guide.controller');
const guideRouter = express.Router();

guideRouter.get('/:category/:id', guides);
guideRouter.get('/:guide_id', fullGuide);

module.exports = guideRouter;