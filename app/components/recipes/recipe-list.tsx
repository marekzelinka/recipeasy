import type { Recipe } from "@prisma/client";
import {
  ClipboardTypeIcon,
  ClockIcon,
  EllipsisVerticalIcon,
  ListMinusIcon,
  ListPlusIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
  UsersIcon,
} from "lucide-react";
import { Form, Link, useFetcher } from "react-router";
import { toast } from "sonner";
import { AspectRatio } from "../ui/aspect-ratio";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export function RecipeList({
  shoppingList,
  recipes,
}: {
  shoppingList: string[];
  recipes: Recipe[];
}) {
  return (
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
          <div className="text-muted-foreground flex justify-between text-xs font-medium">
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
            <Button variant="ghost" size="icon" className="size-7">
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
              action={`/api/shopping-list/update/${recipe.id}`}
            >
              <input
                type="hidden"
                name="isInShoppingList"
                value={isInShoppingList ? "false" : "true"}
              />
              <DropdownMenuItem asChild className="w-full">
                <button type="submit">
                  {isInShoppingList ? (
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

  return (
    <li className="relative col-span-1 flex flex-col gap-2">
      <div className="bg-muted relative overflow-hidden rounded-lg">
        <img
          src={recipe.image}
          alt=""
          className="aspect-10/7 w-full object-cover"
        />
        <div className="ring-foreground/10 absolute inset-0 rounded-2xl ring-1 ring-inset" />
        <div className="absolute inset-x-4 bottom-4 flex items-center justify-between">
          <Tooltip>
            <Form method="POST" action={`${recipe.id}/edit`}>
              <TooltipTrigger asChild>
                <Button
                  type="submit"
                  variant="outline"
                  size="icon"
                  className="size-7"
                >
                  <PencilIcon aria-hidden />
                </Button>
              </TooltipTrigger>
            </Form>
            <TooltipContent>
              <p>Edit recipe</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <updateShoppingListFetcher.Form
              method="POST"
              action={`/api/shopping-list/update/${recipe.id}`}
            >
              <input
                type="hidden"
                name="isInShoppingList"
                value={isInShoppingList ? "false" : "true"}
              />
              <TooltipTrigger asChild>
                <Button
                  type="submit"
                  variant="outline"
                  size="icon"
                  className="size-7"
                >
                  {optimisticIsInnShoppingList ? (
                    <TrashIcon aria-hidden />
                  ) : (
                    <PlusIcon aria-hidden />
                  )}
                </Button>
              </TooltipTrigger>
            </updateShoppingListFetcher.Form>
            <TooltipContent>
              <p>
                {optimisticIsInnShoppingList
                  ? "Remove from shopping list"
                  : "Add to shopping list"}
              </p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
      <div className="space-y-1">
        <p className="truncate text-sm font-medium">
          <Link to={recipe.link} className="underline underline-offset-4">
            {recipe.title}
          </Link>
        </p>
        <div className="text-muted-foreground flex justify-between text-sm font-medium">
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
    </li>
  );
}
