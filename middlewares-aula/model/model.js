const crypto = require('crypto')

class loginSystemModel {
    constructor () {
        this.users = [
            { 
                id: '1',
                username: 'Maycke',
                password: '123456'
             },
             {
                id: 2,
                username: 'Moises',
                password: '654321'
             }
        ]
    }

    //POST register
    register (username, password) {
        const userAlreadyExists = this.users.find(user => user.username === username);

        if (userAlreadyExists) {
            return { success: false, message: 'Usuario já cadastrado!', data: [] }
        }

        const newUser = {id: crypto.randomUUID(), username, password }
        this.users.push(newUser);

        return { success: true, message: 'Usuario cadastrado com sucesso\nCarregando', data: this.users }
    }

    //POST login
    login (username, password) {
        const user = this.users.find(user => user.username === username);

        if (!user) { 
            return { success: false, message: 'Usuário não cadastrado!', data: [] };
        }

        if (password !== user.password) {
            return { success: false, message: 'Senha incorreta!', data: [] }
        }

        return { success: true, message: 'Login efetuado com sucesso\nCarregando', data: user }
    }

}

module.exports = new loginSystemModel();