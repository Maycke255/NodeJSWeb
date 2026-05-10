import { Prisma, PrismaClient } from "@prisma/client";

/* 
No TypeScript, o objeto global (ou globalThis) é onde moram as variáveis que ficam disponíveis em todo o projeto sem precisar de import. Quando usamos o declare global,
estamos "avisando" ao compilador que vamos adicionar uma nova propriedade customizada a esse objeto global. Sem isso, o TS reclamaria que prisma não existe dentro de 
globalThis. 

Diferente de let ou const, variáveis declaradas com var no escopo global do TypeScript são as únicas que conseguem ser "mescladas" à interface global.
É uma regra técnica do TS: para aumentar ou modificar o objeto global, a declaração precisa ser feita com var.

Estamos dizendo que a variável global prisma pode conter uma instância do Prisma ou estar vazia (undefined). Isso é necessário porque, na primeira vez que o 
servidor subir, ela estará vazia, e só depois será preenchida.
*/
declare global {
    var prisma: PrismaClient | undefined
}

/* 
O operador ?? (Nullish Coalescing) faz o seguinte:
Se globalThis.prisma já tiver uma instância (já estiver criado), ele usa a existente.
Se for nulo ou indefinido, ele cria uma new PrismaClient().
Por que isso é importante?
Em desenvolvimento, ferramentas como o ts-node-dev ou o Next.js recarregam seus arquivos toda vez que você salva. Se você fizesse apenas const prisma = new PrismaClient(), 
cada vez que você salvasse o código, uma nova conexão seria aberta. Em poucos minutos, seu banco de dados travaria por excesso de conexões abertas. Usando o global, 
a conexão é "reaproveitada" entre os recarregamentos.
*/
const prisma = globalThis.prisma ?? new PrismaClient();

/*
Essa verificação garante que esse comportamento de salvar a instância no global aconteça apenas em desenvolvimento.
Em produção, o servidor não fica reiniciando toda hora, então não precisamos "poluir" o objeto global; criamos a instância e pronto.
Em desenvolvimento, nós salvamos a instância criada no globalThis.prisma para que ela seja encontrada na próxima vez que o arquivo for lido após um salvamento.

- ResumindoEsse código serve como um filtro de segurança. Ele garante que sua aplicação tenha apenas uma única instância do Prisma rodando, não importa quantas 
vezes o seu servidor reinicie durante o desenvolvimento na sua máquina.
*/

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma
}

interface Users {
    id: number;
    name: string;
    email: string;
    password: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
}

interface User {
    id: number
}

interface SuccessResponse<T> {
    success: true;
    data?: T;
    message?: string 
}

interface ErrorResponse {
    success: false;
    message: string;
}

type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;

class UsersModel {
    static async findAll (): Promise<ApiResponse<User[]>> {
        try {
            const users = await prisma.users.findMany();

            if (users.length === 0) {
                return { success: true, data: [], message: 'Nenhum Usuario cadastrado'}
            }

            return { success: true, data: users }
        } catch (error: any) {
            return {
                success: false,
                message: `Erro ao listar usuarios: ${error.message}`
            }
        }
    }

    static async findUserById (id: number): Promise<ApiResponse<Users>> {
        try {
            const user = await prisma.users.findUnique({
                where: ({
                    id: id
                })
            });

            if (user === null) {
                return { success: false, message: 'Nenhum Usuario cadastrado'}
            }

            return { success: true, data: user }
        } catch (error: any) {
            return {
                success: false,
                message: `Erro ao listar usuario: ${error.message}`
            }
        }
    }

    static async loginByEmail (email: string, password: string): Promise<ApiResponse<Users>> {
        try {
            const user = await prisma.users.findUnique({
                where: ({
                    email: email
                }),
            });

            if (user === null) {
                return { success: false, message: 'Usuario não cadastrado!' }
            }

            if (user.password !== password) {
                return { success: false, message: 'Senha incorreta!' }
            }

            return { success: true, data: user }
        } catch (error: any) {
            return {
                success: false,
                message: `Erro interno ao efetuar login: ${error.message}`
            }
        }
    }

    static async createNewUser (name: string, email: string, password: string): Promise<ApiResponse<Users>> {
        try {
            const emailExists = await prisma.users.findUnique({
                where: ({
                    email: email
                })
            });

            if (emailExists) {
                return { success: false, message: 'Email já cadastrado' }
            }

            const newUser = await prisma.users.create({
                data: ({
                    name: name,
                    email: email,
                    password: password
                })
            });

            return { success: true, data: newUser, message: 'Usuario cadastrado com sucesso!' }
        } catch (error: any) {
            return {
                success: false,
                message: `Erro ao cadastrar usuario: ${error.message}`
            }    
        }
    }

    static async updateUser (id: number, name?: string, email?: string, password?: string): Promise<ApiResponse<Users>> {
        try {
            const user = await prisma.users.findUnique({
                where: ({
                    id: id
                })
            });

            if (user === null) {
                return { success: false, message: 'Usuario não cadastrado'}
            }

            // Criamos um objeto parcial baseado no modelo do Prisma
            const dataToUpdate: Prisma.UsersUpdateInput = {};

            if (name !== undefined) dataToUpdate.name = name;
            if (email !== undefined) dataToUpdate.email = email;
            if (password !== undefined) dataToUpdate.password = password;

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
        } catch (error: any) {
            return {
                success: false,
                message: `Erro ao atualizar usuario: ${error.message}`
            }   
        }
    }

    static async deleteUser (id: number): Promise<ApiResponse<Users>> {
        try {
            const user = await prisma.users.findUnique({
                where: ({
                    id: id
                })
            });

            if (user === null) {
                return { success: false, message: 'Nenhum Usuario cadastrado'}
            }

            const nameUser: string = user.name;

            await prisma.users.delete({
                where: ({
                    id: id
                })
            });

            return { success: true, message: 'Usuario deletado com sucesso!' }
        } catch (error: any) {
            return {
                success: false,
                message: `Erro ao cadastrar usuario: ${error.message}`
            }   
        }
    }
}

export default UsersModel;