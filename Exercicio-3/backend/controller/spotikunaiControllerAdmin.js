const spotikunaiModel = require('../model/spotikunaiModel.js');
const SpotikunaiModel = require('../model/spotikunaiModel.js');

class SpotikunaiControllerAdmin {
    createPlaylist (req, res) {
        try {
            const { name, songs } = req.body || {};

            if (!name) {
                return res.status(406).json({
                    success: false,
                    message: 'Resposta do campo name inadequada!'
                });
            }

            const result = SpotikunaiModel.createNewPlaylist(name, songs);

            if (result.success) {
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
            const title  = req.body.title;
            const year = req.body.year;
            const artist = req.body.artist;
            const album = req.body.album;
            
            const { id } = req.params;

            if (!title || !year || !artist || !album) {
                return res.status(406).json({
                    success: false,
                    message: 'Campos de cadastros faltantes ou informado indevidamente.'
                });
            }

            const result = spotikunaiModel.addMusic(id, title, year, artist, album);

            if (result.success) {
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
    
            if (result.success) {
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

            /* LEMBRETE QUANDO FOR FAZER O FETCH NO FRONT END:
            const newNamePlaylist = document.getElementById('name').value;
            const tagsRaw = document.getElementById('tags').value; // Ex: "Rock, Pop, Indie"

            // 1. Transforma a string em array usando a vírgula como separador
            // 2. .map(t => t.trim()) remove espaços em branco extras
            // 3. .filter(t => t !== "") remove itens vazios caso o usuário digite ",,"
            const newTagsPlaylist = tagsRaw.split(',')
                                        .map(tag => tag.trim())
                                        .filter(tag => tag !== "");

            const bodyData = {
                name: newNamePlaylist,
                tags: newTagsPlaylist
            };

            // Requisição
            fetch(`/api/playlists/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bodyData) // Envia o objeto { name, tags }
            }); */

            const updates = req.body; 
            const { id } = req.params;

            if (!updates || Object.keys(updates).length === 0) {
                return res.status(406).json({
                    success: false,
                    message: 'Atualizações faltantes ou inadequadas'
                });
            }

            const result = spotikunaiModel.updatePlaylist(id, updates);
            
            if (result.success) {
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

    delPlaylistById (req, res) {
        try {
            const { id } = req.params;

            const result = spotikunaiModel.deletePlaylist(id);

            if (result.success) {
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

    delMusicById (req, res) {
        try {
            const { id: playlistId, songId: musicId } = req.params;
            
            const result = spotikunaiModel.deleteMusic(playlistId, musicId);
            
            if (result.success) {
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

module.exports = new SpotikunaiControllerAdmin();