// Função para exibir mensagem DOCUMENTO QUE NÃO ESTA FUNCIONADO
console.log('Elemento message encontrado?', document.getElementById('message'));

function mostrarMensagem(texto, tipo = 'sucesso') {
        console.log('Função mostrarMensagem chamada com:', texto, tipo);
    const messageDiv = document.getElementById('message');
        console.log('messageDiv:', messageDiv);
    
    if (!messageDiv) {
        console.error('❌ ERRO: Elemento com ID "message" não encontrado!');
        return;
    }

    // Define a classe baseada no tipo
    messageDiv.className = `message ${tipo}`;
    messageDiv.textContent = texto;

    console.log('✅ Mensagem exibida:', texto);
    

}

async function loadedPosts () {
    try {
        const res = await fetch('/api/posts');
        const result = await res.json();

        if (result.success) {
            const posts = result.data;
            const ulPosts = document.querySelector('.posts');

            if (posts.length === 0) {
                mostrarMensagem(result.message, 'erro');
                return;
            }

            ulPosts.innerHTML = posts.map(post => `
                <article class="post" id="post-${post.id}">
                    <h3>${post.title}</h3>
                    <p>${post.content}</p>
                    <small>Criado em: ${new Date(post.createdAt).toLocaleDateString()}</small>
                    <button onclick="deletarPost('${post.id}')">Deletar</button>
                </article>
            `).join('');

            mostrarMensagem('Posts carregados com sucesso!', 'sucesso');
        } else {
            console.log('success é false');
            mostrarMensagem(result.message, 'erro');
        }

    } catch (erro) {
        mostrarMensagem('Erro ao carregar posts', 'erro');
        console.error(erro);
    }
}


document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM foi carregado');
    loadedPosts()
});

