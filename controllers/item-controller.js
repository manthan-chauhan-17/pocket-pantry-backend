import moment from "moment";
import Item from "../models/item-model.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { uploadOnCloudinary } from "../utils/cloudinary-service.js";

const addItem = async (req, res) => {
  const { itemName, itemDescription, expireDate, category } = req.body;

  //   userId from jwt token
  const userId = req.user.id;

  if (!itemName || !expireDate || !category) {
    return res.status(400).json(new ApiError(400, "Add Required fields"));
  }
  let formattedExpireDate = moment(expireDate).format("DD:MM:YYYY");
  console.log(formattedExpireDate);

  let imageUrl = null;

  if (req.file) {
    const cloudinaryResult = await uploadOnCloudinary(req.file.path);
    if (cloudinaryResult && cloudinaryResult.url) {
      imageUrl = cloudinaryResult.url;
    } else {
      return res.status(400).json(new ApiError(400, "Image upload failed"));
    }
  }

  // console.log("Image URL:", imageUrl);

  // Inserting to DB
  const item = await Item.insertOne({
    itemName,
    itemDescription,
    expireDate: formattedExpireDate,
    category,
    image: imageUrl,
    user: userId,
  });

  // console.log("Item added to DB:", item);

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
  // console.log(items);

  return res
    .status(200)
    .json(new ApiResponse(200, items, "Items Fetched Successfully"));
};

const updateItem = async (req, res) => {
  const { itemId, itemName, itemDescription, expireDate, category } = req.body;

  const userId = req.user.id;

  if (!itemId) {
    return res.status(400).json(new ApiError(400, "Item Id is required"));
  }

  const existingItem = await Item.findOne({ _id: itemId, user: userId });

  if (!existingItem) {
    return res
      .status(400)
      .json(new ApiError(400, "Item not found or unauthorized"));
  }

  const updatedFields = {
    itemName: itemName?.trim() !== "" ? itemName : existingItem.itemName,
    itemDescription:
      itemDescription?.trim() !== ""
        ? itemDescription
        : existingItem.itemDescription,
    expireDate: expireDate || existingItem.expireDate,
    category: category?.trim() !== "" ? category : existingItem.category,
  };

  const updatedItem = await Item.findByIdAndUpdate(itemId, updatedFields, {
    new: true,
  });

  if (!updatedItem) {
    return res.status(400).json(new ApiError(400, "Error updating item"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedItem, "Item Updated Successfully"));
};

const deleteItem = async (req, res) => {
  const { itemId } = req.body;

  const userId = req.user.id;

  if (!itemId) {
    return res.status(400).json(new ApiError(400, "Item id is required"));
  }

  if (!userId) {
    return res.status(403).json(new ApiError(403, "Unauthorized request"));
  }

  const deletedItem = await Item.findByIdAndDelete({
    _id: itemId,
    user: userId,
  });

  if (!deletedItem) {
    return res.status(400).json(new ApiError(400, "Error deleting item"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Item deleted successfully"));
};

export { addItem, getItems, updateItem, deleteItem };
