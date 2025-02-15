import { AddRecipeButton } from "~/components/recipes/add-recipe-button";
import { RecipeList } from "~/components/recipes/recipe-list";
import { UserDropdown } from "~/components/user/user-dropdown";
import { prisma } from "~/lib/db.server";
import { requireAuthSession } from "~/lib/session.server";
import type { Route } from "./+types/recipes";

export async function loader({ request }: Route.LoaderArgs) {
  const session = await requireAuthSession(request);

  const recipes = await prisma.recipe.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return { recipes };
}

export default function Recipes({ loaderData }: Route.ComponentProps) {
  const { recipes } = loaderData;

  return (
    <div className="space-y-8">
      <nav aria-label="Primary" className="flex items-center justify-between">
        <AddRecipeButton />
        <UserDropdown />
      </nav>
      <section className="space-y-4">
        <h1 className="text-2xl font-bold tracking-tight">Your recipes</h1>
        <RecipeList recipes={recipes} />
      </section>
    </div>
  );
}
