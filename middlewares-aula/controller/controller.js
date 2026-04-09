const session = require('express-session');
const loginSystemModel = require('../model/model.js')

class LoginSystemController {
    registerUser (req, res) {
        try {
            const { username, password } = req.body;
    
            if (!username || !/^[a-zA-Zà-úÀ-Ú\s]+$/.test(username) || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Nome ou senha invalidos!'
                });
            }
    
            const result = loginSystemModel.register(username, password);
            if (result.success) {
                req.session.authenticated = true;
                req.session.currentUser = username;

                res.status(201).json(result);
            } else {
                res.status(400).json(result);
            }
        } catch (error) {
            console.log('Erro: ', error);
            return res.status(500).json({
                success: false,
                message: 'Erro interno',
                error: error.message
            });
        }
    }

    loginUser (req, res) {
        try {
            const { username, password } = req.body;

            if (!username || !/^[a-zA-Zà-úÀ-Ú\s]+$/.test(username) || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Nome ou senha invalidos!'
                });
            }

            const result = loginSystemModel.login(username, password);

            if (result.success) {
                req.session.authenticated = true;
                req.session.currentUser = result.data.username;
                return res.status(200).json(result); 
            } else {
                return res.status(400).json(result);
            }
        } catch (error) {
            console.log('Erro: ', error);
            return res.status(500).json({
                success: false,
                message: 'Erro interno',
                error: error.message
            });
        }

    }

    logout (req, res) {
        try {
            setTimeout(() => {
                res.redirect('/home');
            }, 1000 * 2);
        } catch (error) {
            console.log('Erro: ', error);
            return res.status(500).json({
                success: false,
                message: 'Erro interno',
                error: error.message
            });
        }
    }
}

module.exports = new LoginSystemController();