import cron from "node-cron";
import Item from "../models/item-model.js";
import NotificationService from "./notification-service.js";
import { DateHelper } from "../utils/date-helper.js";

async function checkExpiringItems() {
  try {
    console.log("Running expiry check...");

    // Current timestamp
    const now = DateHelper.now();

    // Threshold: 3 days from now
    const threeDaysFromNow = DateHelper.addDays(now, 3);

    // Find items expiring within the next 3 days
    const expiringItems = await Item.find({
      expireDate: { $lte: threeDaysFromNow, $gte: now }, // expires between now and +3d
    }).populate("user", "fcmTokens");

    if (expiringItems.length === 0) {
      console.log("No items expiring in the next 3 days");
      return;
    }

    // Group items by user
    const itemByUser = expiringItems.reduce((acc, item) => {
      if (!acc[item.user._id]) acc[item.user._id] = [];
      acc[item.user._id].push(item);
      return acc;
    }, {});

    // Send notifications to each user with expiring items
    for (const [userId, items] of Object.entries(itemByUser)) {
      try {
        await NotificationService.sendExpiryNotification(userId, items);

        console.log(
          `User ${userId} notified for items expiring:`,
          items.map((i) =>
            DateHelper.format(i.expireDate, "DD MMM YYYY, hh:mm A")
          )
        );
      } catch (error) {
        console.error(`Error notifying user ${userId}:`, error);
      }
    }

    console.log("Expiry check completed ✅");
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
