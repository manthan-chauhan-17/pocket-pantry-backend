import express from "express";
import cors from "cors";
import healthcheckRouter from "./routes/healthcheck-route.js";
import authRouter from "./routes/auth-routes.js";
import itemRouter from "./routes/item-routes.js";
import bodyParser from "body-parser";
import notificationRouter from "./routes/notification-routes.js";
import { startExpiryCronJob } from "./services/cron-jobs.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// Routes
app.use("/api/v1", healthcheckRouter); // Register the healthcheck route
app.use("/api/v1/auth", authRouter); // Register the auth route
app.use("/api/v1/item", itemRouter); // CRUD operation of item
app.use("/api/v1/notification", notificationRouter); // Firebase notification

// Start cron job for expiry notification
startExpiryCronJob();

export default app;
