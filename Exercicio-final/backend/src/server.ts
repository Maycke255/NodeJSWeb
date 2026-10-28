import express from "express";
import router from "./routes/apiRouter.js"
import authRouter from "./routes/authRouter.js";
import apiRouter from "./routes/apiRouter.js"

const app = express();

app.use(express.json());
app.use(express.urlencoded( {extended: true} ));

app.use("/auth", authRouter);
app.use("/api", apiRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API rodando na porta: http://localhost:${PORT}`));