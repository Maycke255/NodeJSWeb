class Movies {
    constructor () {
        this.movies = [
            {
                id: '1',
                title: 'Stars Wars: A Ascensão Skywalker',
                year: 2019,
                gerne: [
                    'Aventura',
                    'Ficção cientifica',
                    'Ação'
                ]
            },
            {
                id: '2',
                title: 'Star Wars: Episódio VIII – Os Últimos Jedi',
                year: 2017,
                gerne: [
                    'Aventura',
                    'Ficção cientifica',
                    'Ação'
                ]
            }
        ];
    }

    // -- GET -- OBTER TODA A LISTA DE FILMES
    allMovies () {
        if (this.movies.length === 0) {
            return { success: true, data: [], message: `A lista de filmes esta vazia` }
        }

        return { success: true, data: this.movies }
    }

    // -- GET -- OBTER FILME ESPECIFICO
    findMovieById (id) {
        return this.movies.find(movie => movie.id === id)
    }

    //-- POST -- CRIAR NOVO FILME
    newMovie(title, year, genre) { 
        const movie = {
            id: Math.floor(Math.random() * 999999).toString(),
            title,
            year: parseInt(year),
            genre  
        };

        this.movies.push(movie);
        return { success: true, data: this.movies }; 
    }

    //-- PUT --
    updateMovieCompleted (id, updatedMovie) {
        const index = this.movies.findIndex(movie => movie.id === id);

        if (index !== -1) {
            this.movies[index] = { ...this.movies[index], ...updatedMovie }
            return { success: true , data: this.movies[index], message: 'Filme atualizado com sucesso!' }
        }

        return { data: null, success: false, message: 'Erro ao atualizar filme' }
    }

    // -- PATCH --
    updateMoviePartial (id, partialData) {
        const movie = this.movies.findIndex(movie => movie.id === id);

        if (movie === -1) {
            return { success: false, message: 'Filme não encontrado' };
        }

        this.movies[movie] = { ...this.movies[movie], ...partialData };
        return { success: true, data: this.movies[movie], message: 'Filme atualizado com sucesso!' }
    }

    // -- DELETE --
    deleteMovieByID (id) {
        const index = this.movies.findIndex(movie => movie.id === id);

        if (index === -1) {
            return { success: false, message: 'Filme não encontrado' };
        }

        this.movies.splice(index, 1);
        return { success: true, data: this.movies, message: 'Filme excluido com sucesso!' };
    }
}

module.exports = new Movies();