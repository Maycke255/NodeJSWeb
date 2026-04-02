const SpotikunaiModel = require('../model/spotikunaiModel.js');

class SpotikunaiController {
    getAllPlaylists (req, res) {
        try {       
            const result = SpotikunaiModel.allPlaylists();
    
            if (result) {
                res.status(200).json(result);
            } else {
                res.status(404).json(result);
            }
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
}

module.exports = new SpotikunaiController();