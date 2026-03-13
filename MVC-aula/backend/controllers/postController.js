//Controller já dita o que o backend deve enviar para o front, ele obtem as informações do model e envia para
//as pages, e como uma ponte
const postModel = require('../models/postModel');

//Definimos uma classe com métodos que substituem nosso antigo server, com o que teria no callback das rotas
class PostsController {
    //GET: OBTER TODOS OS POSTS
    allPosts (req, res) {
        try {
            const posts = postModel.getAllPosts();

            if (posts.length === 0) {
                return res.status(200).json({
                    success: true,
                    data: [],
                    message: 'Nenhum post encontrado',
                })
            }
            
            return res.status(200).json({ 
                success: true,
                data: posts 
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                data: [],
                message: 'Erro ao carregar posts.',
                error: error.message
            })
        }
    }

    //GET: OBTER POST ESPECIFICO
    showPost (req, res) {
        const { id } = req.parms;

        const post = postModel.getPostById(id);

        res.json({success: true, data: post});
    }
}

module.exports = new PostsController();