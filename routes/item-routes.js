import { Router } from "express";
import verifyJwt from "../middlewares/jwt-verify.js";
import {
  addItem,
  deleteItem,
  getItems,
  updateItem,
  getCategories,
} from "../controllers/item-controller.js";
import { upload } from "../middlewares/multer-middleware.js";
import { messaging } from "../middlewares/firebase.js";

const itemRouter = Router();

itemRouter.get("/get-items", verifyJwt, getItems);
itemRouter.post("/add-item", upload.single("image"), verifyJwt, addItem);

itemRouter.put("/update-item", verifyJwt, updateItem);
itemRouter.delete("/delete-item", verifyJwt, deleteItem);
itemRouter.get("/get-categories", getCategories);

itemRouter.post("/send-single", async (req, res) => {
  try {
    const { token, title, body, data } = req.body;

    // Validate required fields
    if (!token || !title || !body) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: token, title, body",
      });
    }

    const message = {
      notification: {
        title: title,
        body: body,
      },
      data: data || {},
      token: token,
      android: {
        notification: {
          clickAction: "FLUTTER_NOTIFICATION_CLICK",
          channelId: "high_importance_channel",
          priority: "high",
        },
      },
    };

    const response = await messaging.send(message);

    res.status(200).json({
      success: true,
      message: "Notification sent successfully",
      messageId: response,
    });
  } catch (error) {
    console.error("Error sending notification:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default itemRouter;
