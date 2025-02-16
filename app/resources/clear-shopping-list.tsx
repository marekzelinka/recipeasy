import { prisma } from "~/lib/db.server";
import { requireAuthSession } from "~/lib/session.server";
import type { Route } from "./+types/clear-shopping-list";

export async function action({ request }: Route.ActionArgs) {
  const session = await requireAuthSession(request);

  const updatedUser = await prisma.user.update({
    select: { shoppingList: true },
    data: { shoppingList: "" },
    where: { id: session.user.id },
  });

  return {
    ok: true,
    message: "Shopping list cleared successfully",
    shoppingList: updatedUser.shoppingList,
  };
}
