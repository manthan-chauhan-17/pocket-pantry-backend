import cron from "node-cron";
import Item from "../models/item-model.js";
import NotificationService from "./notification-service.js";

// This function checks for expiring items and sends notifications
async function checkExpiringItems() {
  try {
    console.log("Running expiry check...");

    // Calculate date 3 days from now (you can adjust this)
    const threeDayaFromNow = new Date();
    threeDayaFromNow.setDate(threeDayaFromNow.getDate() + 3);

    // Format date to match your item's expireDate format (assuming YYYY-MM-DD)
    const expiryThreshold = threeDayaFromNow.toISOString().split("T")[0];

    //  Find items expiring within the next 3 days
    const expiringItems = await Item.find({
      expireDate: { $lte: expiryThreshold },
    }).populate("user", "fcmTokens");

    // Group item by user
    const itemByUser = expiringItems.reduce((acc, item) => {
      if (!acc[item.user._id]) {
        acc[item.user._id] = [];
      }

      acc[item.user._id].push(item);
      return acc;
    }, {});

    // Send notifications to each user with expiring items
    for (const [userId, items] of Object.entries(itemByUser)) {
      try {
        await NotificationService.sendExpiryNotification(userId, items);
      } catch (error) {
        console.error(`Error notifying user ${userId}:`, error);
      }
    }

    console.log("Expiry check completed");
  } catch (error) {
    console.error("Error in expiry check:", error);
  }
}

export function startExpiryCronJob() {
  cron.schedule("0 9 * * *", checkExpiringItems, {
    schedule: true,
    timezone: "Asia/Kolkata",
  });

  console.log("Expiry notification cron job started");
}
