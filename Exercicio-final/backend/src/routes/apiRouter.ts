import { Router } from "express";
import userControllerADM from "../controller/admin/userControllerADM.js";

const apiRouter = Router();

apiRouter.post("/users", userControllerADM.createNewUser);
apiRouter.put("/users/:id", userControllerADM.updateUser);
apiRouter.delete("/users/:id", userControllerADM.deleteUser);

export default apiRouter;