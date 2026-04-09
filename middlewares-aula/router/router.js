const express = require('express');
const authMiddleware = require('../middlewares/auth.js');
const path = require('path')
const controller = require('../controller/controller.js');
const dashboardController = require('../controller/dashboardController.js');

const router = express.Router();

//POST Register
router.post('/auth/register', controller.registerUser);

//POST LOGIN
router.post('/auth/login', controller.loginUser);

//GET DASHBOARD
router.get('/auth/dashboard', authMiddleware, dashboardController.dashboard);

//GET OBTER USUARIO
router.get('/auth/user', (req, res) => {
    res.json({ data: req.session.currentUser || 'Visitante'});
})

//GET LOGOUT
router.get('/auth/logout', authMiddleware, controller.logout);

//GET HOME
router.get('/index', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/home.html'));
});

module.exports = router;