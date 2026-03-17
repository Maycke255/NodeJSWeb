//Controle, usada para definir apenas os callbacks das rotas do arquivo routes, e o intermediador
//assim que o usuario acessa uma url, o navegador executa a rota que chama o callback presente nessa pagina

const taskListModel = require('../model/taskListModel');

class FlowTaskController {
    // GET para pagina de exibir todas as tarefas
    allList (req, res) {
        const taskList = taskListModel.allTasksList();

        try {
            if (taskList.length === 0) {
                return res.status(200).json({
                    success: true,
                    data: [],
                    message: 'Nenhuma lista de tarefas criada ainda, experimente criar uma.'
                });
            }

            return res.status(200).json({
                success: true,
                data: taskList
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                data: [],
                message: 'Erro ao carregar lista de tarefas',
                erro: error.message
            });
        }
    }

    acessAList (req, res) {
        const ID = req.params.id
        const getListTask = taskListModel.getTaskListById(ID);

        try {
            if (getListTask.items.length === 0) {
                return res.status(200).json({
                    success: true,
                    data: [],
                    message: 'Nenhuma tarefa adicionada a essa lista ainda.'
                });
            }

            return res.status(200).json({
                success: true,
                data: getListTask.items
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                data: [],
                message: error.message
            });
        }
    }
}

module.exports = new FlowTaskController();