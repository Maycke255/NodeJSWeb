const path = require('path');
const express = require('express');
const spotikunaiController = require('../controller/spotikunaiController.js');
const spotikunaiControllerAdmin = require('../controller/spotikunaiControllerAdmin.js');

const router = express.Router();

// Playlists públicas (leitura)
router.get('/api/playlists', spotikunaiController.getAllPlaylists);
router.get('/api/playlists/:id', spotikunaiController.getPlaylistById);

// Playlists admin (mutações)
router.post('/api/playlists', spotikunaiControllerAdmin.createPlaylist);  // Cria nova
router.put('/api/playlists/:id', spotikunaiControllerAdmin.updateNameAndTagsPlaylist);  // Atualiza name/tags

// Músicas (sub-recurso)
router.post('/api/playlists/:id/songs', spotikunaiControllerAdmin.addMusicPlaylist);  // Adiciona música
router.delete('/api/playlists/:id/songs/:songId', spotikunaiControllerAdmin.delMusicById);  // Remove música

// Tags (sub-recurso)
router.post('/api/playlists/:id/tags', spotikunaiControllerAdmin.addNewTagsForPlaylist);  // Adiciona tags

// Deletar playlist
router.delete('/api/playlists/:id', spotikunaiControllerAdmin.delPlaylistById);

module.exports = router;