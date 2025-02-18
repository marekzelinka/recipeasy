import {
  getFormProps,
  getInputProps,
  getTextareaProps,
  useForm,
} from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import { ChevronLeftIcon, TrashIcon } from "lucide-react";
import { data, Form, Link, redirect, useNavigation } from "react-router";
import { ErrorList } from "~/components/error-list";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
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
      id: true,
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
}: Route.ComponentProps) {
  const { recipe } = loaderData;

  const navigation = useNavigation();
  const isSubmitting = navigation.formAction === `/recipes/${recipe.id}/edit`;

  const [form, fields] = useForm({
    defaultValue: recipe,
    lastResult: actionData?.lastResult,
    constraint: getZodConstraint(RecipeSchema),
    onValidate: ({ formData }) =>
      parseWithZod(formData, { schema: RecipeSchema }),
  });

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
          <Form method="post" action={`/recipes/${recipe.id}/destroy`}>
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
          <Form method="post" {...getFormProps(form)}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor={fields.link.id}>Link</Label>
                <Input {...getInputProps(fields.link, { type: "url" })} />
                <ErrorList
                  id={fields.link.errorId}
                  errors={fields.link.errors}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor={fields.title.id}>Title</Label>
                <Input {...getInputProps(fields.title, { type: "text" })} />
                <ErrorList
                  id={fields.title.errorId}
                  errors={fields.title.errors}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor={fields.author.id}>Author</Label>
                <Input {...getInputProps(fields.author, { type: "text" })} />
                <ErrorList
                  id={fields.author.errorId}
                  errors={fields.author.errors}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor={fields.ingredients.id}>Ingredients</Label>
                <Textarea
                  rows={4}
                  className="field-sizing-fixed resize-none"
                  {...getTextareaProps(fields.ingredients)}
                />
                <ErrorList
                  id={fields.ingredients.errorId}
                  errors={fields.ingredients.errors}
                />
              </div>
              <div className="grid grid-cols-2 items-start gap-4">
                <div className="grid gap-2">
                  <Label htmlFor={fields.servings.id} aria-label="Servings">
                    Serves
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      className="w-14"
                      {...getInputProps(fields.servings, { type: "number" })}
                    />
                    <span aria-hidden className="text-sm text-muted-foreground">
                      people
                    </span>
                  </div>
                  <ErrorList
                    id={fields.servings.errorId}
                    errors={fields.servings.errors}
                  />
                </div>
                <fieldset>
                  <div className="grid gap-2">
                    <Label asChild>
                      <legend>Cooking time</legend>
                    </Label>
                    <div className="flex gap-4">
                      <div className="flex items-center gap-2">
                        <Label
                          htmlFor={fields.cookingHours.id}
                          className="sr-only"
                        >
                          Cooking hours
                        </Label>
                        <Input
                          className="w-14"
                          {...getInputProps(fields.cookingHours, {
                            type: "number",
                          })}
                        />
                        <span
                          aria-hidden
                          className="text-sm text-muted-foreground"
                        >
                          hrs
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Label
                          htmlFor={fields.cookingMinutes.id}
                          className="sr-only"
                        >
                          Cooking minutes
                        </Label>
                        <Input
                          step={5}
                          className="w-14"
                          {...getInputProps(fields.cookingMinutes, {
                            type: "number",
                          })}
                        />
                        <span
                          aria-hidden
                          className="text-sm text-muted-foreground"
                        >
                          mins
                        </span>
                      </div>
                    </div>
                    <ErrorList
                      id={fields.cookingHours.errorId}
                      errors={fields.cookingHours.errors}
                    />
                    <ErrorList
                      id={fields.cookingMinutes.errorId}
                      errors={fields.cookingMinutes.errors}
                    />
                  </div>
                </fieldset>
              </div>
              <div className="flex justify-end">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving changes…" : "Save changes"}
                </Button>
              </div>
            </div>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
