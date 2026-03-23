const taskListModel = require('../model/taskListModel');

class FlowTaskControllerAdmin {
    delTaskList (req, res) {
        try {
            const ID = req.params.id;
            taskListModel.deleteTaskList(ID);

            return res.status(200).json({
                success: true,
                message: 'Lista deletada com sucesso!'
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Erro ao deletar lista.',
                error: error.message
            });
        }
    }

    createTaskList (req, res) {
        try {
            const nameTask = req.body.nametask;
            taskListModel.newListTask(nameTask);
     
            return res.status(200).json({
                 success: true,
                 name: nameTask,
                 message: 'Nova lista criada com sucesso!'
             });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            })
        }
    }

    createNewItem (req, res) {
        try {
            const { listId, nameItem } = req.body;

            if (!listId || !nameItem) {
                return res.status(500).json({
                    success: false,
                    message: 'Nome da nova tarefa não encontrado, assim não sendo possivel criar!'
                })
            }

            taskListModel.newItemTask(listId, nameItem);

            return res.status(200).json({
                success: true,
                message: 'Novo item adicionado com sucesso a lista!'
            })
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            })
        }
    }

    delItemTaskList (req, res) {
        try {
            const { listId, itemId } = req.params;

            const result = taskListModel.deleteItemTask(listId, itemId);

            if (!result.success) {
                return res.status(404).json(result);
            }

            return res.status(200).json({
                success: true,
                message: 'Item deletado com sucesso da lista'
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            })
        }
    }

    updateStatus (req, res) {
        try {
            const { listId, itemId } = req.params;
            const { status } = req.body;

            if (!status) {
                return res.status(400).json({
                    success: false,
                    message: 'Status é obrigatório!'
                });
            }

            const result = taskListModel.updateStatusItem(listId, itemId, status);

            if (!result.success) {
                return res.status(404).json(result);
            }

            return res.status(200).json({
                success: true,
                message: result.message
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = new FlowTaskControllerAdmin();