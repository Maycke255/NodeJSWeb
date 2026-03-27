document.getElementById('buttonPost').addEventListener('click', async (ev) => {
    ev.preventDefault();

    try {
        const titleMovie = 'Invocação do Mal 4';
        const genreMovie = ['Terror', 'Suspense'];
        const yearMovie = 2025;

        const res = await fetch('/api/new-movie', {  // ✅ Sem parênteses extras
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: titleMovie, year: yearMovie, genre: genreMovie })
        });

        const result = await res.json();
        console.log('Resultado:', result);  // ✅ Log completo

        if (result.success) {
            console.log(result.message);
        } else {
            console.error(result.message);
        }
    } catch (error) {
        console.error('Erro fetch:', error);
    }
});