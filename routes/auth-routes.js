import { Router } from "express";
import {
  changePassword,
  loginUser,
  registerUser,
} from "../controllers/auth-controller.js";
import verifyJwt from "../middlewares/jwt-verify.js";

const authRouter = Router();

authRouter.post("/register", registerUser);

authRouter.post("/login", loginUser);

authRouter.put("/change-password", verifyJwt, changePassword);

export default authRouter;
