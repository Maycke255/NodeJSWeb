// Função para exibir mensagem
function mostrarMensagem(texto, tipo = 'sucesso') {
    const messageDiv = document.getElementById('message');
    
    // Define a classe baseada no tipo
    messageDiv.className = `message ${tipo}`;
    messageDiv.textContent = texto;
    
    // Remove a mensagem depois de 5 segundos (opcional)
    setTimeout(() => {
        messageDiv.className = 'message';
    }, 5000);
}

async function loadedPosts () {
    try {
        const res = await fetch('/api/posts');
        const result = await res.json();

        if (result.success) {
            const posts = result.data;
            const ulPosts = document.querySelector('.posts');
            const messageDiv = document.querySelector('.message')

            if (posts.length === 0) {
                mostrarMensagem(result.message, 'sucesso');
                ulPosts.innerHTML = '<p>Nenhum post disponível.</p>';
                return;
            }

            // Renderiza os posts dinamicamente
            return ulPosts.innerHTML = `
                <section class="posts">
                    <h2>Todos os Posts</h2>
                    ${posts.map(post => `
                        <article class="post" id="post-${post.id}">
                            <h3>${post.title}</h3>
                            <p>${post.content}</p>
                            <small>Criado em: ${new Date(post.createdAt).toLocaleDateString()}</small>
                            <button onclick="deletarPost('${post.id}')">Deletar</button>
                        </article>
                    `).join('')}
                </section>
            `;
        }
    } catch (erro) {
        mostrarMensagem('Erro ao carregar posts', 'erro');
        console.error(erro);
    }
}


//CERTO ERRADO

document.addEventListener('DOMContentLoaded', loadedPosts);

// DEBUGAR: Verificar se o elemento existe
console.log('Elemento message encontrado?', document.getElementById('message'));

// DEBUGAR: Verificar se a função existe
function mostrarMensagem(texto, tipo = 'sucesso') {
    console.log('Função mostrarMensagem chamada com:', texto, tipo);
    
    const messageDiv = document.getElementById('message');
    console.log('messageDiv:', messageDiv);
    
    if (!messageDiv) {
        console.error('❌ ERRO: Elemento com ID "message" não encontrado!');
        return;
    }
    
    messageDiv.className = `message ${tipo}`;
    messageDiv.textContent = texto;
    
    console.log('✅ Mensagem exibida:', texto);
    
    setTimeout(() => {
        messageDiv.className = 'message';
    }, 5000);
}

async function loadedPosts() {
    try {
        console.log('Iniciando loadedPosts...');
        
        const res = await fetch('/api/posts');
        console.log('Response recebida:', res);
        
        const result = await res.json();
        console.log('Resultado JSON:', result);

        if (result.success) {
            const posts = result.data;
            const ulPosts = document.querySelector('.posts');

            console.log('Posts:', posts);
            console.log('Número de posts:', posts.length);

            if (posts.length === 0) {
                console.log('Array vazio! Mostrando mensagem...');
                mostrarMensagem(result.message, 'sucesso');
                ulPosts.innerHTML = '<p>Nenhum post disponível.</p>';
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
        console.error('❌ Erro no catch:', erro);
        mostrarMensagem('Erro ao carregar posts', 'erro');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM foi carregado');
    loadedPosts();
});