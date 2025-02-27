import {
  getFormProps,
  getInputProps,
  getTextareaProps,
  useForm,
  type SubmissionResult,
} from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import type { Recipe } from "@prisma/client";
import { useEffect, useState } from "react";
import { Form, useFetcher } from "react-router";
import { ErrorList } from "~/components/error-list";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { type ParseLinkData } from "~/lib/parse-link";
import { RecipeSchema } from "~/lib/recipe";

type DefaultRecipeValues = Pick<
  Recipe,
  | "link"
  | "title"
  | "author"
  | "image"
  | "favicon"
  | "ingredients"
  | "servings"
  | "cookingHours"
  | "cookingMinutes"
>;

export function RecipeForm({
  lastResult,
  loading,
  recipe,
}: {
  lastResult: SubmissionResult | undefined;
  loading?: boolean;
  recipe?: DefaultRecipeValues;
}) {
  const editing = recipe !== undefined;

  const [form, fields] = useForm({
    defaultValue: { ...recipe },
    lastResult,
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
          <ErrorList id={fields.link.errorId} errors={fields.link.errors} />
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
          <ErrorList id={fields.title.errorId} errors={fields.title.errors} />
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
          <ErrorList id={fields.author.errorId} errors={fields.author.errors} />
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
                  <Label htmlFor={fields.cookingHours.id} className="sr-only">
                    Cooking hours
                  </Label>
                  <Input
                    className="w-14"
                    {...getInputProps(fields.cookingHours, {
                      type: "number",
                    })}
                  />
                  <span aria-hidden className="text-sm text-muted-foreground">
                    hrs
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor={fields.cookingMinutes.id} className="sr-only">
                    Cooking minutes
                  </Label>
                  <Input
                    step={5}
                    className="w-14"
                    {...getInputProps(fields.cookingMinutes, {
                      type: "number",
                    })}
                  />
                  <span aria-hidden className="text-sm text-muted-foreground">
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
          <Button type="submit" disabled={loading}>
            {loading
              ? editing
                ? "Saving changes…"
                : "Adding…"
              : editing
                ? "Save changes"
                : "Add recipe"}
          </Button>
        </div>
      </div>
    </Form>
  );
}
