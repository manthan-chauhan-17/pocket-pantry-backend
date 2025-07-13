import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    fcmToken: {
      type: String, // Store FCM token for notifications
      required: true,
    },
    notificationSettings: {
      expirationNotifications: {
        type: Boolean,
        default: true,
      },
      notificationDays: {
        type: Number,
        default: 2,
        min: 1,
        max: 3,
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
export default User;
