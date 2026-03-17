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
}

module.exports = new FlowTaskControllerAdmin();