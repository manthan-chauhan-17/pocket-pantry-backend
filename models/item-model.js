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
      type: Number,
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
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

const Item = mongoose.model("Items", itemSchema);

export default Item;
