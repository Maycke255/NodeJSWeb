const moviesModel = require('../model/model.js');

class MovieController {

    // -- GET -- OBTER TODA A LISTA
    getAllMovies (req, res) {
        const movies = moviesModel.allMovies();

        try {
            return res.status(200).json({
                success: true,
                data: movies.data,
                message: movies.message
            });
        } catch (error) {
            return res.status(404).json({
                success: false,
                message: `Erro ao retornar filmes`,
                error: error.message
            });
        }
    }
}

module.exports = new MovieController();