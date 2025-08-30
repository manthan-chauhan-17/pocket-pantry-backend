import { Router } from "express";
import verifyJwt from "../middlewares/jwt-verify.js";
import {
  addItem,
  deleteItem,
  getItems,
  updateItem,
  getCategories,
  getSingleItem,
} from "../controllers/item-controller.js";
import { upload } from "../middlewares/multer-middleware.js";
import { messaging } from "../middlewares/firebase.js";

const itemRouter = Router();

itemRouter.get("/get-items", verifyJwt, getItems);
itemRouter.post("/add-item", upload.single("image"), verifyJwt, addItem);

itemRouter.put("/update-item", verifyJwt, updateItem);
itemRouter.delete("/delete-item", verifyJwt, deleteItem);
itemRouter.get("/get-categories", getCategories);
// upload.none() means no file upload but to parse data in form-data in postman as you need multer or any multipart parser to parse form-data of postman
itemRouter.post("/get-single-item", upload.none(), getSingleItem);

export default itemRouter;
