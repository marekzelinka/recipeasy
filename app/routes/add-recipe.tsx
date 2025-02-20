import {
  getFormProps,
  getInputProps,
  getTextareaProps,
  useForm,
} from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import { ChevronLeftIcon } from "lucide-react";
import { useEffect, useState } from "react";
import {
  data,
  Form,
  Link,
  redirect,
  useFetcher,
  useNavigation,
} from "react-router";
import { ErrorList } from "~/components/error-list";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { requireAuthSession } from "~/lib/auth.server";
import { prisma } from "~/lib/db.server";
import { type ParseLinkData } from "~/lib/parse-link";
import { RecipeSchema } from "~/lib/recipe";
import type { Route } from "./+types/add-recipe";

export const meta: Route.MetaFunction = () => [{ title: "Add recipe" }];

export async function action({ request }: Route.ActionArgs) {
  const session = await requireAuthSession(request);

  const formData = await request.formData();

  const submission = parseWithZod(formData, { schema: RecipeSchema });
  if (submission.status !== "success") {
    return data(
      { lastResult: submission.reply() },
      { status: submission.status === "error" ? 400 : 200 },
    );
  }

  const recipeObject = submission.value;

  await prisma.recipe.create({
    data: {
      ...recipeObject,
      user: { connect: { id: session.user.id } },
    },
  });

  throw redirect("/recipes");
}

export default function AddRecipe({ actionData }: Route.ComponentProps) {
  const navigation = useNavigation();
  const isSubmitting = navigation.formAction === "/recipes/new";

  const [form, fields] = useForm({
    lastResult: actionData?.lastResult,
    constraint: getZodConstraint(RecipeSchema),
    onValidate: ({ formData }) =>
      parseWithZod(formData, { schema: RecipeSchema }),
  });

  const autoFillFetcher = useFetcher<ParseLinkData>();
  const [controlledFields, setControlledFields] = useState({
    title: fields.title.initialValue,
    author: fields.author.initialValue,
    image: fields.image.initialValue,
    favicon: fields.favicon.initialValue,
  });

  useEffect(() => {
    if (fields.link.dirty && autoFillFetcher.data?.ok) {
      const { title, author, image, favicon } = autoFillFetcher.data.data;
      setControlledFields({ title, author, image, favicon });
    }
  }, [fields.link.dirty, autoFillFetcher.data]);

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
        <CardHeader>
          <CardTitle asChild className="text-xl">
            <h1>Add a Recipe</h1>
          </CardTitle>
          <CardDescription>
            We recommend adding a{" "}
            <span className="font-semibold text-foreground">link</span> first so
            we can auto-fill some fields for you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form method="post" {...getFormProps(form)}>
            <input
              value={controlledFields.image}
              onChange={(event) =>
                setControlledFields((controlledFields) => ({
                  ...controlledFields,
                  image: event.target.value,
                }))
              }
              {...getInputProps(fields.image, { type: "hidden" })}
            />
            <input
              value={controlledFields.favicon}
              onChange={(event) =>
                setControlledFields((controlledFields) => ({
                  ...controlledFields,
                  favicon: event.target.value,
                }))
              }
              {...getInputProps(fields.favicon, { type: "hidden" })}
            />
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor={fields.link.id}>Link</Label>
                <Input
                  onChange={(event) => {
                    autoFillFetcher.submit(
                      { link: event.target.value ?? "" },
                      {
                        method: "get",
                        action: "/api/autofill",
                      },
                    );
                  }}
                  {...getInputProps(fields.link, { type: "url" })}
                />
                <ErrorList
                  id={fields.link.errorId}
                  errors={fields.link.errors}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor={fields.title.id}>Title</Label>
                <Input
                  value={controlledFields.title}
                  onChange={(event) =>
                    setControlledFields((controlledFields) => ({
                      ...controlledFields,
                      title: event.target.value,
                    }))
                  }
                  {...getInputProps(fields.title, { type: "text" })}
                />
                <ErrorList
                  id={fields.title.errorId}
                  errors={fields.title.errors}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor={fields.author.id}>Author</Label>
                <Input
                  value={controlledFields.author}
                  onChange={(event) =>
                    setControlledFields((controlledFields) => ({
                      ...controlledFields,
                      author: event.target.value,
                    }))
                  }
                  {...getInputProps(fields.author, { type: "text" })}
                />
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
                  {isSubmitting ? "Adding…" : "Add recipe"}
                </Button>
              </div>
            </div>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
