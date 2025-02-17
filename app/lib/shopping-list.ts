import type { Recipe } from "@prisma/client";

export function formatUserShoppingList(plainShoppingList: string): string[] {
  return plainShoppingList.split(",").filter(Boolean);
}

export function updateUserShoppingList(
  shoppingList: string[],
  recipeId: Recipe["id"],
): string {
  const foundId = shoppingList.includes(recipeId);
  const nextShoppingList = foundId
    ? shoppingList.filter((id) => id !== recipeId)
    : [...shoppingList, recipeId];

  return nextShoppingList.join(",");
}

export function formatRecipeIngredients(
  ingredients: Recipe["ingredients"],
): string[] {
  return ingredients.split("\n");
}
