Aula 1

Vamos começar criando o projeto e preparando os arquivos principais. Instale o Express e crie o arquivo index.js:
const express = require('express')const app = express()

app.use(express.json())

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Servidor iniciado em <http://localhost>:${PORT}/`))
Agora vamos trabalhar pela primeira vez com variáveis de ambiente definidas pelo próprio app. Instale a biblioteca “dotenv” com o comando npm install dotenv e então modifique o arquivo principal:
​require('dotenv').config()
const express = require('express')

const app = express()

app.use(express.json())

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Servidor iniciado em <http://localhost>:${PORT}`))
Agora podemos criar um arquivo chamado .env na raiz do projeto e definir variáveis de ambiente que estarão disponíveis no processo da nossa aplicação:Obs.: Repare que agora ao trocar o valor da variável PORT teremos nossa aplicação rodando em uma porta diferente.
PORT=3000

JWT_KEY=a-very-secure-secret-key
Vamos passar agora para a parte de autenticação criando o model “users”. Nele iremos usar mais uma biblioteca nova, o “uuid”. Ela serve para gerar IDs únicos universais e pode ser instalada com o comando npm install uuid:
const uuid = require('uuid').v4
const bcrypt = require('bcrypt')

const users = [
  { id: '1', name: 'Isaac Pontes', email: 'isaac@email.com', password: '123456' },
  { id: '2', name: 'John Doe', email: 'john@email.com', password: '0000' }
]

module.exports = {
  getAllUsers: () => users,

  getUserById: (id) => users.find(user => user.id === id),

  getUserByEmail: (email) => users.find(user => user.email === email),

  createUser: (name, email, password) => {
    const newUser = {
      id: uuid(),
      name,
      email,
      password: bcrypt.hashSync(password, 10)
    }
    users.push(newUser)
    return newUser
  }
}
Agora vamos instalar o “jsonwebtoken” e começar a trabalhar a parte de autenticação, criando o auth-controller.js, onde criaremos os métodos de registro e login:
const usersModel = require("../models/users-model")
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

module.exports = {
  // POST /auth/register
  register: (req, res) => {
    const { name, email, password } = req.body

    if (typeof name !== 'string' || typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios' })
    }

    const existingUser = usersModel.getUserByEmail(email)
    if (existingUser) {
      return res.status(400).json({ message: 'E-mail já cadastrado!' })
    }

    const newUser = usersModel.createUser(name, email, password)
    res.status(201).json({ ...newUser, password: undefined })
  },

  // POST /auth/login
  login: (req, res) => {
    const { email, password } = req.body

    if (typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios' })
    }

    const user = usersModel.getUserByEmail(email)
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado!' })
    }

    const isValidPassword = bcrypt.compareSync(password, user.password)
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Credenciais incorretas!' })
    }

    const payload = { id: user.id, email: user.email }
    const token = jwt.sign(payload, process.env.JWT_KEY, { expiresIn: '1d' })
    res.json({ token })
  }
}
E juntamente com um método de login também precisaremos de um middleware para obter o token e garantir que a requisição está sendo feita por um usuário autenticado. Crie a pasta “middlewares” e o arquivo auth-middleware.js:
const jwt = require('jsonwebtoken')
const usersModel = require('../models/users-model')

module.exports = {
  ensureAuth: (req, res, next) => {
    const authHeader = req.headers.authorization

    if (!authHeader) return res.status(401).json({ message: 'Não autorizado!' })

    const token = authHeader.split(' ')[1]

    try {
      const { id } = jwt.verify(token, process.env.JWT_KEY)
      const user = usersModel.getUserById(id)
      if (!user) return res.status(404).json({ message: 'Usuário não encontrado!' })
      req.user = user
      next()
    } catch (error) {
      return res.status(401).json({ message: 'Token inválido!' })
    }
  }
}
Por fim, vamos criar um arquivo de rotas auth.js dentro de uma pasta “routes” para incluir as rotas de autenticação e então importá-las no arquivo principal:
const express = require('express')
const authController = require('../controllers/auth-controller')
const { ensureAuth } = require('../middlewares/auth-middleware')
const authRouter = express.Router()

authRouter.post('/register', authController.register)
authRouter.post('/login', authController.login)

authRouter.get('/test', ensureAuth, (req, res) => res.json({ message: 'ok' }))

module.exports = authRouter
require('dotenv').config()
const express = require('express')
const authRouter = require('./routes/auth')

const app = express()

app.use(express.json())

app.use('/auth', authRouter)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Servidor iniciado em http://localhost:${PORT}`))

---
## Aula 2

const HttpError = require('../errors/HttpError')const uuid = require('uuid').v4

let books = [
  { id: '1', title: 'Book One', author: 'Author One', quantityAvailable: 4 },
  { id: '2', title: 'Book Two', author: 'Author Two', quantityAvailable: 3 }
]

module.exports = {
  getAllBooks: () => books.map(book => ({ id: book.id, title: book.title })),

  getBookById: (id) => books.find(book => book.id === id),

  createBook: (title, author, quantityAvailable) => {
    const newBook = {
      id: uuid(),
      title,
      author,
      quantityAvailable
    }
    books.push(newBook)
    return newBook
  },

  updateBook: (id, updatedBook) => {
    const bookIndex = books.findIndex(book => book.id === id)
    if (bookIndex === -1) throw new HttpError(404, 'Livro não encontrado no sistema!')
    books[bookIndex] = { ...books[bookIndex], ...updatedBook }
    return books[bookIndex]
  },

  deleteBook: (id) => {
    const bookIndex = books.findIndex(book => book.id === id)
    if (bookIndex === -1) throw new HttpError(404, 'Livro não encontra no sistema!')
    const deletedBook = books[bookIndex]
    books = books.filter(book => book.id !== id)
    return deletedBook
  },

  takeBook: (id) => {
    const bookIndex = books.findIndex(book => book.id === id)
    if (bookIndex === -1) throw new HttpError(404, 'Livro não encontra no sistema!')
    books[bookIndex].quantityAvailable -= 1
  },

  returnBook: (id) => {
    const bookIndex = books.findIndex(book => book.id === id)
    if (bookIndex === -1) throw new HttpError(404, 'Livro não encontra no sistema!')
    books[bookIndex].quantityAvailable += 1
  }
}
Para o recurso de livros precisaremos de um controller completo, com métodos de leitura, criação, edição e exclusão:
const booksModel = require("../models/books-model")

module.exports = {
  // GET /api/books
  index: (req, res) => {
    const books = booksModel.getAllBooks()
    res.json(books)
  },

  // GET /api/books/:id
  show: (req, res) => {
    const { id } = req.params
    const book = booksModel.getBookById(id)
    if (!book) return res.status(404).json({ message: 'Livro não encontrado!' })
    res.json(book)
  },

  // POST /api/books
  save: (req, res) => {
    const { title, author, quantityAvailable } = req.body

    if (
      typeof title !== 'string' || typeof author !== 'string' || typeof quantityAvailable !== 'number'
    ) {
      return res.status(400).json({ message: 'Campos inválidos.' })
    }

    const newBook = booksModel.createBook(title, author, quantityAvailable)
    res.status(201).json(newBook)
  },

  // PUT /api/books/:id
  update: (req, res) => {
    const { id } = req.params
    const { title, author, quantityAvailable } = req.body
    const fieldsTpUpdate = {}

    if (title) fieldsTpUpdate.title = title
    if (author) fieldsTpUpdate.author = author
    if (quantityAvailable) fieldsTpUpdate.quantityAvailable = quantityAvailable

    const updatedBook = booksModel.updateBook(id, fieldsTpUpdate)
    return res.status(200).json(updatedBook)
  },

  // DELETE /api/books/:id
  delete: (req, res) => {
    const { id } = req.params
    const deletedBook = booksModel.deleteBook(id)
    res.status(200).json(deletedBook)
  }
}
Para realizar o tratamento de erros, comece criando uma classe para lidar especificamente com erros HTTP, permitindo definir um código de status específico:
module.exports = class HttpError {
  constructor(status, message) {
    super(message)
    this.status = status
  }
}
E em seguida, crie o middleware de tratamento de erros:
const HttpError = require("../errors/HttpError")

module.exports = (error, req, res, next) => {
  if (error) {
    if (error instanceof HttpError) {
      res.status(error.status).json({ message: error.message })
    } else {
      res.status(500).json({ message: error.message })
    }
  } else {
    next()
  }
}
Agora só precisamos incluir as rotas, e faremos isso em um arquivo separado api.js para manter as rotas organizadas:
const express = require('express')
const booksController = require('../controllers/books-controller')

const apiRouter = express.Router()

apiRouter.get('/books', booksController.index)
apiRouter.get('/books/:id', booksController.show)
apiRouter.post('/books', booksController.save)
apiRouter.put('/books/:id', booksController.update)
apiRouter.delete('/books/:id', booksController.delete)

module.exports = apiRouter
E incluir esse arquivo no server.js:
require('dotenv').config()
const express = require('express')
const authRouter = require('./routes/auth')
const apiRouter = require('./routes/api')
const errorMiddleware = require('./middlewares/error-middleware')

const app = express()

app.use(express.json())

app.use('/auth', authRouter)
app.use('/api', apiRouter)

app.use(errorMiddleware)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Servidor iniciado em http://localhost:${PORT}`))

---
## Aula 3

Nessa última parte iremos implementar a funcionalidade de empréstimo de livros. Começaremos pelo model “loans” que cuidará da lógica principal de funcionamento dos empréstimos, com métodos para leitura, criação de empréstimos e devolução de livros:

const HttpError = require('../errors/HttpError')const booksModel = require('./books-model')

const uuid = require('uuid').v4

const loans = [
  {
    id: '1',
    userId: '1',
    bookId: '1',
    loanDate: new Date('2024-01-01'),
    returnDate: null,
    isReturned: false,
    isLate: true
  },
]

module.exports = {
  getAllLoans: () => loans,

  getLoanById: (id) => loans.find(loan => loan.id === id),

  createLoan: (user, book) => {
    if (book.quantityAvailable < 1) throw new HttpError(400, 'Não há exemplares disponíveis!')

    const today = new Date()
    const returnDate = new Date()
    returnDate.setDate(today.getDate() + 14)

    const newLoan = {
      id: uuid(),
      userId: user.id,
      bookId: book.id,
      loanDate: today,
      returnDate: returnDate,
      isReturned: false,
      isLate: false
    }

    loans.push(newLoan)
    booksModel.takeBook(book.id)

    return newLoan
  },

  returnLoan: (id) => {
    const loanIndex = loans.findIndex(loan => loan.id === id)
    if (loanIndex === -1) throw new HttpError(404, 'Empréstimo não encontrado!')

    const loan = loans[loanIndex]
    if (loan.isReturned) return null

    loan.isReturned = true

    const today = new Date()
    const limitDate = new Date(loan.returnDate)
    loan.isLate = today > limitDate
    loan.returnDate = today

    booksModel.returnBook(loan.bookId)
    return loan
  }
}
Agora precisamos implementar as rotas que utilizarão esses métodos. Aqui iremos nos beneficiar da autenticação, fazendo com que os empréstimos só possam ser criados e devolvidos por usuários autenticados:
const HttpError = require("../errors/HttpError")
const booksModel = require("../models/books-model")
const loansModel = require("../models/loans-model")

module.exports = {
  // GET /api/loans
  index: (req, res) => {
    const loans = loansModel.getAllLoans()
    res.json(loans)
  },

  // GET /api/loans/:id
  show: (req, res) => {
    const { id } = req.params
    const loan = loansModel.getLoanById(id)
    if (!loan) throw new HttpError(404, 'Empréstimo não encontrado!')
    res.json(loan)
  },

  // POST /api/loans
  save: (req, res) => {
    const user = req.user
    const { bookId } = req.body

    if (typeof bookId !== 'string') throw new HttpError(400, 'ID de livro inválido!')

    const book = booksModel.getBookById(bookId)
    if (!book) throw new HttpError(404, 'Livro não encontrado!')
    
    const newLoan = loansModel.createLoan(user, book)
    res.status(201).json(newLoan)
  },

  // POST /api/loans/:id/return
  return: (req, res) => {
    const { id } =req.params
    const loan = loansModel.returnLoan(id)
    res.json(loan)
  }
}
Agora só precisamos associar corretamente os métodos às rotas:
const express = require('express')
const booksController = require('../controllers/books-controller')
const loansController = require('../controllers/loans-controller')
const { ensureAuth } = require('../middlewares/auth-middleware')
const apiRouter = express.Router()

apiRouter.get('/books', booksController.index)
apiRouter.get('/books/:id', booksController.show)

apiRouter.post('/books', booksController.save)
apiRouter.put('/books/:id', booksController.update)
apiRouter.delete('/books/:id', booksController.delete)

apiRouter.get('/loans', loansController.index)
apiRouter.get('/loans/:id', loansController.show)
apiRouter.post('/loans', ensureAuth, loansController.save)
apiRouter.post('/loans/:id/return', loansController.return)

module.exports = apiRouter