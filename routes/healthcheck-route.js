import { Router } from "express";
import { ApiResponse } from "../utils/api-response.js";

const healthcheckRouter = Router();

healthcheckRouter.get("/healthcheck", (req, res) => {
    res.status(200).json(new ApiResponse(200, "Healthcheck successful"));
});

export default healthcheckRouter;
// This code defines a healthcheck route using Express.js. When a GET request is made to the "/healthcheck" endpoint, it responds with a 200 status code and a JSON object indicating that the healthcheck was successful. The ApiResponse function is used to format the response.