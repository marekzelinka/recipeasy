import type { Recipe } from "@prisma/client";
import { ClockIcon, UsersIcon } from "lucide-react";
import { Link } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export function RecipeList({ recipes }: { recipes: Recipe[] }) {
  return (
    <ul role="list" className="grid grid-cols-2 gap-4 md:grid-cols-3">
      {recipes.map((recipe) => (
        <Card key={recipe.id} className="group relative hover:shadow-md">
          <div className="overflow-hidden">
            <img
              src={recipe.image}
              alt=""
              className="aspect-4/3 size-full object-cover transition-[scale] group-hover:scale-105"
            />
          </div>
          <CardHeader className="p-3 pb-0">
            <CardTitle className="truncate text-sm">
              <Link to={recipe.id}>
                <span className="absolute inset-x-0 -top-px bottom-0" />
                {recipe.title}
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-1">
            <div className="text-muted-foreground flex justify-between text-xs/5">
              <p className="flex items-center gap-1 whitespace-nowrap">
                <img src={recipe.favicon} alt="" className="size-4" />
                {recipe.author}
              </p>
              <div className="flex gap-2">
                <p className="flex items-center gap-1 whitespace-nowrap">
                  <ClockIcon className="size-4" aria-hidden />
                  {`${recipe.cookingHours}h ${recipe.cookingMinutes}m`}
                </p>
                <p className="flex items-center gap-1 whitespace-nowrap">
                  <UsersIcon className="size-4" aria-hidden />
                  {recipe.servings}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </ul>
  );
}
