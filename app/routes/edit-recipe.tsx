import { parseWithZod } from "@conform-to/zod";
import { ChevronLeftIcon, TrashIcon } from "lucide-react";
import { data, Form, Link, redirect, useNavigation } from "react-router";
import { RecipeForm } from "~/components/recipe-form";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { requireAuthSession } from "~/lib/auth.server";
import { prisma } from "~/lib/db.server";
import { parseRecipe, RecipeSchema } from "~/lib/recipe";
import type { Route } from "./+types/edit-recipe";

export const meta: Route.MetaFunction = ({ error }) => [
  { title: error ? "No recipe found" : "Edit recipe" },
];

export async function loader({ request, params }: Route.LoaderArgs) {
  const session = await requireAuthSession(request);

  const recipe = await prisma.recipe.findUnique({
    select: {
      link: true,
      title: true,
      author: true,
      image: true,
      favicon: true,
      ingredients: true,
      servings: true,
      cookingHours: true,
      cookingMinutes: true,
    },
    where: { id: params.recipeId, userId: session.user.id },
  });
  if (!recipe) {
    throw data("No recipe found", { status: 404 });
  }

  return { recipe };
}

export async function action({ request, params }: Route.ActionArgs) {
  const session = await requireAuthSession(request);

  const recipe = await prisma.recipe.findUnique({
    select: {
      id: true,
      link: true,
    },
    where: { id: params.recipeId, userId: session.user.id },
  });
  if (!recipe) {
    throw data("No recipe found", { status: 404 });
  }

  const formData = await request.formData();

  const submission = await parseWithZod(formData, {
    schema: RecipeSchema.transform(async (arg) => {
      const shouldUpdateRecipe = arg.link !== recipe.link;
      if (shouldUpdateRecipe) {
        const updates = await parseRecipe(arg.link);

        return { ...arg, ...updates };
      } else {
        return arg;
      }
    }),
    async: true,
  });
  if (submission.status !== "success") {
    return data(
      { lastResult: submission.reply() },
      { status: submission.status === "error" ? 400 : 200 },
    );
  }

  const recipeObject = submission.value;

  await prisma.recipe.update({
    select: { id: true },
    data: recipeObject,
    where: { id: recipe.id },
  });

  throw redirect("/recipes");
}

export default function EditRecipe({
  loaderData,
  actionData,
  params,
}: Route.ComponentProps) {
  const { recipe } = loaderData;

  const navigation = useNavigation();
  const isSubmitting =
    navigation.formAction === `/recipes/${params.recipeId}/edit`;

  return (
    <div className="mx-auto max-w-md space-y-2">
      <nav aria-label="Primary" className="flex items-center justify-between">
        <Button asChild variant="secondary" size="sm">
          <Link to="/recipes">
            <ChevronLeftIcon aria-hidden />
            Go back
          </Link>
        </Button>
      </nav>
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle asChild className="text-xl">
            <h1>Edit Recipe</h1>
          </CardTitle>
          <Form method="post" action={`/recipes/${params.recipeId}/destroy`}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={(event) => {
                    const shouldDelete = confirm("Are you sure?");
                    if (!shouldDelete) {
                      event.preventDefault();
                    }
                  }}
                  className="size-8"
                >
                  <TrashIcon aria-hidden />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete recipe</p>
              </TooltipContent>
            </Tooltip>
          </Form>
        </CardHeader>
        <CardContent>
          <RecipeForm
            lastResult={actionData?.lastResult}
            recipe={recipe}
            loading={isSubmitting}
          />
        </CardContent>
      </Card>
    </div>
  );
}
