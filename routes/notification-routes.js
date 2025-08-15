import { Router } from "express";
import { registerToken, test } from "../controllers/notification-controller.js";

const notificationRouter = Router();

notificationRouter.post("/register-token", registerToken);
notificationRouter.post("/test", test);

export default notificationRouter;
