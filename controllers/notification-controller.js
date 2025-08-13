import Item from "../models/item-model.js";
import NotificationService from "../services/notification-service.js";

const sendExpirationCheck = async (req, res) => {
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
};

const sendCustomNotification = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, body, data } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: "Missing JWT Token",
      });
    }
    if (!title || !body) {
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
      message: "Custom Notification Sent Successfully",
      messageId: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const expiringItems = async (req, res) => {
  try {
    const userId = req.user.id;
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
};

export { sendExpirationCheck, sendCustomNotification, expiringItems };
