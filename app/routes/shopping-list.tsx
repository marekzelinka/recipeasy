import { CookingPotIcon } from "lucide-react";
import { Form, Link } from "react-router";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Checkbox } from "~/components/ui/checkbox";
import { EmptyState } from "~/components/ui/empty-state";
import { Label } from "~/components/ui/label";
import { prisma } from "~/lib/db.server";
import { requireAuthSession } from "~/lib/session.server";
import { formatUserShoppingList } from "~/lib/shopping-list";
import type { Route } from "./+types/shopping-list";

export async function loader({ request }: Route.LoaderArgs) {
  const session = await requireAuthSession(request);

  const user = await prisma.user.findUniqueOrThrow({
    select: { shoppingList: true },
    where: { id: session.user.id },
  });
  const shoppingList = formatUserShoppingList(user.shoppingList);

  const recipes = await prisma.recipe.findMany({
    select: { title: true, ingredients: true },
    where: { id: { in: shoppingList }, userId: session.user.id },
  });

  return { recipes };
}

export default function ShoppingList({ loaderData }: Route.ComponentProps) {
  const { recipes } = loaderData;

  return (
    <Card className="mx-auto max-w-md">
      <CardHeader className="flex-row justify-between">
        <CardTitle asChild className="text-xl">
          <h1>Shopping list</h1>
        </CardTitle>
        <Form method="POST" action="/api/shopping-list/clear" navigate={false}>
          <Button variant="outline" size="sm">
            Clear list
          </Button>
        </Form>
      </CardHeader>
      <CardContent>
        {recipes.length ? (
          <div className="space-y-4">
            {recipes.map((recipe) => {
              const ingredientList = recipe.ingredients.split("\n");

              return (
                <fieldset key={recipe.title} className="space-y-2">
                  <Label asChild className="text-base font-semibold">
                    <legend>{recipe.title}</legend>
                  </Label>
                  <div className="space-y-1">
                    {ingredientList.map((ingredient, i) => (
                      <Label
                        key={i}
                        className="hover:bg-muted grid grid-cols-[auto_1fr] items-center gap-3 rounded-md p-2"
                      >
                        <Checkbox className="peer size-3.5" />
                        <span className="text-muted-foreground peer-data-[state=checked]:text-muted-foreground/50 select-none peer-data-[state=checked]:line-through">
                          {ingredient}
                        </span>
                      </Label>
                    ))}
                  </div>
                </fieldset>
              );
            })}
          </div>
        ) : (
          <EmptyState
            title="No recipes added"
            description="You have not added any recipes yet. Add one from the recipes page."
          >
            <Button asChild variant="secondary">
              <Link to="/recipes">
                <CookingPotIcon aria-hidden /> Go to your recipes
              </Link>
            </Button>
          </EmptyState>
        )}
      </CardContent>
    </Card>
  );
}
