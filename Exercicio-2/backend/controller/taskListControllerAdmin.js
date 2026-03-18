const taskListModel = require('../model/taskListModel');

class FlowTaskControllerAdmin {
    delTaskList (req, res) {
        try {
            const ID = req.params.id;
            taskListModel.deleteTaskList(ID);

            res.status(200).json({
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
     
             res.status(200).json({
                 success: true,
                 name: nameTask,
                 message: 'Nova lista criada com sucesso!'
             });
        } catch (error) {
            res.status(500).json({
                succes: false,
                message: 'Erro ao criar lista'
            })
        }
    }
}

module.exports = new FlowTaskControllerAdmin();