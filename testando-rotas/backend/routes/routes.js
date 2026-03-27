const express = require('express');
const moviesController = require('../controller/controller.js');
const moviesControllerAdmin = require('../controller/controllerAdmin.js');
const router = express.Router();

router.get('/api/movies', moviesController.getAllMovies);
router.post('/api/new-movie', moviesControllerAdmin.createMovie);

router.get('/', (req, res) => {
    res.sendFile('../../frontend/index.html')
})

module.exports = router;