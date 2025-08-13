import express from "express";
import NotificationService from "../services/notification-service.js";
import Item from "../models/item-model.js";
import User from "../models/user-model.js";
import {
  expiringItems,
  sendCustomNotification,
  sendExpirationCheck,
} from "../controllers/notification-controller.js";
import verifyJwt from "../middlewares/jwt-verify.js";

const notificationRouter = express.Router();

// Send expiration notifications manually
notificationRouter.post("/send-expiration-check", sendExpirationCheck);

// Send custom notification to user
notificationRouter.post("/send-custom", verifyJwt, sendCustomNotification);

// Get user's expiring items
notificationRouter.get("/expiring-items", verifyJwt, expiringItems);

// Update user notification settings
// notificationRouter.put("/settings/:userId", async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const { expirationNotifications, notificationDays } = req.body;

//     const user = await User.findByIdAndUpdate(
//       userId,
//       {
//         "notificationSettings.expirationNotifications": expirationNotifications,
//         "notificationSettings.notificationDays": notificationDays,
//       },
//       { new: true }
//     );

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         error: "User not found",
//       });
//     }

//     res.json({
//       success: true,
//       data: user.notificationSettings,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       error: error.message,
//     });
//   }
// });

// Test notification endpoint
notificationRouter.post("/test", verifyJwt, async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await NotificationService.sendCustomNotification(
      userId,
      "Test Notification",
      "This is a test notification from your food inventory app!",
      { type: "test" }
    );

    res.json({
      success: true,
      message: "Test notification sent successfully",
      messageId: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default notificationRouter;
