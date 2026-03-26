const moviesModel = require('../model/model.js');

class MovieAdminController {
    // -- POST -- CRIAR NOVO FILME
    createMovie (req, res) {
        try {
            const { title, year, gerne } = req.body
    
            if (!title || !year || !gerne) {
                return res.status(404).json({
                    success: false,
                    message: 'Erro ao criar novo filme, elementos do DOM faltantes!'
                });
            }

            newMovie = moviesModel.newMovie(title, year, gerne);
            
            return res.status(201).json({
                success: true,
                message: 'Novo filme adicionado a lista com sucesso.'
            })
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Erro ao criar novo filme',
                error: error.message
            })
        }

    }
}

module.exports = new MovieAdminController();