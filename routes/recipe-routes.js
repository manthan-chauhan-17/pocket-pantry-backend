import { Router } from "express";
// import verifyJwt from "../middlewares/jwt-verify.js";
import {
  getRecipesByIngredients,
  getRecipeDetails,
} from "../controllers/recipe-controller.js";

const recipeRouter = Router();

recipeRouter.post("/get-recipes", getRecipesByIngredients);

recipeRouter.get("/recipe-details", getRecipeDetails);

// recipeRouter.post("/login", loginUser);

// recipeRouter.put("/change-password", verifyJwt, changePassword);

export default recipeRouter;
