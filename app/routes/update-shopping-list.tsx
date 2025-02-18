import { requireAuthSession } from "~/lib/auth.server";
import { prisma } from "~/lib/db.server";
import { formatShoppingList, updateShoppingList } from "~/lib/recipe";
import type { Route } from "./+types/update-shopping-list";

export async function action({ request, params }: Route.ActionArgs) {
  const session = await requireAuthSession(request);

  const user = await prisma.user.findUniqueOrThrow({
    select: { shoppingList: true },
    where: { id: session.user.id },
  });
  const shoppingList = formatShoppingList(user.shoppingList);

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
