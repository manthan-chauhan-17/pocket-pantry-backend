import { Router } from "express";
import { ApiResponse } from "../utils/api-response.js";

const healthcheckRouter = Router();

healthcheckRouter.get("/healthcheck", (req, res) => {
    res.status(200).json(new ApiResponse(200, "Healthcheck successful"));
});

export default healthcheckRouter;
// To check health of server