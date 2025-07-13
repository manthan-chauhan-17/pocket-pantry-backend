import express from "express";
import NotificationService from "../services/notificationService.js";
import Item from "../models/Item.js";
import User from "../models/User.js";

const notificationRouter = express.Router();

// Send expiration notifications manually
notificationRouter.post("/send-expiration-check", async (req, res) => {
  try {
    await NotificationService.checkExpiringItems();
    res.json({
      success: true,
      message: "Expiration check completed successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Send custom notification to user
notificationRouter.post("/send-custom", async (req, res) => {
  try {
    const { userId, title, body, data } = req.body;

    if (!userId || !title || !body) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: userId, title, body",
      });
    }

    const result = await NotificationService.sendCustomNotification(
      userId,
      title,
      body,
      data
    );

    res.json({
      success: true,
      message: "Custom notification sent successfully",
      messageId: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Get user's expiring items
notificationRouter.get("/expiring-items/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { days = 3 } = req.query;

    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + parseInt(days));

    const expiringItems = await Item.find({
      user: userId,
      expireDate: {
        $gte: today,
        $lte: futureDate,
      },
      isExpired: false,
    }).sort({ expireDate: 1 });

    res.json({
      success: true,
      data: expiringItems,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Update user notification settings
notificationRouter.put("/settings/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { expirationNotifications, notificationDays } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      {
        "notificationSettings.expirationNotifications": expirationNotifications,
        "notificationSettings.notificationDays": notificationDays,
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    res.json({
      success: true,
      data: user.notificationSettings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Test notification endpoint
notificationRouter.post("/test", async (req, res) => {
  try {
    const { userId } = req.body;

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
