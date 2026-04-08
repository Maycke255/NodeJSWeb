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

    register (username, password) {
        const userAlreadyExists = this.users.findIndex(user => user.username === username);

        if (userAlreadyExists) {
            return { success: false, message: 'Usuario já cadastrado', data: [] }
        }

        
    }
}