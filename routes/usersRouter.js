import express from "express";
import authMiddleware from "../middlewares/auth.js";
import {
  createUser,
  loginUser,
  logoutUser,
  currentUser,
} from "../controllers/usersControllers.js";
import validateBody from "../helpers/validateBody.js";
import {
  loginUserSchema,
  registerUsersSchema,
} from "../schemas/usersSchemas.js";
const usersRouter = express.Router();

usersRouter.post("/register", validateBody(registerUsersSchema), createUser);
usersRouter.post("/login", validateBody(loginUserSchema), loginUser);
usersRouter.post("/logout", authMiddleware, logoutUser);
usersRouter.get("/current", authMiddleware, currentUser);

export default usersRouter;
