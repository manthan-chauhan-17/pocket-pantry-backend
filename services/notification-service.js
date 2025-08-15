import { messaging } from "../middlewares/firebase.js";
import User from "../models/user-model.js";

class NotificationService {
  /**
   * Add/Update FCM token for a user
   * @param {string} userId - User ID from your database
   * @param {string} token - FCM token from the device
   */

  static async addUserToken(userId, token) {
    try {
      // Find User and add token if not already present
      await User.findByIdAndUpdate(
        userId,
        { $addToSet: { fcmTokens: token } }, // $addToSet prevents duplicates
        { new: true }
      );

      console.log(`Token added for user ${userId}`);
    } catch (error) {
      console.error("Error adding FCM token:", error);
      throw error;
    }
  }

  /**
   * Send notification to a specific user
   * @param {string} userId - User ID to send notification to
   * @param {Object} notification - Notification payload
   * @param {Object} data - Additional data payload (optional)
   */

  // notification.service.js - Update the sendToUser method
  static async sendToUser(userId, notification, data = {}) {
    try {
      const user = await User.findById(userId);

      if (!user || !user.fcmTokens || user.fcmTokens.length === 0) {
        console.log(`User ${userId} has no registered devices`);
        return;
      }

      // Create a proper message object for each token
      const messages = user.fcmTokens.map((token) => ({
        token: token, // Device registration token
        notification: {
          title: notification.title || "Pocket Pantry",
          body: notification.body || "You have a new notification",
        },
        data: data, // Optional data payload
      }));

      // Send messages one by one to handle errors individually
      const sendPromises = messages.map(async (message) => {
        try {
          return await messaging.send(message);
        } catch (error) {
          console.error(`Error sending to token ${message.token}:`, error);
          // If token is invalid, you might want to remove it from the user's tokens
          if (
            error.code === "messaging/invalid-registration-token" ||
            error.code === "messaging/registration-token-not-registered"
          ) {
            await User.findByIdAndUpdate(userId, {
              $pull: { fcmTokens: message.token },
            });
            console.log(`Removed invalid token for user ${userId}`);
          }
          return null;
        }
      });

      const responses = await Promise.all(sendPromises);
      console.log("Notifications sent successfully");
      return responses.filter((res) => res !== null);
    } catch (error) {
      console.error("Error in sendToUser:", error);
      throw error;
    }
  }

  /**
   * Send expiry notification for items
   * @param {string} userId - User ID
   * @param {Array} expiringItems - Array of items about to expire
   */

  static async sendExpiryNotification(userId, expiringItems) {
    try {
      // Format the notification message based on number of expiring items
      let body;

      if (expiringItems.length === 1) {
        body = `${expiringItems[0].itemName} is expiring soon!`;
      } else {
        body = `${expiringItems.length} items in your pantry are expiring soon`;
      }

      //   Prepare notification payload
      const notification = {
        title: "Pocket Pantry Expiring Alert",
        body: body,
      };

      const data = {
        type: "expiry_alert",
        itemCount: expiringItems.length.toString(),
      };

      // Send the notification
      return await this.sendToUser(userId, notification, data);
    } catch (error) {
      console.error("Error sending expiry notification:", error);
      throw error;
    }
  }
}

export default NotificationService;

// f4PcWJyIR7GYYH5SfkZLWN:APA91bF4tpxR-wkL_lXRZwqNgkgfwGYQj1c6lN4kSnoGBX58oGhO_gH6yNWWYt-yK5hT3vhsB14VdzXo397zt2KpIvlS92GY6uG7MA-e06XfKOr2tLJW2H4
