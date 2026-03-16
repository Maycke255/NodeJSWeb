const path = require('path');
const express = require('express');
const FlowTaskController = require('../controller/taskListController');

const router = express.Router();

router.get('/api/list-task', FlowTaskController.allList);

const FRONTEND_PAGES_GET = path.join(__dirname, '../../frontend/pages/');

router.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/index.html'));
});

router.get('/lists', (req, res) => {
    res.sendFile(path.join(FRONTEND_PAGES_GET, 'list-task.html'))
})

module.exports = router;