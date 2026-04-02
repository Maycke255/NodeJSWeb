const path = require('path');
const express = require('express');
const spotikunaiController = require('../controller/spotikunaiController.js');

const router = express.Router();

router.get('/app/spotikunai/all', spotikunaiController.getAllPlaylists);

module.exports = router;