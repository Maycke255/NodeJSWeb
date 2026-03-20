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
                },
                {
                    id: '2',
                    title: 'Pedalar',
                },
                {
                    id: '3',
                    title: 'Ir na feira'
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
}

module.exports = new FlowTaskModel();