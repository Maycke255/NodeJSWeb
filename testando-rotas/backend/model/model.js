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

    //-- POST -- CRIAR NOVO FILME
    newMovie(title, year, genre) {  // ✅ genre (não gerne)
        const movie = {
            id: Math.floor(Math.random() * 999999).toString(),
            title,
            year: parseInt(year),
            genre  // ✅ genre
        };

        this.movies.push(movie);
        return { success: true };  // ✅ Retorno consistente (não length do push)
    }

    //-- PUT
}

module.exports = new Movies();