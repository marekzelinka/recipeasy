import { redirect } from "react-router";
import { prisma } from "~/lib/db.server";
import { requireAuthSession } from "~/lib/session.server";
import type { Route } from "./+types/destory-recipe";

export async function action({ request, params }: Route.ActionArgs) {
  const session = await requireAuthSession(request);

  await prisma.recipe.delete({
    select: { id: true },
    where: { id: params.recipeId, userId: session.user.id },
  });

  return redirect("/recipes");
}
