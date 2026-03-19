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

async function deleteList(id) {
    if (!confirm("Tem certeza que deseja deletar esta lista?")) return;

    try {
        const res = await fetch(`/api/admin/delete-list-task/${id}`, {
            method: "DELETE"
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

async function createNewTaskList () {
    try {
        const nametask = document.getElementById('inputNewList').value;

        if (!nametask || nametask.trim() === '') {
            showMessage('Digite um nome para a lista!', 'error');
            return;
        }

        const res = await fetch('/api/admin/create-list-task', {
            method: 'POST',   
            headers: { 'Content-Type': 'application/json' }, // ← Avisa: "vou te mandar JSON"
            body: JSON.stringify({ nametask: nametask }) // ← Converte o objeto em string JSON
        });

        const result = await res.json();

        if (result.success) {
            const form = document.querySelector('.task-list-create');
            if (form) form.remove();

            showMessage(result.message, "success");
            loadedListTask(); // ← Recarrega a lista
        } else {
            showMessage(result.message, "error");
        }
    } catch (error) {
        showMessage("Erro ao criar nova lista.", "error");
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
                listTasks.innerHTML = '';
                showMessage(result.message, 'success');
                return;
            }

            listTasks.innerHTML = dataTasks.map((list) => `
            <div class="task-list-item" data-id="${list.id}">
                <p class="task-list-title">${list.nameTask}</p>
                <button class="btn-danger-custom" data-id="${list.id}">Deletar</button>
            </div>`).join('');

            //REDIRECIONAMENTO AO CLICAR NA LISTA DE TAREFA ->
            document.querySelectorAll('.task-list-item').forEach((list) => {
                list.addEventListener('click', () => {
                    const id = list.dataset.id

                    window.location.href = `/lists/${id}`;
                });
            });

            //BOTÃO DELETAR ->
            document.querySelectorAll('.btn-danger-custom').forEach((item) => {
                item.addEventListener('click', (e) => {
                    // Evita redirecionar ao clicar no botão Deletar
                    e.preventDefault();
                    e.stopPropagation(); // ← ADICIONE ISSO!
                    const id = item.dataset.id;
                    deleteList(id);
                });
            });
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

    //  Listener do botão "Nova Lista" fora do loadedListTask
    document.getElementById('newTaskList').addEventListener('click', (e) => {
        e.preventDefault();

        //  Guard: evita duplicar o formulário
        if (document.querySelector('.task-list-create')) return;

        const listTasks = document.getElementById('lists-container');

        listTasks.innerHTML += `
        <div class="task-list-create mt-3 animate-slide-down">

            <label class="task-list-title mb-3">✏️ Digite o nome da lista de tarefas:</label>

            <input type="text" class="form-control form-control-dark mb-3" 
                id="inputNewList" name="nametask" 
                placeholder="Ex: Tarefas do trabalho..." required>

            <div class="d-flex gap-2 justify-content-end w-100">

                <button class="btn btn-danger-custom" id="abortCreate">✕ Cancelar</button>

                <button class="btn btn-create-custom" id="createTaskList">✓ Criar Lista</button>

            </div>

        </div>`;

        document.getElementById('abortCreate').addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelector('.task-list-create').remove();
        });

        document.getElementById('createTaskList').addEventListener('click', (e) => {
            e.preventDefault();
            createNewTaskList();
        });
    });
});