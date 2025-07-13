import mongoose from "mongoose";

const allowedCategories = [
  "Vegetables",
  "Fruits",
  "Dairy",
  "Grains",
  "Spices",
  "Beverages",
  "Snacks",
  "Frozen",
  "Others",
];

const itemSchema = new mongoose.Schema(
  {
    itemName: {
      type: String,
      required: true,
    },
    itemDescription: {
      type: String,
    },
    expireDate: {
      type: Date, // Changed from String to Date for better date operations
      required: true,
    },
    category: {
      type: String,
      enum: allowedCategories,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    image: {
      url: {
        type: String,
        required: true,
      },
      publicId: {
        type: String,
        required: true,
      },
    },
    // New fields for notification tracking
    notificationSent: {
      type: Boolean,
      default: false,
    },
    notificationDate: {
      type: Date,
    },
    isExpired: {
      type: Boolean,
      default: false,
    },
    daysBeforeExpiration: {
      type: Number,
      default: 2, // User can set when they want to be notified (1-3 days)
      min: 1,
      max: 3,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// Index for efficient querying
itemSchema.index({ expireDate: 1, notificationSent: 1, isExpired: 1 });
itemSchema.index({ user: 1, expireDate: 1 });

const Item = mongoose.model("Items", itemSchema);

export default Item;
