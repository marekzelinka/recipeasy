import { data, redirect } from "react-router";
import { requireAuthSession } from "~/lib/auth.server";
import { prisma } from "~/lib/db.server";
import { formatShoppingList, updateShoppingList } from "~/lib/recipe";
import type { Route } from "./+types/destory-recipe";

export async function action({ request, params }: Route.ActionArgs) {
  const session = await requireAuthSession(request);

  const recipe = await prisma.recipe.findUnique({
    select: { id: true },
    where: { id: params.recipeId, userId: session.user.id },
  });
  if (!recipe) {
    throw data("No recipe found", { status: 404 });
  }

  await prisma.recipe.delete({
    select: { id: true },
    where: { id: params.recipeId },
  });

  const user = await prisma.user.findUniqueOrThrow({
    select: { shoppingList: true },
    where: { id: session.user.id },
  });
  const shoppingList = formatShoppingList(user.shoppingList);

  const isRecipeInShoppingList = shoppingList.includes(recipe.id);
  if (isRecipeInShoppingList) {
    // Remove the deleted recipe id from the shopping list
    const nextShoppingList = updateShoppingList(shoppingList, recipe.id);

    await prisma.user.update({
      select: { id: true },
      data: { shoppingList: nextShoppingList },
      where: { id: session.user.id },
    });
  }

  return redirect("/recipes");
}
