import {
  getRecipesFromSpoonacular,
  getRecipeDetailsFromSpoonacular,
} from "../services/recipe-service.js";

import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";

const getRecipesByIngredients = async (req, res) => {
  const { ingredients } = req.body; // e.g., ["apples", "flour", "sugar"]

  if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
    return res
      .status(400)
      .json(new ApiError(400, "Ingredients array is required."));
  }

  try {
    const recipes = await getRecipesFromSpoonacular(ingredients);
    return res
      .status(200)
      .json(new ApiResponse(200, { recipes }, "Recipes fetched successfully"));
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return res.status(500).json(new ApiError(500, "Failed to fetch recipes"));
  }
};

const getRecipeDetails = async (req, res) => {
  const { recipeId } = req.body; // Get recipe ID from URL parameter

  try {
    const recipeDetails = await getRecipeDetailsFromSpoonacular(recipeId);
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { recipe: recipeDetails },
          "Recipe details fetched successfully"
        )
      );
  } catch (error) {
    console.error(`Error fetching details for recipe ${id}:`, error);
    return res
      .status(500)
      .json(new ApiError(500, "Failed to fetch recipe details"));
  }
};

export { getRecipesByIngredients, getRecipeDetails };
