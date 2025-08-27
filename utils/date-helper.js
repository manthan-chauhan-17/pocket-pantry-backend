import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";

dayjs.extend(utc);

export const DateHelper = {
  /**
   * Get current UTC timestamp in ms
   */
  now: () => dayjs().valueOf(),

  /**
   * Add days to a timestamp (returns ms)
   */
  addDays: (timestamp, days) => dayjs(timestamp).add(days, "day").valueOf(),

  /**
   * Subtract days from a timestamp (returns ms)
   */
  subtractDays: (timestamp, days) =>
    dayjs(timestamp).subtract(days, "day").valueOf(),

  /**
   * Convert timestamp to human-readable string
   */
  format: (timestamp, format = "DD MMM YYYY, hh:mm A") =>
    dayjs(timestamp).utc().format(format),
};
