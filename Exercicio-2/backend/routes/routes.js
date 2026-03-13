const path = require('path');
const express = require('express');
const FlowTaskController = require('../controller/taskListController');

const router = express.Router();

router.get('/flow-task/api/list-task', FlowTaskController.allList);

router.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/index.html'));
});

module.exports = router;