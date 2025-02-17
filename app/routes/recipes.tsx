import type { Recipe } from "@prisma/client";
import {
  ClipboardTypeIcon,
  ClockIcon,
  EllipsisVerticalIcon,
  ListMinusIcon,
  ListPlusIcon,
  PencilIcon,
  PlusIcon,
  UsersIcon,
} from "lucide-react";
import { Form, Link, useFetcher } from "react-router";
import { toast } from "sonner";
import { AspectRatio } from "~/components/ui/aspect-ratio";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { EmptyState } from "~/components/ui/empty-state";
import { UserDropdown } from "~/components/user-dropdown";
import { prisma } from "~/lib/db.server";
import { requireAuthSession } from "~/lib/session.server";
import type { Route } from "./+types/recipes";

export const meta: Route.MetaFunction = () => [{ title: "Recipes" }];

export async function loader({ request }: Route.LoaderArgs) {
  const session = await requireAuthSession(request);

  const user = await prisma.user.findUniqueOrThrow({
    select: { shoppingList: true },
    where: { id: session.user.id },
  });
  const shoppingList = user.shoppingList.split(",");

  const recipes = await prisma.recipe.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "asc" },
  });

  return { shoppingList, recipes };
}

export default function Recipes({ loaderData }: Route.ComponentProps) {
  const { shoppingList, recipes } = loaderData;

  return (
    <div className="space-y-8">
      <nav aria-label="Primary" className="flex items-center justify-between">
        <Form action="new">
          <Button type="submit" size="sm">
            <PlusIcon aria-hidden />
            Add Recipe
          </Button>
        </Form>
        <UserDropdown />
      </nav>
      <section className="space-y-4">
        <h1 className="text-2xl font-bold tracking-tight">Your recipes</h1>
        {recipes.length ? (
          <ul role="list" className="grid grid-cols-2 gap-6 md:grid-cols-3">
            {recipes.map((recipe) => (
              <li key={recipe.id} className="relative col-span-1">
                <RecipeItem
                  key={recipe.id}
                  recipe={recipe}
                  shoppingList={shoppingList}
                />
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState
            title="No recipes added"
            description="You have not added any recipes yet."
          >
            <Form action="new">
              <Button type="submit" size="sm">
                <PlusIcon aria-hidden />
                Add Recipe
              </Button>
            </Form>
          </EmptyState>
        )}
      </section>
    </div>
  );
}

function RecipeItem({
  recipe,
  shoppingList,
}: {
  recipe: Recipe;
  shoppingList: string[];
}) {
  const updateShoppingListFetcher = useFetcher();

  const isInShoppingList = shoppingList.includes(recipe.id);
  const optimisticIsInnShoppingList = updateShoppingListFetcher.formData
    ? updateShoppingListFetcher.formData.get("isInShoppingList") === "true"
    : isInShoppingList;

  const handleCopyTitle = async () => {
    toast.promise(window.navigator.clipboard.writeText(recipe.title), {
      success: "Recipe title copied!",
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <AspectRatio ratio={16 / 9}>
        <img
          src={recipe.image}
          alt=""
          className="size-full rounded-md object-cover"
        />
      </AspectRatio>
      <div className="flex items-center gap-2">
        <div className="min-w-0 flex-1 space-y-1">
          <p className="truncate text-sm font-medium">
            <Link to={recipe.link} className="underline underline-offset-4">
              {recipe.title}
            </Link>
          </p>
          <div className="flex justify-between text-xs font-medium text-muted-foreground">
            <p className="flex items-center gap-1 whitespace-nowrap">
              <img src={recipe.favicon} alt="" className="size-3.5" />
              {recipe.author}
            </p>
            <div className="flex gap-2">
              <p className="flex items-center gap-1 whitespace-nowrap">
                <ClockIcon aria-hidden className="size-3.5 opacity-90" />
                <span>
                  {`${recipe.cookingHours ? `${recipe.cookingHours}h` : ""} ${recipe.cookingMinutes ? `${recipe.cookingMinutes}m` : ""}`.trim()}
                </span>
              </p>
              <p className="flex items-center gap-1 whitespace-nowrap">
                <UsersIcon aria-hidden className="size-3.5 opacity-90" />
                {recipe.servings}
              </p>
            </div>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8">
              <EllipsisVerticalIcon aria-hidden />
              <div className="sr-only">Actions</div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-(--radix-dropdown-menu-trigger-width) min-w-60 rounded-lg"
          >
            <updateShoppingListFetcher.Form
              method="POST"
              action={`/api/update-list/${recipe.id}`}
            >
              <input type="hidden" name="intent" value="update-shopping-list" />
              <input
                type="hidden"
                name="isInShoppingList"
                value={optimisticIsInnShoppingList ? "false" : "true"}
              />
              <DropdownMenuItem asChild className="w-full">
                <button type="submit">
                  {optimisticIsInnShoppingList ? (
                    <>
                      <ListMinusIcon aria-hidden /> Remove from shopping list
                    </>
                  ) : (
                    <>
                      <ListPlusIcon aria-hidden /> Add to shopping list
                    </>
                  )}
                </button>
              </DropdownMenuItem>
            </updateShoppingListFetcher.Form>
            <DropdownMenuItem onClick={handleCopyTitle}>
              <ClipboardTypeIcon aria-hidden /> Copy title
            </DropdownMenuItem>
            <Form action={`${recipe.id}/edit`}>
              <DropdownMenuItem asChild className="w-full">
                <button type="submit">
                  <PencilIcon aria-hidden /> Edit
                </button>
              </DropdownMenuItem>
            </Form>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
