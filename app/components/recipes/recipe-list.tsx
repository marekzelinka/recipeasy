import type { Recipe } from "@prisma/client";
import { ClockIcon, PencilIcon, PlusIcon, UsersIcon } from "lucide-react";
import { Form, Link } from "react-router";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export function RecipeList({ recipes }: { recipes: Recipe[] }) {
  return (
    <ul role="list" className="grid grid-cols-2 gap-6 md:grid-cols-3">
      {recipes.map((recipe) => (
        <li key={recipe.id} className="relative col-span-1 flex flex-col gap-2">
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
                <Form method="POST">
                  <input type="hidden" name="id" value={recipe.id} />
                  <TooltipTrigger asChild>
                    <Button
                      type="submit"
                      name="intent"
                      value="addToShoppingList"
                      variant="outline"
                      size="icon"
                      className="size-7"
                    >
                      <PlusIcon aria-hidden />
                    </Button>
                  </TooltipTrigger>
                </Form>
                <TooltipContent>
                  <p>Add to shopping list</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
          <div className="space-y-1">
            <p className="truncate text-sm font-medium">
              <Link to={recipe.id} className="underline underline-offset-4">
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
                  <ClockIcon className="size-3.5 opacity-90" aria-hidden />
                  {`${recipe.cookingHours}h ${recipe.cookingMinutes}m`}
                </p>
                <p className="flex items-center gap-1 whitespace-nowrap">
                  <UsersIcon className="size-3.5 opacity-90" aria-hidden />
                  {recipe.servings}
                </p>
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
