const path = require('path');
const express = require('express');
const FlowTaskController = require('../controller/taskListController');
const FlowTaskControllerAdmin = require('../controller/taskListControllerAdmin');

const router = express.Router();

//Ações do usuario normal, apenas obter dados
router.get('/api/list-task', FlowTaskController.allList);
router.get('/api/list-task/:id', FlowTaskController.acessAList);

//Controller admin, ações de alterações
router.delete('/api/admin/delete-list-task/:id', FlowTaskControllerAdmin.delTaskList);
router.post('/api/admin/create-list-task', FlowTaskControllerAdmin.createTaskList);

const FRONTEND_PAGES_GET = path.join(__dirname, '../../frontend/pages/');

router.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/index.html'));
});

router.get('/lists', (req, res) => {
    res.sendFile(path.join(FRONTEND_PAGES_GET, 'list-task.html'));
});

router.get('/lists/:id', (req, res) => {
    res.sendFile(path.join(FRONTEND_PAGES_GET, 'click-list-task.html'));
});

module.exports = router;