const spotikunaiModel = require('../model/spotikunaiModel.js');
const SpotikunaiModel = require('../model/spotikunaiModel.js');

class SpotikunaiControllerAdmin {
    createPlaylist (req, res) {
        try {
            const { name, songs } = req.params;

            if (!name) {
                return res.status(406).json({
                    success: false,
                    message: 'Resposta do campo name inadequada!'
                })
            }

            const result = SpotikunaiModel.createNewPlaylist(name, songs);

            if (result) {
                return res.status(201).json(result);
            } else {
                return res.status(406).json(result);
            }
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: error.message
            })
        }
    }

    addMusicPlaylist (req, res) {
        try {
            const { title, year, artist, album } = req.body;
            const { id } = req.params;

            if (!title || !year || !artist || !album) {
                return res.status(406).json({
                    success: false,
                    message: 'Campos de cadastros faltantes ou informado indevidamente.'
                });
            }

            const result = spotikunaiModel.addMusic(id, title, year, artist, album);

            if (result) {
                return res.status(201).json(result);
            } else {
                return res.status(406).json(result);
            }
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: error.message
            })
        }
    }

    addNewTagsForPlaylist (req, res) {
        try {
            const { tags } = req.body;
            const { id } = req.params;
    
            if (!tags) {
                return res.status(406).json({
                    success: false,
                    message: 'Tags faltantes ou informadas indevidamente.'
                });
            }
    
            const result = spotikunaiModel.createNewTags(id, tags);
    
            if (result) {
                return res.status(201).json(result);
            } else {
                return res.status(406).json(result);
            }
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    updateNameAndTagsPlaylist (req, res) {
        try {
            const { updates } = req.body;
            const { id } = req.params;

            if (!updates) {
                return res.status(406).json({
                    success: false,
                    message: 'Atualizações faltantes ou inadequadas'
                });
            }

            const result = spotikunaiModel.updatePlaylist(id, updates);
            
            if (result) {
                return res.status(200).json(result);
            } else {
                return res.status(406).json(result);
            }
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
}

module.exports = new SpotikunaiControllerAdmin();