import NotificationService from "../services/notification-service.js";

/**
 * Endpoint to register a device token for a user
 * POST /api/notifications/register-token
 * Body: { userId, token }
 */
const registerToken = async (req, res) => {
  try {
    const { userId, token } = req.body;

    if (!userId || !token) {
      return res
        .status(400)
        .json(new ApiError(400, "userId and token are required"));
    }

    await NotificationService.addUserToken(userId, token);

    res.json({ success: true });
  } catch (error) {
    console.error("Error registering token:", error);
    res.status(500).json({ error: "Failed to register token" });
  }
};

/**
 * Test endpoint to send a notification (for development)
 * POST /api/notifications/test
 * Body: { userId }
 */

const test = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    await NotificationService.sendToUser(userId, {
      title: "Test Notification",
      body: "This is a test notification from Pocket Pantry!",
    });

    res.json({ success: true });
  } catch (error) {
    console.error("Error sending test notification:", error);
    res.status(500).json({ error: "Failed to send test notification" });
  }
};

export { registerToken, test };
