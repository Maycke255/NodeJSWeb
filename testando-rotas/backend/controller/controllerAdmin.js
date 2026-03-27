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

        return res.status(201).json({  // ✅ Sempre 201 se chegou aqui
            success: true,
            message: 'Filme criado!'
        });
    } catch (error) {
        console.error('Erro createMovie:', error);
        return res.status(500).json({ success: false, message: 'Erro interno' });
    }
}
}

module.exports = new MovieAdminController();