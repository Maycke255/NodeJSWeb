const path = require('path');
const express = require('express');
const spotikunaiController = require('../controller/spotikunaiController.js');
const spotikunaiControllerAdmin = require('../controller/spotikunaiControllerAdmin.js');

const router = express.Router();

router.get('/app/spotikunai/', spotikunaiController.getAllPlaylists);
router.get('/app/spotikunai/:id', spotikunaiController.getPlaylistById);

router.post('/app/spotikunai/create', spotikunaiControllerAdmin.createPlaylist);

module.exports = router;