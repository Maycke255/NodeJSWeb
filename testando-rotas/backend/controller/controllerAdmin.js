const moviesModel = require('../model/model.js');

class MovieAdminController {
    // -- POST -- CRIAR NOVO FILME
    createMovie(req, res) {
        try {
            console.log('🔍 req.body recebido:', req.body);  // Debug (remova depois)

            if (!req.body || Object.keys(req.body).length === 0) {
                return res.status(400).json({ success: false, message: 'Body vazio!' });
            }

            const { title, year, genre = [] } = req.body;

            if (!title?.trim() || !year || !Array.isArray(genre)) {  // ✅ Removi length=0 (array vazio OK?)
                return res.status(400).json({ success: false, message: 'Título, ano e gênero obrigatórios!' });
            }

            const result = moviesModel.newMovie(title.trim(), parseInt(year), genre);  // ✅ genre array

            if (result) {
                return res.status(201).json(result)
            } else {
                return res.status(404).json(result);
            }

        } catch (error) {
            console.error('Erro createMovie:', error);
            return res.status(500).json({ success: false, message: 'Erro interno' });
        }
    }

    updateMoviePUT (req, res) {
        try {   
            const { id } = req.params;
            const updatedMovie = req.body;
    
            if (!updatedMovie) {
                return res.status(400).json({ success: false, message: 'Conteúdo a ser atuaizado obrigatorio!' });
            }
    
           const result = moviesModel.updateMovieCompleted(id, updatedMovie);
            if (result.success) {
                return res.status(200).json(result); // 200 para update, retorna data
            } else {
                return res.status(404).json(result);
            }

        } catch (error) {
           console.error('Erro updateMoviePUT:', error);
           return res.status(500).json({ success: false, message: 'Erro interno' }); 
        }
    }

    updateMoviePATCH (req, res) {
        try {
            const { id } = req.params;
            const updateMovie = req.body;
    
            if (!updateMovie) {
                return res.status(400).json({ success: false, message: 'Conteúdo a ser atuaizado obrigatorio!' });
            }
    
            const result = moviesModel.updateMoviePartial(id, updateMovie);
            if (result.success) {
                return res.status(200).json(result);
            } else {
                return res.status(404).json(result);
            }
        } catch (error) {
            console.error('Erro updateMoviePUT:', error);
            return res.status(500).json({ success: false, message: 'Erro interno' }); 
        }
    }

    deleteMovie (req, res) {
        try {
            const { id } = req.params;
            
            const result = moviesModel.deleteMovieByID(id);
            if (result.success) {
                return res.status(200).json(result);
            } else {
                return res.status(404).json(result);
            }
        } catch (error) {
            console.error('Erro deleteMovieByID:', error);
            return res.status(500).json({ success: false, message: 'Erro interno' }); 
        }
    }
}

module.exports = new MovieAdminController();