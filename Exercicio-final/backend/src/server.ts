// SERVER: ponto de entrada da API. Monta o app na ordem certa e liga o servidor.
// O .env é carregado pelos scripts do package.json (--env-file=.env).

import express from "express";
import router from "./routes/apiRouter.js" // ⚠️ duplicado da linha de baixo e sem uso: pode apagar
import authRouter from "./routes/authRouter.js";
import apiRouter from "./routes/apiRouter.js"
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();

// Middlewares que rodam ANTES das rotas, em toda requisição:
app.use(express.json()); // transforma o corpo JSON em objeto no req.body
app.use(express.urlencoded( {extended: true} )); // o mesmo para dados de formulário HTML

// Rotas, cada grupo com seu prefixo:
app.use("/auth", authRouter); // /auth/...
app.use("/api", apiRouter);   // /api/...

// O errorHandler fica SEMPRE por último, depois das rotas:
// é ele que recebe os erros lançados nelas.
app.use(errorHandler);

const PORT = process.env.PORT || 3000; // usa a porta do .env ou 3000
app.listen(PORT, () => console.log(`API rodando na porta: http://localhost:${PORT}`));
