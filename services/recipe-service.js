import axios from "axios";
import dotenv from "dotenv";
import { RemoteConfigFetchResponse } from "firebase-admin/remote-config";

dotenv.config();

const SPOONACULAR_API_KEY = process.env.SPOONACULAR_API_KEY;

const getRecipesFromSpoonacular = async (ingredients) => {
  const ingredientsString = ingredients.join(",");

  const url = "https://api.spoonacular.com/recipes/findByIngredients";

  try {
    const response = await axios.get(url, {
      params: {
        ingredients: ingredientsString,
        number: 10,
        apiKey: SPOONACULAR_API_KEY,
        ranking: 1,
        ignorePantry: true,
      },
    });

    const simplifiedRecipes = response.data.map((recipe) => ({
      id: recipe.id,
      title: recipe.title,
      image: recipe.image,
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
