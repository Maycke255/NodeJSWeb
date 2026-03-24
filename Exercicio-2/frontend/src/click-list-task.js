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

async function deleteItemList () {
    const checkedItems = document.querySelectorAll('input[type="checkbox"]:checked')
    const listId = window.location.pathname.split('/')[2];

    if (checkedItems.length === 0) {
        showMessage('Selecione pelo menos um item para deletar!', 'error');
        return;
    }

    if (!confirm("Tem certeza que deseja deletar este(s) item(ns) da lista?")) return;

    for (const checkbox of checkedItems) {
        const itemCard = checkbox.closest('.item-card');
        const itemId = itemCard.getAttribute('data-item-id');
        console.log(`🔍 Item ID pegado do HTML: "${itemId}" (tipo: ${typeof itemId})`);
        console.log('Item Card:', itemCard);
        console.log('data-item-id:', itemCard.getAttribute('data-item-id'));
        console.log('ListId:', window.location.pathname.split('/')[2]);

        try {
            const res = await fetch (`/api/admin/delete-item-list/${listId}/items/${itemId}`,{
                method: 'DELETE'
            });
            const result = await res.json();

            if (result.success) {
                showMessage(result.message, 'success');
                loadedItemsListTask();
            }
        } catch (error) {
            showMessage("Erro ao deletar item da lista!.", "error");
            console.error(error);
        }
    }
}

async function createNewItem () {
    try {
        const newItem = document.getElementById('inputNewItem').value;
        const id = window.location.pathname.split('/')[2];

        if (!newItem || newItem.trim() === '') {
            showMessage('Digite um nome para o novo item!', 'error');
            return;
        }

        const res = await fetch('/api/admin/create-new-item', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }, // ← Avisa: "vou te mandar JSON"
            body: JSON.stringify({ nameItem: newItem, listId: id }) // ← Converte o objeto em string JSON
        });

        const result = await res.json();

        if (result.success) {
            showMessage(result.message, 'success');
            loadedItemsListTask();
            document.getElementById('inputNewItem').value = '';
            return;
        }
    }catch (error) {
        showMessage('Erro ao adicionar item a lista', 'error');
    }
}

async function markItemAsCompleted () {
    const checkedItems = document.querySelectorAll('input[type="checkbox"]:checked')
    const listId = window.location.pathname.split('/')[2];
    const newStatus = checkedItems.checked ? 'completed' : 'notCompleted';

    if (checkedItems.length === 0) {
        showMessage('Selecione pelo menos um item para concluir!', 'error');
        return;
    }

    for (const checkbox of checkedItems) {
        const itemCard = checkbox.closest('.item-card');
        const itemId = itemCard.getAttribute('data-item-id');

        try {
            const res = await fetch(`/api/admin/update-item-status/${listId}/items/${itemId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' }, // ← Avisa: "vou te mandar JSON"
                body: JSON.stringify({ status: 'completed' }) // ← Converte o objeto em string JSON
            });
            const result = await res.json();

            if (result.success) {
                showMessage(result.message, 'success');
                loadedListTask();
                return;
            }
        } catch (error) {
            showMessage('Erro ao atualizar item', 'error');
        }
    }
}

async function loadedItemsListTask () {
    try {
        // Se a URL é /lists/abc-123, isso retorna 'abc-123'
        const id = window.location.pathname.split('/')[2];

        const res = await fetch(`/api/list-task/${id}`);
        const result = await res.json();

        if (result.success) {
            document.getElementById('page-title-head').textContent = `Task Flow | ${result.name}`;
            document.getElementById('list-title').innerHTML = result.name;
            console.log('Items:', result.data);

            const itemsContainer = document.getElementById('items-container');
            const dataItems = result.data;

            if (!id) {
                showMessage('ID não encontrado!','error');
                return;
            }

            if (dataItems.length === 0) {
                itemsContainer.innerHTML = '';
                const newDiv = document.createElement('div');
                newDiv.className = 'message-alert success';
                newDiv.id = 'messageTemporary';
                newDiv.textContent = result.message;
                itemsContainer.appendChild(newDiv);
                return;
            }

            itemsContainer.innerHTML = dataItems.map((item) => `
                <div class='item-card ${item.status}' id='itemCard' data-item-id="${item.id}">
                    <input type="checkbox" id="itemCheckbox" class="item-checkbox" value="${item.id}"
                    ${item.status === 'completed' ? 'checked' : ''}>
                    <label for="itemCheckbox" class="item-title ${item.status}">${item.title}</label>
                </div>
            `).join('');
            
        } else {
            showMessage(result.message, 'error');
        }
    } catch (error) {
        showMessage('Erro ao carregar items da lista.', 'error');
        console.error(error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadedItemsListTask();

    document.getElementById('delItemBtn').addEventListener('click', async (ev) => {
        ev.preventDefault();

        deleteItemList();
    });

    document.getElementById('addItemBtn').addEventListener('click', async (ev) => {
        ev.preventDefault();

        createNewItem();
    });

    document.getElementById('concludeItemBtn').addEventListener('click', async (ev) => {
        ev.preventDefault();

        markItemAsCompleted();
    });
});