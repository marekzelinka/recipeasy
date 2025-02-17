import {
  getFormProps,
  getInputProps,
  getTextareaProps,
  useForm,
} from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import { data, Form, redirect, useNavigation } from "react-router";
import urlMetadata from "url-metadata";
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
import { prisma } from "~/lib/db.server";
import { CreateRecipeSchema } from "~/lib/recipes";
import { requireAuthSession } from "~/lib/session.server";
import type { Route } from "./+types/add-recipe";

export async function action({ request }: Route.ActionArgs) {
  const session = await requireAuthSession(request);

  const formData = await request.formData();

  const submission = await parseWithZod(formData, {
    schema: CreateRecipeSchema.transform(async (arg) => {
      const metadata = await urlMetadata(arg.link);
      console.log(metadata);

      const metadataImage = metadata.image as string;
      const metadataOgImage = metadata["og:image"] as string;
      const image = metadataImage || metadataOgImage;

      const linkOrigin = new URL(arg.link).origin;

      const defaultFaviconUrl = `${linkOrigin}/favicon.ico`;
      const metadataFavicons = metadata.favicons as {
        rel: string;
        href: string;
      }[];
      const faviconIcon = metadataFavicons.find(
        (favicon) => favicon.rel === "icon",
      );
      const faviconIconUrl = faviconIcon?.href
        ? linkOrigin + faviconIcon.href
        : "";
      const favicon = faviconIconUrl || defaultFaviconUrl;

      return { ...arg, image, favicon };
    }),
    async: true,
  });
  if (submission.status !== "success") {
    return data(
      { lastResult: submission.reply() },
      { status: submission.status === "error" ? 400 : 200 },
    );
  }

  const {
    link,
    title,
    author,
    image,
    favicon,
    ingredients,
    cookingHours,
    cookingMinutes,
    servings,
  } = submission.value;

  await prisma.recipe.create({
    data: {
      link,
      title,
      author,
      image,
      favicon,
      ingredients,
      servings,
      cookingHours,
      cookingMinutes,
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
    constraint: getZodConstraint(CreateRecipeSchema),
    onValidate: ({ formData }) =>
      parseWithZod(formData, { schema: CreateRecipeSchema }),
  });

  return (
    <Card className="mx-auto max-w-md">
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
        <Form method="POST" {...getFormProps(form)}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor={fields.link.id}>Link</Label>
              <Input {...getInputProps(fields.link, { type: "url" })} />
              <ErrorList id={fields.link.errorId} errors={fields.link.errors} />
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
                {isSubmitting ? "Adding…" : "Add recipe"}
              </Button>
            </div>
          </div>
        </Form>
      </CardContent>
    </Card>
  );
}
