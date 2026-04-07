/* ​Crie uma aplicação Node.js usando Express para gerenciamento de playlists de música. A aplicação deverá ter atender os seguintes requisitos:

Uma playlist deve ter, pelo menos, nome e uma lista de tags para classificá-la.
Uma playlist deve ter uma lista de músicas, onde cada música deve ter, no mínimo, título, ano, artista e álbum.

Deve ser possível obter uma lista de todas as playlists existentes, bem como uma playlist individualmente.
Deve ser possível cadastrar novas playlists, com ou sem músicas nela.
Deve ser possível atualizar o nome e a lista de tags de uma playlist.
Deve ser possível excluir uma playlist.
Deve ser possível adicionar e remover músicas em uma playlist. */

const crypto = require('crypto');

class SpotikunaiModel {
    constructor () {
        this.playlists = [
            //Exemplo de como poderia ser uma playlist:
            {
                playlistID: '1',
                name: 'Sertanejo',
                tags: ['Sertanejo romantico', 'Clássico', 'Raiz', 'Modão', 'Sofrencia', 'Dançar Coladinho', 'Apaixonante'],
                //Lista onde ira conter todas as musicas
                playlist: [
                    {
                        songID: '1',
                        title: 'Dou a vida por um beijo',
                        year: 2000,
                        artist: 'Zezé Di Camargo & Luciano',
                        album: 'Flores em vida'
                    },
                    {
                        songID: '2',
                        title: 'Evidências',
                        year: 1990,
                        artist: 'Chitãozinho e Xororó',
                        album: 'Cowboy do asfalto' 
                    }
                ]
            },
            {
                playlistID: '2',
                name: 'Anime RAP',
                tags: ['Rap de anime', 'Geek', 'Trap de anime', 'Rap Nerd', 'Batalha', 'Protagonistas', 'Vilões', 'Motivacional', 'Frestayle Anime'],
                //Lista onde ira conter todas as musicas
                playlist: [
                    {
                        songID: '1',
                        title: 'Rap do Naruto',
                        year: 2020,
                        artist: '7 Minutoz',
                        album: 'Rap de Anime'
                    },
                    {
                        songID: '2',
                        title: 'Rap do Levi',
                        year: 2021,
                        artist: 'Player Tauz',
                        album: 'Attack on Titan Rap'
                    }
                ]
            }
        ];
    }

    //-- GET -- OBTER TODA A LISTA DE PLAYLIST
    allPlaylists () {
        if (this.playlists.length === 0) {
            return { success: true, message: 'Você não tem nenhuma playlist criada no momento.' };
        }

        return { success: true, data: this.playlists };
    }

    // -- GET -- OBTER PLAYLIST ESPECIFICA, ACESSAR UMA PLAYLIST
    getPlaylist (id) {
        if (this.playlists.length === 0) {
            return { success: true, message: 'Você não tem nenhuma playlist criada no momento.' };
        }

        const index = this.playlists.findIndex(playlist => playlist.playlistID === id);

        if (index === -1) {
            return { success: false, data: [], message: 'PLaylist informada indexistente!' }
        }

        return { success: true, data: this.playlists[index] }
    }

    // -- POST -- CADASTRAR NOVA PLASYLIST
    createNewPlaylist (name, songs) {
        const newPlaylist = {
            playlistID: crypto.randomUUID(),
            name: name,
            tags: [],
            playlist: songs !== undefined ? songs : []
        }

        this.playlists.push(newPlaylist);
        return { success: true, data: newPlaylist, message: 'Nova Playlist criada com sucesso!' }
    }

    // -- POST -- ADICIONAR UMA NOVA MUSICA A PLAYLIST
    addMusic (id, title, year, artist, album) {
        const index = this.playlists.findIndex(playlist => playlist.playlistID === id);

        if (index === -1) {
            return { success: false, data: [], message: 'PLaylist informada indexistente!' }
        }

        const newMusic = {
            songID: crypto.randomUUID(),
            title: title,
            year: year,
            artist: artist,
            album: album
        }

        this.playlists[index].playlist.push(newMusic);
        return { success: true, data: this.playlists[index].playlist, message: `Música ${title} adicionada com sucesso a playlist ${this.playlists[index].name} ` }
    }

    //-- POST -- ADICIONAR TAGS A LISTA 
    createNewTags (id, tags) {
        const index = this.playlists.findIndex(playlist => playlist.playlistID === id);

        if (index === -1) {
            return { success: false, data: [], message: 'PLaylist informada indexistente!' }
        }

        if (!Array.isArray(tags)) return { success: false, message: 'Tags deve ser array' };

        tags.forEach(tag => {
            if (!this.playlists[index].tags.includes(tag)){
                this.playlists[index].tags.push(tag);
            } 
        });

        return { success: true, data: this.playlists[index].tags, message: `Tags adicionadas com sucesso a playlist ${this.playlists[index].name}!` }
    }

    // -- PUT -- ATUALIZAR NOME E TAGS DA PLAYLIST
    updatePlaylist(id, updates) {
        const index = this.playlists.findIndex(playlist => playlist.playlistID === id);

        if (index === -1) {
            return { success: false, data: null, message: 'Playlist inexistente!' };
        }

        const oldName = this.playlists[index].name;  // Salva para message

        // Atualiza name se enviado
        if (updates.name !== undefined) {
            this.playlists[index].name = updates.name;
        }

        // Atualiza tags: substitui lista (remove duplicatas)
        if (Array.isArray(updates.tags)) {
            const newTags = updates.tags.filter(tag => !this.playlists[index].tags.includes(tag));  
            this.playlists[index].tags = [...this.playlists[index].tags, ...newTags];
        }

        return { success: true, data: this.playlists[index], message: `Playlist ${oldName} atualizada com sucesso!` };
    }

    // -- DELETE -- EXCLUIR PLAYLIST
    deletePlaylist (id) {
        const index = this.playlists.findIndex(playlist => playlist.playlistID === id);

        if (index === -1) {
            return { success: false, data: [], message: 'PLaylist informada indexistente!' }
        }
        const name = this.playlists[index].name;
        this.playlists.splice(index, 1);
        return { success: true, data: this.playlists, message: `Playlist ${name} excluida com sucesso!` };
    }

    // -- DELETE -- EXCLUIR MÚSICA DA PLAYLIST
    deleteMusic (playListId, musicId) {
        const index = this.playlists.findIndex(playlist => playlist.playlistID === playListId);

        if (index === -1) {
            return { success: false, data: [], message: 'PLaylist informada indexistente!' }
        }

        const informedPlaylist = this.playlists[index];

        const indexMusic = informedPlaylist.playlist.findIndex(music => music.songID === musicId);

        if (indexMusic === -1) {
            return { success: false, data: [], message: 'Musica informada indexistente!' }
        }

        const musicTitle = informedPlaylist.playlist[indexMusic].title;
        informedPlaylist.playlist.splice(indexMusic, 1);
        return { success: true, data: informedPlaylist.playlist, message: `Música ${musicTitle} excluida com sucesso da playlist ${informedPlaylist.name}!` }
    } 
}

module.exports = new SpotikunaiModel();