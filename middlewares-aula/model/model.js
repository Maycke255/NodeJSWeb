const crypto = require('crypto')

class ModelMuter {
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
    register (id, username, password) {
        const userAlreadyExists = this.users.findIndex(userId => userId.id === id);

        if (userAlreadyExists) {
            return { success: false, message: 'Usuario já cadastrado', data: [] }
        }

        const newUser = { username, password }
        this.users.push(newUser);

        return { success: true, message: 'Usuario cadastrado com sucesso', data: this.users }
    }

    //POST login
    login (id, username, password) {
        const userAlreadyExists = this.users.findIndex(userId => userId.id === id);

        if (userAlreadyExists === -1) {
            return { success: false, message: 'Usuario não cadastrado!', data: [] }
        }

        const userPassword = this.users[userAlreadyExists].password;
        if (password !== userPassword) {
            return { success: false, message: 'Senha incorreta', data: [] }
        }

        return { success: true, message: 'Login efetuado com sucesso', data: { user: username, password: password } }
    }

    //GET logout
}

module.exports = new ModelMuter();