import { parseWithZod } from "@conform-to/zod";
import { ChevronLeftIcon } from "lucide-react";
import { data, Link, redirect, useNavigation } from "react-router";
import { RecipeForm } from "~/components/recipe-form";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { requireAuthSession } from "~/lib/auth.server";
import { prisma } from "~/lib/db.server";
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
          <RecipeForm
            lastResult={actionData?.lastResult}
            loading={isSubmitting}
          />
        </CardContent>
      </Card>
    </div>
  );
}
