"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
/*
O operador ?? (Nullish Coalescing) faz o seguinte:
Se globalThis.prisma já tiver uma instância (já estiver criado), ele usa a existente.
Se for nulo ou indefinido, ele cria uma new PrismaClient().
Por que isso é importante?
Em desenvolvimento, ferramentas como o ts-node-dev ou o Next.js recarregam seus arquivos toda vez que você salva. Se você fizesse apenas const prisma = new PrismaClient(),
cada vez que você salvasse o código, uma nova conexão seria aberta. Em poucos minutos, seu banco de dados travaria por excesso de conexões abertas. Usando o global,
a conexão é "reaproveitada" entre os recarregamentos.
*/
const prisma = globalThis.prisma ?? new client_1.PrismaClient();
/*
Essa verificação garante que esse comportamento de salvar a instância no global aconteça apenas em desenvolvimento.
Em produção, o servidor não fica reiniciando toda hora, então não precisamos "poluir" o objeto global; criamos a instância e pronto.
Em desenvolvimento, nós salvamos a instância criada no globalThis.prisma para que ela seja encontrada na próxima vez que o arquivo for lido após um salvamento.

- ResumindoEsse código serve como um filtro de segurança. Ele garante que sua aplicação tenha apenas uma única instância do Prisma rodando, não importa quantas
vezes o seu servidor reinicie durante o desenvolvimento na sua máquina.
*/
if (process.env.NODE_ENV !== 'production') {
    globalThis.prisma = prisma;
}
class UsersModel {
    static async findAll() {
        try {
            const users = await prisma.users.findMany();
            if (users.length === 0) {
                return { success: true, data: [], message: 'Nenhum Usuario cadastrado' };
            }
            return { success: true, data: users };
        }
        catch (error) {
            return {
                success: false,
                message: `Erro ao listar usuarios: ${error.message}`
            };
        }
    }
    static async findUserById(id) {
        try {
            const user = await prisma.users.findUnique({
                where: ({
                    id: id
                })
            });
            if (user === null) {
                return { success: false, message: 'Nenhum Usuario cadastrado' };
            }
            return { success: true, data: user };
        }
        catch (error) {
            return {
                success: false,
                message: `Erro ao listar usuario: ${error.message}`
            };
        }
    }
    static async loginByEmail(email, password) {
        try {
            const user = await prisma.users.findUnique({
                where: ({
                    email: email
                }),
            });
            if (user === null) {
                return { success: false, message: 'Usuario não cadastrado!' };
            }
            if (user.password !== password) {
                return { success: false, message: 'Senha incorreta!' };
            }
            return { success: true, data: user };
        }
        catch (error) {
            return {
                success: false,
                message: `Erro interno ao efetuar login: ${error.message}`
            };
        }
    }
    static async createNewUser(name, email, password) {
        try {
            const emailExists = await prisma.users.findUnique({
                where: ({
                    email: email
                })
            });
            if (emailExists) {
                return { success: false, message: 'Email já cadastrado' };
            }
            const newUser = await prisma.users.create({
                data: ({
                    name: name,
                    email: email,
                    password: password
                })
            });
            return { success: true, data: newUser, message: 'Usuario cadastrado com sucesso!' };
        }
        catch (error) {
            return {
                success: false,
                message: `Erro ao cadastrar usuario: ${error.message}`
            };
        }
    }
    static async updateUser(id, name, email, password) {
        try {
            const user = await prisma.users.findUnique({
                where: ({
                    id: id
                })
            });
            if (user === null) {
                return { success: false, message: 'Usuario não cadastrado' };
            }
            // Criamos um objeto parcial baseado no modelo do Prisma
            const dataToUpdate = {};
            if (name !== undefined)
                dataToUpdate.name = name;
            if (email !== undefined)
                dataToUpdate.email = email;
            if (password !== undefined)
                dataToUpdate.password = password;
            if (Object.keys(dataToUpdate).length === 0) {
                return { success: false, message: 'Nenhum campo fornecido para atualizar.' };
            }
            const result = await prisma.users.update({
                where: ({
                    id: id
                }),
                data: dataToUpdate
            });
            return {
                success: true, data: result, message: `Usuário ${result.name} atualizado com sucesso.`
            };
        }
        catch (error) {
            return {
                success: false,
                message: `Erro ao atualizar usuario: ${error.message}`
            };
        }
    }
    static async deleteUser(id) {
        try {
            const user = await prisma.users.findUnique({
                where: ({
                    id: id
                })
            });
            if (user === null) {
                return { success: false, message: 'Nenhum Usuario cadastrado' };
            }
            const nameUser = user.name;
            await prisma.users.delete({
                where: ({
                    id: id
                })
            });
            return { success: true, message: 'Usuario deletado com sucesso!' };
        }
        catch (error) {
            return {
                success: false,
                message: `Erro ao cadastrar usuario: ${error.message}`
            };
        }
    }
}
exports.default = UsersModel;
