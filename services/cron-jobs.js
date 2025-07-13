import cron from "node-cron";
import NotificationService from "./notificationService.js";

class CronJobs {
  static initializeCronJobs() {
    // Check for expiring items every day at 9 AM
    cron.schedule("0 9 * * *", async () => {
      console.log("Running expiration check cron job...");
      try {
        await NotificationService.checkExpiringItems();
      } catch (error) {
        console.error("Error in expiration check cron job:", error);
      }
    });

    // Check for expiring items every 6 hours (more frequent checking)
    cron.schedule("0 */6 * * *", async () => {
      console.log("Running frequent expiration check...");
      try {
        await NotificationService.checkExpiringItems();
      } catch (error) {
        console.error("Error in frequent expiration check:", error);
      }
    });

    // Mark expired items daily at midnight
    cron.schedule("0 0 * * *", async () => {
      console.log("Running expired items cleanup...");
      try {
        await NotificationService.markExpiredItems();
      } catch (error) {
        console.error("Error in expired items cleanup:", error);
      }
    });

    console.log("Cron jobs initialized successfully");
  }
}

export default CronJobs;
