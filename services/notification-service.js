import { messaging } from "../middlewares/firebase.js";
import Item from "../models/item-model.js";
import User from "../models/user-model.js";
import moment from "moment";

class NotificationService {
  // Send expiration notification to single user

  static async sendExpirationNotification(user, items) {
    try {
      if (!user.fcmToken) {
        console.log(`No FCM token for this user ${user.email}`);
        return;
      }
      const itemCount = items.length;
      const itemNames = items.Items.map((item) => item.name).join(", ");

      let title, body;

      if (itemCount === 1) {
        const item = items[0];
        const daysLeft = this.calculateDaysUntilExpiration(item.expireDate);
        title = `Your ${item.name} will expire in ${daysLeft} days`;
        body = `This is just a reminder that ${itemNames} will expire in ${daysLeft} day${
          daysLeft > 1 ? "s" : ""
        }`;
      } else {
        title = `Your ${itemCount} items will expire soon`;
        body = `These are just reminders that ${itemNames} will expire soon. Check your inventory!`;
      }

      const message = {
        notification: {
          title,
          body,
        },
        data: {
          type: "expiration_notification",
          itemCount: itemCount.toString(),
          itemIds: items.map((item) => item._id.toString()).join(","),
        },
        token: user.fcmToken,
        android: {
          notification: {
            clickAction: "FLUTTER_NOTIFICATION_CLICK",
            channelId: "expiration_channel",
            priority: "high",
            icon: "ic_warning",
            color: "#FF6B35",
          },
        },
      };

      const response = await messaging.send(message);
      console.log(`Notification sent to ${user.email} successfully`, response);

      //   Mark items as notified in the database
      await this.markItemsAsNotified(items);
    } catch (error) {
      console.error("Error sending expiration notification:", error);
      throw error;
    }
  }

  //   Mark items as notified in the database
  static async markItemsAsNotified(items) {
    const itemIds = items.map((item) => item._id.toString());
    await Item.updateMany(
      { _id: { $in: itemIds } },
      { notificationSent: true, notificationDate: new Date() }
    );
  }

  //   Calculate days until expiration
  static calculateDaysUntilExpiration(expireDate) {
    const today = moment();
    const expiry = moment(expireDate).startOf("day");
    return expiry.diff(today, "days");
  }

  //   Check for items expiring soon
  static async checkExpiringItems() {
    try {
      console.log(`Checking for items expiring soon...`);

      const today = moment().startOf("day");
      const threeDaysLater = moment().add(3, "days").startOf("day");

      // Find items expiring in 1-3 days that have not been notified yet
      const expiringItems = await Item.aggregate([
        {
          $match: {
            expireDate: {
              $gte: today.toDate(),
              $lte: threeDaysLater.toDate(),
            },
            notificationSent: false,
            isExpired: false,
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "user",
            foreignField: "_id",
            as: "userDetails",
          },
        },
        {
          $unwind: "$userDetails",
        },
        {
          $match: {
            "userDetails.notificationSettings.expirationNotifications": true,
            "userDetails.isActive": true,
          },
        },
        {
          $addFields: {
            daysUntilExpiration: {
              $divide: [
                { $subtract: ["$expireDate", today.toDate()] },
                1000 * 60 * 60 * 24,
              ],
            },
          },
        },
        {
          $match: {
            $expr: {
              $lte: ["$daysUntilExpiration", "$daysBeforeExpiration"],
            },
          },
        },
        {
          $group: {
            _id: "$user",
            user: { $first: "$userDetails" },
            items: { $push: "$$ROOT" },
          },
        },
      ]);

      console.log(`Found ${expiringItems.length} users with expiring items...`);

      //   Send notifications to users
      const notificationPromises = expiringItems.map((userGroup) => {
        this.sendExpirationNotification(userGroup.user, userGroup.items);
      });

      await Promise.all(notificationPromises);

      console.log(`Items expiring soon notifications sent successfully!`);
    } catch (error) {
      console.error("Error checking for items expiring soon:", error);
      throw error;
    }
  }

  //   Mark Expired Items
  static async markExpiredItems() {
    try {
      const today = moment().startOf("day");
      const result = await Item.updateMany(
        { expireDate: { $lt: today.toDate() }, isExpired: false },
        { isExpired: true }
      );
      console.log(`Marked ${result.nModified} expired items.`);
    } catch (error) {
      console.error("Error marking expired items:", error);
      throw error;
    }
  }

  //   Send Custom Notification
  static async sendCustomNotification(userId, title, body, data = {}) {
    try {
      const user = await User.findById(userId);

      if (!user || !user.fcmToken) {
        throw new Error(`No FCM token found for user with id ${userId}`);
      }

      const message = {
        notification: {
          title,
          body,
        },
        token: user.fcmToken,
        android: {
          clickAction: "FLUTTER_NOTIFICATION_CLICK",
          channelId: "general_channel",
          priority: "high",
          icon: "ic_info",
          color: "#FF6B35",
        },
      };

      return await messaging.send(message);
    } catch (error) {
      console.error("Error sending custom notification:", error);
      throw error;
    }
  }
}

export default NotificationService;
