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

async function deleteList(id) {
    if (!confirm("Tem certeza que deseja deletar esta lista?")) return;

    try {
        const res = await fetch(`/api/delete-list-task/:${id}`, {
            method: "DELETE",
        });

        const result = await res.json();

        if (result.success) {
            showMessage(result.message, "success");
            loadedListTask(); // ← Recarrega a lista
        } else {
            showMessage(result.message, "error");
        }
    } catch (error) {
        showMessage("Erro ao deletar lista.", "error");
        console.error(error);
    }
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

            listTasks.innerHTML = dataTasks.map((list) => `
            <div class="task-list-item" data-id="${list.id}">
                <p class="task-list-title ">${list.name}</p>
                <button class="btn-danger-custom" data-id="${list.id}">Deletar</button>
            </div>`).join('');

            //REDIRECIONAMENTO AO CLICAR NA LISTA DE TAREFA
            document.querySelectorAll('.task-list-item').forEach((list) => {
                list.addEventListener('click', (e) => {
                    // Evita redirecionar ao clicar no botão Deletar

                    const id = list.dataset.id

                    window.location.href = `/lists/${id}`;
                });
            });

            //BOTÃO DELETAR
            document.querySelectorAll('.btn-danger-custom').forEach((item) => {
                item.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation(); // ← ADICIONE ISSO!
                    const id = item.dataset.id;
                    deleteList(id);
                })
            })
        } else {
            showMessage(result.message, 'error');
        }
    } catch (error) {
        showMessage('Erro ao carregar lista.', 'error');
        console.error(error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadedListTask();
});