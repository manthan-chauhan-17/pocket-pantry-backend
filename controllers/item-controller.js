import Item from "../models/item-model.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";

const addItem = async (req, res) => {
  const { itemName, itemDescription, expireDate, category } = req.body;

  //   userId from jwt token
  const userId = req.user.id;

  if (!itemName || !expireDate || !category) {
    return res.status(400).json(new ApiError(400, "Add Required fields"));
  }

  // Inserting to DB
  const item = await Item.insertOne({
    itemName,
    itemDescription,
    expireDate,
    category,
    user: userId,
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        id: item._id.toString(),
        itemName,
        itemDescription,
        expireDate,
        category,
        user: userId,
      },
      "Item Added Successfully"
    )
  );
};

const getItems = async (req, res) => {
  // From jwt
  const userId = req.user.id;

  // finding items from db
  const items = await Item.find({ user: userId });

  return res
    .status(200)
    .json(new ApiResponse(200, items, "Items Fetched Successfully"));
};

export { addItem, getItems };
