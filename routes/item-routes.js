import { Router } from "express";
import verifyJwt from "../middlewares/jwt-verify.js";
import { addItem, deleteItem, getItems, updateItem } from "../controllers/item-controller.js";
import { upload } from "../middlewares/multer-middleware.js";

const itemRouter = Router();

itemRouter.get("/get-items", verifyJwt, getItems);
itemRouter.post("/add-item", 
    upload.single('image') ,
    verifyJwt, addItem);

itemRouter.put('/update-item',verifyJwt,updateItem);
itemRouter.delete('/delete-item' , verifyJwt , deleteItem);

export default itemRouter;