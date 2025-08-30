import moment from "moment";
import Item from "../models/item-model.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary-service.js";

const addItem = async (req, res) => {
  const { itemName, itemDescription, expireDate, category } = req.body;

  //   userId from jwt token
  const userId = req.user.id;

  if (!itemName || !expireDate || !category) {
    return res.status(400).json(new ApiError(400, "Add Required fields"));
  }

  let imageUrl = null;
  let publicId = null;

  if (req.file) {
    const cloudinaryResult = await uploadOnCloudinary(req.file.path);
    if (cloudinaryResult && cloudinaryResult.url) {
      imageUrl = cloudinaryResult.url;
      // console.log(imageUrl);
      publicId = cloudinaryResult.public_id;
      // console.log(publicId);
    } else {
      return res.status(400).json(new ApiError(400, "Image upload failed"));
    }
  }

  // console.log("Image URL:", imageUrl);

  // Inserting to DB
  const item = await Item.insertOne({
    itemName,
    itemDescription,
    expireDate,
    category,
    image: { url: imageUrl, publicId },
    user: userId,
  });

  // console.log("Item added to DB:", item);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        item: {
          id: item._id.toString(),
          itemName,
          itemDescription,
          expireDate,
          category,
          image: { url: imageUrl, publicId },
        },
      },
      "Item Added Successfully"
    )
  );
};

const getItems = async (req, res) => {
  // From jwt
  const userId = req.user.id;

  // finding items from db
  const itemsFromDB = await Item.find({ user: userId }).select("-__v -user");

  // Convert _id to id
  const items = itemsFromDB.map((item) => {
    const itemObj = item.toObject();
    itemObj.id = itemObj._id;
    delete itemObj._id;
    return itemObj;
  });

  return res
    .status(200)
    .json(new ApiResponse(200, { items }, "Items Fetched Successfully"));
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
    .json(
      new ApiResponse(200, { item: updatedItem }, "Item Updated Successfully")
    );
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

  const itemTobeDeleted = await Item.findById(itemId);

  console.log("PUBLIC ID :", itemTobeDeleted.image.publicId);

  const cloudinaryResult = await deleteFromCloudinary(
    itemTobeDeleted.image.publicId
  );

  console.log("cloud result ::", cloudinaryResult);

  const deletedItem = await Item.findByIdAndDelete({
    _id: itemId,
    user: userId,
  });

  if (!deletedItem) {
    return res.status(400).json(new ApiError(400, "Error deleting item"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "", "Item deleted successfully"));
};

const getCategories = async (req, res) => {
  try {
    return res.status(200).json({
      cateogires: [
        "Vegetables",
        "Fruits",
        "Dairy",
        "Grains",
        "Spices",
        "Beverages",
        "Snacks",
        "Frozen",
        "Others",
      ],
      status: 200,
      message: "Categories",
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Something went wrong",
    });
  }
};

const getSingleItem = async (req, res) => {
  const { itemId } = req.body;

  if (!itemId) {
    return res.status(400).json(new ApiError(400, "Item id is required"));
  }

  const itemFromDB = await Item.findById(itemId).select("-__v -user");

  if (!itemFromDB) {
    return res.status(404).json(new ApiError(404, "Item not found"));
  }

  // Convert _id to id
  const itemObj = itemFromDB.toObject();
  itemObj.id = itemObj._id;
  delete itemObj._id;
  const item = itemObj;

  return res
    .status(200)
    .json(new ApiResponse(200, { item }, "Item Fetched Successfully"));
};

export {
  addItem,
  getItems,
  updateItem,
  deleteItem,
  getCategories,
  getSingleItem,
};
