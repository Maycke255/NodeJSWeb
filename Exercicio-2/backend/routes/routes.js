const path = require('path');
const express = require('express');
const FlowTaskController = require('../controller/taskListController');
const FlowTaskControllerAdmin = require('../controller/taskListControllerAdmin');

const router = express.Router();

router.get('/api/list-task', FlowTaskController.allList);
router.get('/api/list-task/:id', FlowTaskController.acessAList);
router.get('/api/delete-list-task/:id', FlowTaskControllerAdmin.delTaskList);

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