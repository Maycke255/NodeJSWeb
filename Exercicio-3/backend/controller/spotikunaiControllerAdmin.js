const SpotikunaiModel = require('../model/spotikunaiModel.js');

class SpotikunaiControllerAdmin {
    createPlaylist (req, res) {
        try {
            const { name, songs } = req.params

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
        
    }
}

module.exports = new SpotikunaiControllerAdmin();