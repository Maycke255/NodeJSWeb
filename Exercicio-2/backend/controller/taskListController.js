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

        // // ✅ PRINTS DETALHADOS
        // console.log('════════════════════════════════════');
        // console.log('🔍 ID RECEBIDO NA ROTA:', ID);
        // console.log('📋 TIPO DO ID:', typeof ID);
        // console.log('════════════════════════════════════');
        
        // const allLists = taskListModel.allTasksList();
        // console.log('📚 TODAS AS LISTAS:');
        // allLists.forEach((list, index) => {
        //     console.log(`  [${index}] ID: "${list.id}" | Nome: "${list.nameTask}"`);
        //     console.log(`       Tipo: ${typeof list.id}`);
        // });
        // console.log('════════════════════════════════════');
        
        // console.log('✅ LISTA ENCONTRADA:', getListTask);
        // console.log('════════════════════════════════════');

        try {
            // ✅ Verifica se a lista existe ANTES de acessar .items
            if (!getListTask) {
                return res.status(404).json({
                    success: false,
                    data: [],
                    message: 'Lista não encontrada'
                });
            }

            if (getListTask.items.length === 0) {
                return res.status(200).json({
                    success: true,
                    name: getListTask.nameTask,
                    data: [],
                    message: 'Nenhuma tarefa adicionada a essa lista ainda.'
                });
            }

            return res.status(200).json({
                success: true,
                name: getListTask.nameTask,
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