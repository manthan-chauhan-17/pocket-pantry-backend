import { Router } from "express";
import { ApiResponse } from "../utils/api-response.js";

const healthcheckRouter = Router();

healthcheckRouter.get("/healthcheck", (req, res) => {
  res.status(200).json(new ApiResponse(200, "Healthcheck successful"));
});

// Example API
healthcheckRouter.get("/ping", (req, res) => {
  res.json({ message: "Ping successful!" });
});

// Auto hit every 14 minutes
setInterval(async () => {
  try {
    console.log("Auto hitting API every 14 minutes...");

    // Replace with your API URL
    const response = await axios.get(
      "https://pocket-pantry-backend-dnce.onrender.com/api/v1/ping"
    );

    console.log("Response:", response.data);
  } catch (error) {
    console.error("Error hitting API:", error.message);
  }
}, 14 * 60 * 1000); // 14

export default healthcheckRouter;
// To check health of server
