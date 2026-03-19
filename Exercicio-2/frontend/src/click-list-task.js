function showMessage (text, type = 'success') {

    const message = document.getElementById('message');
        console.log('message:', message);
    
    if (!message) {
        console.error('❌ ERRO: Elemento com ID "message" não encontrado!');
        return;
    }

      // ✅ Limpa qualquer timeout anterior
    if (message.timeoutId) {
        clearTimeout(message.timeoutId);
    }

    // Define a classe baseada no type
    message.className = `message-alert ${type}`;
    message.textContent = text;
    message.style.display = 'block';


    setTimeout(() => {
        message.className = 'message-alert';   
        message.style.display = 'none';           
        message.textContent = '';               
    }, 4000); 
}

async function loadedItemsListTask () {
    try {
        // Se a URL é /lists/abc-123, isso retorna 'abc-123'
        const id = window.location.pathname.split('/')[2];

        if (!id) {
            showMessage('ID não encontrado!','error');
            return;
        }

        const res = await fetch(`/api/list-task/${id}`);
        const result = await res.json();

        if (result.success) {
            document.getElementById('page-title-head').textContent = `Task Flow | ${result.name}`;
            document.getElementById('list-title').innerHTML = result.name;
            console.log('Items:', result.data);

            const itemsContainer = document.getElementById('items-container');
            const dataItems = result.data;

            if (dataItems.length === 0) {
                itemsContainer.innerHTML = '';
                itemsContainer.innerHTML = result.message;
                return;
            }
        } else {
            showMessage(result.message, 'error');
        }
    } catch (error) {
        showMessage('Erro ao carregar items da lista.', 'error');
        console.error(error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadedItemsListTask()
});