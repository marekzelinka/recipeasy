import type { Recipe } from "@prisma/client";
import { prisma } from "~/lib/db.server";
import { requireAuthSession } from "~/lib/session.server";
import type { Route } from "./+types/update-shopping-list";

export async function action({ request, params }: Route.ActionArgs) {
  const session = await requireAuthSession(request);

  const user = await prisma.user.findUniqueOrThrow({
    select: { shoppingList: true },
    where: { id: session.user.id },
  });
  const shoppingList = user.shoppingList.split(",");

  const nextShoppingList = updateShoppingList(shoppingList, params.recipeId);

  const updatedUser = await prisma.user.update({
    select: { shoppingList: true },
    data: {
      shoppingList: nextShoppingList,
    },
    where: { id: session.user.id },
  });

  return {
    ok: true,
    message: "Shopping list updated successfully",
    shoppingList: updatedUser.shoppingList,
  };
}

function updateShoppingList(ids: string[], recipeId: Recipe["id"]) {
  const foundId = ids.includes(recipeId);
  const nextIds = foundId
    ? ids.filter((id) => id !== recipeId)
    : [...ids, recipeId];

  return nextIds.filter(Boolean).join(",");
}
