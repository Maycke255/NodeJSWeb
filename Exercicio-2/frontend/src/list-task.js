function showMessage (text, type = 'success') {
    console.log('Função mostrarMensagem chamada com:', text, type);

    const message = document.getElementById('message');
        console.log('message:', message);
    
    if (!message) {
        console.error('❌ ERRO: Elemento com ID "message" não encontrado!');
        return;
    }

    // Define a classe baseada no type
    message.className = `message ${type}`;
    message.textContent = text;

    console.log('✅ Mensagem exibida:', text);
}

async function loadedListTask () {
    try {
        //Busca os dados na API
        const res = await fetch('/api/list-task');
        //transforma em JSON
        const result = await res.json();

        if (result.success) {
            const dataTasks = result.data;
            const listTasks = document.getElementById('lists-container');

            if (dataTasks.length === 0) {
                showMessage(result.message, 'success');
                return;
            }
        }
    } catch (error) {
        showMessage('Erro ao carregar lista.', 'error');
        console.error(error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadedListTask();
})