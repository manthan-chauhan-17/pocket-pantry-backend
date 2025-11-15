import axios from "axios";
import dotenv from "dotenv";
import { RemoteConfigFetchResponse } from "firebase-admin/remote-config";

dotenv.config();

const SPOONACULAR_API_KEY = process.env.SPOONACULAR_API_KEY;

/**
 * Helper function to log Spoonacular API quota headers.
 * @param {object} headers - The response headers object from axios.
 */
const _logSpoonacularQuota = (headers) => {
  if (!headers) {
    return; // No headers, nothing to log
  }

  // Axios lowercases all header keys
  const quotaRequest = headers["x-api-quota-request"];
  const quotaUsed = headers["x-api-quota-used"];
  const quotaLeft = headers["x-api-quota-left"];

  if (quotaRequest || quotaUsed || quotaLeft) {
    console.log("Spoonacular API Quota:", {
      request: quotaRequest,
      used: quotaUsed,
      left: quotaLeft,
    });
  }
};

const getRecipesFromSpoonacular = async (ingredients) => {
  const ingredientsString = ingredients.join(",");

  const url = "https://api.spoonacular.com/recipes/complexSearch";

  try {
    const response = await axios.get(url, {
      params: {
        includeIngredients: ingredientsString,
        addRecipeInformation: true,
        number: 10,
        apiKey: SPOONACULAR_API_KEY,
        fillIngredients: true,
        sort: "max-used-ingredients",
      },
    });

    // --- LOG HEADERS for Devlopment Environment ---
    if (process.env.ENV == "dev ") {
      _logSpoonacularQuota(response.headers);
    }

    const simplifiedRecipes = response.data.results.map((recipe) => ({
      id: recipe.id,
      title: recipe.title,
      image: recipe.image,
      readyInMinutes: recipe.readyInMinutes,
      usedIngredientCount: recipe.usedIngredientCount,
      missedIngredientCount: recipe.missedIngredientCount,
    }));

    return simplifiedRecipes;
  } catch (error) {
    console.error(
      "Spoonacular API Error:",
      error.response ? error.response.data : error.message
    );
    throw new Error("Could not fetch recipes from Spoonacular.");
  }
};

const getRecipeDetailsFromSpoonacular = async (recipeId) => {
  const url = `https://api.spoonacular.com/recipes/${recipeId}/information`;

  try {
    const response = await axios.get(url, {
      params: {
        apiKey: SPOONACULAR_API_KEY,
        includeNutrition: false, // Can be enabled later if needed
      },
    });

    const data = response.data;

    // Return a clean, structured object for the frontend
    return {
      id: data.id,
      title: data.title,
      image: data.image,
      readyInMinutes: data.readyInMinutes,
      servings: data.servings,
      ingredients: data.extendedIngredients.map((ing) => ({
        name: ing.name,
        amount: ing.amount,
        unit: ing.unit,
        original: ing.original,
      })),
      instructions:
        data.analyzedInstructions[0]?.steps.map((step) => ({
          number: step.number,
          step: step.step,
        })) || [], // Handle cases with no analyzed instructions
    };
  } catch (error) {
    console.error(
      `Spoonacular API Error for recipe ${recipeId}:`,
      error.response ? error.response.data : error.message
    );
    throw new Error("Could not fetch recipe details from Spoonacular.");
  }
};

export { getRecipesFromSpoonacular, getRecipeDetailsFromSpoonacular };
