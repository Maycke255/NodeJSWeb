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

    // -- POST -- CADASTRAR NOVA PLASYLIST
    createNewPlaylist (name) {
        const newPlaylist = {
            playlistID: crypto.randomUUID(),
            name: name,
            tags: [],
            playlist: []
        }

        this.playlists.push(newPlaylist);
        return { success: true, data: newPlaylist, message: 'Nova Playlist criada com sucesso!' }
    }

    // -- PUT -- ATUALIZAR NOME E TAGS DA LISTA
    updatePlaylist (id, updates) {
        const index = this.playlists.findIndex(playlist => playlist.playlistID === id);

        if (index === -1) {
            return { success: false, data: [], message: 'Playlist informada indexistente.' };
        }

        this.playlists[index] = { ...this.playlists[index], ...updates };
        return { success: true, data: this.playlists[index], message: `Dados da playlist ${this.playlists[index].name} atualizados com sucesso!` };
    }

    // -- DELETE -- EXCLUIR PLAYLIST
    deletePlaylist (id) {
        const index = this.playlists.findIndex(playlist => playlist.playlistID === id);

        if (index === -1) {
            return { success: false, data: [], message: 'Playlist informada indexistente.' };
        }

        this.playlists.splice(index, 1);
        return { success: true, data: this.playlists, message: `Playlist ${this.playlists[index].name} excluida com sucesso!` };
    }
}