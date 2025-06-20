import mongoose, { mongo } from "mongoose";

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

const itemSchema = new mongoose.Schema({
  itemName: {
    type: String,
    require: true,
  },
  itemDescription: {
    type: String,
  },
  expireDate: {
    type: String,
    require: true,
  },
  category: {
    type: String,
    enum: allowedCategories,
    require: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // reference to User model
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
});

const Item = mongoose.model("Items", itemSchema);

export default Item;
