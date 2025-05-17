import { Router } from "express";
import verifyJwt from "../middlewares/jwt-verify.js";
import { addItem, getItems } from "../controllers/item-controller.js";

const itemRouter = Router();

itemRouter.get('/get-items' , verifyJwt , getItems);
itemRouter.post('/add-item' , verifyJwt , addItem);

export default itemRouter;