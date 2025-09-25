import cron from "node-cron";
import Item from "../models/item-model.js";
import NotificationService from "./notification-service.js";
import { DateHelper } from "../utils/date-helper.js";
import { deleteFromCloudinary } from "../utils/cloudinary-service.js";

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

/**
 * NEW: Cron job to delete items that have already expired.
 */

async function deleteExpiredItems() {
  try {
    console.log("Running expired item deletion job...");

    const now = DateHelper.now();

    // Find items where the expiry date is in the past
    const expiredItems = await Item.find({
      expireDate: { $lt: now },
    }).populate("user", "fcmTokens");

    if (expiredItems.length == 0) {
      console.log("No expired items to delete.");
      return;
    }

    // Group items by user to send a single notifciation
    const itemsByUser = expiredItems.reduce((acc, item) => {
      const userId = item.user._id.toString();
      if (!acc[userId]) acc[userId] = [];
      acc[userId].push(item);
      return acc;
    }, {});

    for (const [userId, items] of Object.entries(itemsByUser)) {
      try {
        // 1. Notify the user about the deletion
        await NotificationService.sendToUser(userId, {
          title: "Pantry Cleanup",
          body: `We've removed ${
            items.length
          } expired item(s) from your pantry: ${items
            .map((i) => i.itemName)
            .join(", ")}.`,
        });

        // 2. Delete items from Cloudinary and MongoDB
        for (const item of items) {
          if (item.image && item.image.publicId) {
            await deleteFromCloudinary(item.image.publicId);
          }
          await Item.findByIdAndDelete(item._id);
        }

        console.log(`Deleted ${items.length} expired items for user ${userId}`);
      } catch (error) {
        console.error(
          `Error processing expired items for user ${userId}:`,
          error
        );
      }
    }

    console.log("Expired item deletion completed ✅");
  } catch (error) {
    console.error("Error in deleteExpiredItems job:", error);
  }
}

// will run every hour
export function startCronJobs() {
  cron.schedule("0 9 * * *", checkExpiringItems, {
    schedule: true,
    timezone: "Asia/Kolkata",
  });

  // NEW: Runs every day at midnight to clean up expired items
  cron.schedule("0 0 * * *", deleteExpiredItems, {
    scheduled: true,
    timezone: "Asia/Kolkata",
  });

  console.log("Cron jobs started: Expiry notifications and daily cleanup.");
}
