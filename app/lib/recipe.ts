import type { Recipe } from "@prisma/client";
import urlMetadata from "url-metadata";
import { z } from "zod";

export const RecipeSchema = z.object({
  link: z.string({ required_error: "Link is required" }).url("Link is invalid"),
  title: z
    .string({ required_error: "Title is required" })
    .trim()
    .nonempty("Title is too short"),
  author: z
    .string()
    .trim()
    .optional()
    .transform((arg) => arg || ""),
  image: z
    .string()
    .trim()
    .url("Image is invalid URL")
    .optional()
    .transform((arg) => arg || ""),
  favicon: z
    .string()
    .trim()
    .url("Favicon is invalid URL")
    .optional()
    .transform((arg) => arg || ""),
  ingredients: z
    .string({ required_error: "Ingredient list is required" })
    .trim()
    .nonempty("Ingredient list is too short"),
  servings: z.coerce
    .number({
      required_error: "Servings is required",
      invalid_type_error: "Servings must be 0 or more",
    })
    .min(1, "Servings must be more than 1")
    .max(12, "Servings must be less than 12"),
  cookingHours: z.coerce
    .number({
      required_error: "Cooking hours is required",
      invalid_type_error: "Cooking hours must be 0 or more",
    })
    .min(0, "Cooking hours must be greater than 0")
    .max(23, "Cooking hours must be less than 23"),
  cookingMinutes: z.coerce
    .number({
      required_error: "Cooking minutes is required",
      invalid_type_error: "Cooking minutes must be 0 or more",
    })
    .min(0, "Cooking hours must be greater than 0")
    .max(59, "Cooking minutes must be less than 59"),
});

export async function parseRecipe(link: Recipe["link"]) {
  const metadata = await urlMetadata(link);

  const metadataImage = metadata.image as string;
  const metadataOgImage = metadata["og:image"] as string;
  const image = metadataImage || metadataOgImage;

  const linkOrigin = new URL(link).origin;

  const defaultFaviconUrl = `${linkOrigin}/favicon.ico`;
  const metadataFavicons = metadata.favicons as {
    rel: string;
    href: string;
  }[];
  const faviconIcon = metadataFavicons.find(
    (favicon) => favicon.rel === "icon",
  );
  const faviconIconUrl = faviconIcon?.href ? linkOrigin + faviconIcon.href : "";
  const favicon = faviconIconUrl || defaultFaviconUrl;

  return { image, favicon };
}

export function formatShoppingList(plainShoppingList: string): string[] {
  return plainShoppingList.split(",").filter(Boolean);
}

export function updateShoppingList(
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
