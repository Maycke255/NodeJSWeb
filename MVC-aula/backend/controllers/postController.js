//Controller já dita o que o backend deve enviar para o front, ele obtem as informações do model e envia para
//as pages, e como uma ponte
const postModel = require('../models/postModel');

class PostsController {
    //GET: OBTER TODOS OS POSTS
    allPosts (req, res) {
        const posts = postModel.getAllPosts();

        res.json({ success: true, data: posts });
    }
}

module.exports = new PostsController();
