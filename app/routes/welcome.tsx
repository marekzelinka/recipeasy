import { ChefHatIcon } from "lucide-react";
import { Link, redirect } from "react-router";
import { LoginForm } from "~/components/login-form";
import { getAuthSession } from "~/lib/session.server";
import type { Route } from "./+types/welcome";

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getAuthSession(request);
  if (session) {
    throw redirect("/recipes");
  }

  return {};
}

export default function Welcome() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <Link
              to="/"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex size-8 items-center justify-center rounded-md">
                <ChefHatIcon className="size-6" />
              </div>
              <span className="sr-only">Recipeasy</span>
            </Link>
            <h1 className="text-xl font-bold">Welcome to Recipeasy</h1>
            <div className="text-center text-sm">
              A better way to collect all of your favourite recipes and easily
              prepare your shopping list.
            </div>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
