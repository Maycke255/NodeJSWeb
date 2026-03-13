//Model, aqui e onde acontece a magica, e onde o backend trabalha
//São responsaveis por executar as tarefas internas que o controller pede atravez das rotas

class FlowTaskModel {
    //Array para armazenar a lista de tarefas
    constructor () {
        this.tasks = []
    }

    // --- GET --- TODOS AS LISTAS DE TAREFAS
    allTasksList () {
        return this.tasks;
    }
}

module.exports = new FlowTaskModel();