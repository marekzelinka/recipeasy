import { ChevronLeftIcon, CookingPotIcon, ListXIcon } from "lucide-react";
import { Form, href, Link } from "react-router";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { EmptyState } from "~/components/ui/empty-state";
import { Label } from "~/components/ui/label";
import { requireAuthSession } from "~/lib/auth.server";
import { prisma } from "~/lib/db.server";
import { formatRecipeIngredients, formatShoppingList } from "~/lib/recipe";
import type { Route } from "./+types/shopping-list";

export const meta: Route.MetaFunction = () => [{ title: "Shopping list" }];

export async function loader({ request }: Route.LoaderArgs) {
  const session = await requireAuthSession(request);

  const user = await prisma.user.findUniqueOrThrow({
    select: { shoppingList: true },
    where: { id: session.user.id },
  });
  const shoppingList = formatShoppingList(user.shoppingList);

  const recipes = await prisma.recipe.findMany({
    select: { title: true, ingredients: true },
    where: { id: { in: shoppingList }, userId: session.user.id },
  });

  return { recipes };
}

export default function ShoppingList({ loaderData }: Route.ComponentProps) {
  const { recipes } = loaderData;

  return (
    <div className="mx-auto max-w-lg space-y-2">
      <nav aria-label="Primary" className="flex items-center justify-between">
        <Button asChild variant="secondary" size="sm">
          <Link to={href("/recipes")}>
            <ChevronLeftIcon aria-hidden />
            Go back
          </Link>
        </Button>
      </nav>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Shopping list</h1>
          <Form method="post" action="clear" navigate={false}>
            <Button
              type="submit"
              variant="outline"
              size="sm"
              disabled={recipes.length === 0}
              onClick={(event) => {
                const shouldClear = confirm("Are you sure?");
                if (!shouldClear) {
                  event.preventDefault();
                }
              }}
            >
              <ListXIcon /> Clear list
            </Button>
          </Form>
        </div>
        {recipes.length ? (
          <div className="space-y-6">
            {recipes.map((recipe) => {
              const ingredientList = formatRecipeIngredients(
                recipe.ingredients,
              );

              return (
                <fieldset key={recipe.title} className="space-y-3">
                  <Label asChild className="text-base font-semibold">
                    <legend>{recipe.title}</legend>
                  </Label>
                  {ingredientList.map((ingredient, i) => (
                    <Label
                      key={i}
                      className="grid grid-cols-[auto_1fr] items-center gap-3 rounded-md p-2 hover:bg-muted"
                    >
                      <Checkbox />
                      <span className="select-none peer-data-[state=checked]:text-muted-foreground peer-data-[state=checked]:line-through">
                        {ingredient}
                      </span>
                    </Label>
                  ))}
                </fieldset>
              );
            })}
          </div>
        ) : (
          <EmptyState
            title="No recipes added"
            description="You have not added any recipes yet. Add one from the recipes page."
          >
            <Button asChild>
              <Link to="/recipes">
                <CookingPotIcon aria-hidden /> Go to your recipes
              </Link>
            </Button>
          </EmptyState>
        )}
      </div>
    </div>
  );
}
