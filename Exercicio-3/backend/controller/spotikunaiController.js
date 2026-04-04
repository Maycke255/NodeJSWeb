const SpotikunaiModel = require('../model/spotikunaiModel.js');

class SpotikunaiController {
    getAllPlaylists (req, res) {
        try {       
            const result = SpotikunaiModel.allPlaylists();
    
            if (result) {
                return res.status(200).json(result);
            } else {
                return res.status(404).json(result);
            }
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    getPlaylistById (req, res) {
        try {
            const { id } = req.params;

            const result = SpotikunaiModel.getPlaylist(id);

            if (result) {
                return res.status(200).json(result);
            } else {
                return res.status(404).json(result);
            }
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
}

module.exports = new SpotikunaiController();