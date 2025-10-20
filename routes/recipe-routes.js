import { Router } from "express";
import {
  getRecipesByIngredients,
  getRecipeDetails,
} from "../controllers/recipe-controller.js";
import verifyJwt from "../middlewares/jwt-verify.js";

const recipeRouter = Router();

recipeRouter.post("/get-recipes", verifyJwt, getRecipesByIngredients);

recipeRouter.get("/recipe-details", getRecipeDetails);

export default recipeRouter;
