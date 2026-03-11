const express = require('express');
const router = express.Router();
const path = require('path');

const postsController = require('../controllers/postController');
// const adminController = require('./controllers/adminController');

//Rota para obter todos os posts
router.get('/api/posts', postsController.allPosts);

//Enviando o index.html, principal
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/index.html'));
});

module.exports = router;