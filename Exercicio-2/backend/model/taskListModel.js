//Model, aqui e onde acontece a magica, e onde o backend trabalha
//São responsaveis por executar as tarefas internas que o controller pede atravez das rotas
const crypto = require('crypto');
const { title } = require('process');

class FlowTaskModel {
    //Array para armazenar a lista de tarefas
    constructor () {
        this.tasks = [
            {
                id: "1",
                nameTask: 'Tarefas de casa',
                items: [],
                createAt: new Date()
            },
            {
                id: "2",
                nameTask: 'Programação para esse fim de semana',
                items: [{
                    id: '1',
                    title: 'Sair com Flávia',
                    status: 'notCompleted'
                },
                {
                    id: '2',
                    title: 'Pedalar',
                    status: 'notCompleted'
                },
                {
                    id: '3',
                    title: 'Ir na feira',
                    status: 'notCompleted'
                }],
                createAt: new Date()
            }
        ]
    }

    // --- GET --- TODOS AS LISTAS DE TAREFAS
    allTasksList () {
        return this.tasks;
    }

    // -- GET -- OBTER LISTA ESPECIFICA (ENTRAR EM UMA LISTA)
    getTaskListById (id) {
        return this.tasks.find((list) => list.id === id);
    }

    // -- DELETE -- DELETAR UMA LISTA ESPECIFICA (BOTÃO DELETE)
    deleteTaskList (id) {
        const taskListId = this.tasks.findIndex((list) => list.id === id);

        if (taskListId !== -1) {
            return this.tasks.splice(taskListId, 1);
        }
    }

    // -- POST -- NOVA LISTA DE TAREFAS
    newListTask (name) {
        const listTask = {
            id: crypto.randomUUID(),
            nameTask: name,
            items: [],
            createAt: new Date()
        }

        return this.tasks.push(listTask);
    }

    //-- POST -- CRIAR NOVO ITEM NA LISTA
    newItemTask (listId, name) {
        const item = {
            id: crypto.randomUUID(),
            title: name,
            createAt: new Date(),
            status: 'notCompleted'
        }
        
        const taskListId = this.tasks.findIndex((list) => list.id === listId);

        if (taskListId === -1) {
           return { success: false, message: 'Lista não encontrada.' };
        }

        //Pegando a lista
        const taskList = this.tasks[taskListId];

        taskList.items.push(item);
        return { success: true, message: 'Item criado!' }; 
    }

    //-- DELETE -- DELETAR ITEM DE UMA LISTA
    deleteItemTask (listId, itemId) {
        console.log(`🔍 Procurando lista "${listId}" e item "${itemId}"`);
        const taskListId = this.tasks.findIndex((list) => list.id === listId);

        if (taskListId === -1) {
           return { success: false, message: 'Lista não encontrada.' };
        }

        //Pegando a lista
        const taskList = this.tasks[taskListId];

        const itemTaskListId = taskList.items.findIndex((item) => item.id === itemId);

        if (itemTaskListId === -1) {
            return { success: false, message: 'Item não encontrado!' };
        }

        taskList.items.splice(itemTaskListId, 1);
        return { success: true, message: 'Item removido com sucesso!' }; 
    }

    //-- PATCH -- ALTERAÇÃO DE STATUS DO ITEM
    updateStatusItem (listId, itemId, newStatus) {
        const taskListId = this.tasks.findIndex((list) => list.id === listId);

        if (taskListId === -1) {
           return { success: false, message: 'Lista não encontrada.' };
        }

        //Pegando a lista
        const taskList = this.tasks[taskListId];

        if (taskList === -1) {
            return { success: false, message: 'Item não encontrado!' };
        }

        if (!['completed', 'notCompleted'].includes(newStatus)) {
            return { success: false, message: 'Status inválido!' };
        }

        taskList.items[itemId].status = newStatus;
        return { success: true, message: `Status alterado para ${newStatus}!` };
    }
}

module.exports = new FlowTaskModel();