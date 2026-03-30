const express = require('express');
const moviesController = require('../controller/controller.js');
const moviesControllerAdmin = require('../controller/controllerAdmin.js');
const router = express.Router();

router.get('/api/movies', moviesController.getAllMovies);
router.post('/api/new-movie', moviesControllerAdmin.createMovie);

router.put('/api/update-movie/:id', moviesControllerAdmin.updateMoviePUT);
router.patch('/api/update-movie/:id', moviesControllerAdmin.updateMoviePATCH);

router.delete('/api/delete-movie/:id', moviesControllerAdmin.deleteMovie)

router.get('/', (req, res) => {
    res.sendFile('../../frontend/index.html')
})

module.exports = router;