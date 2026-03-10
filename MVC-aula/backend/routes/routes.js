const express = require('express');
const router = express.Router();

const postsController = require('./controllers/postsController');
const adminController = require('./controllers/adminController');

router.get('/', postsController);

module.exports(router);