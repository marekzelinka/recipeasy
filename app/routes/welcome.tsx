import { ChefHatIcon, LoaderIcon } from "lucide-react";
import { useState } from "react";
import { Form, Link, redirect } from "react-router";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { authClient } from "~/lib/auth";
import { envClient } from "~/lib/env";
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
          <Form method="POST">
            <div className="grid gap-4">
              <SignInWithGoogleButton />
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

function SignInWithGoogleButton() {
  const [isPending, setIsPending] = useState(false);

  return (
    <Button
      type="button"
      disabled={isPending}
      onClick={async () => {
        setIsPending(true);

        toast.promise(
          authClient.signIn.social({
            provider: "google",
            callbackURL: envClient.VITE_BETTER_AUTH_CALLBACK_URL,
            fetchOptions: {
              onError: () => setIsPending(false),
            },
          }),
          {
            loading: "Redirecting…",
            success: "Redirected successfully!",
            error: "Login redirect failed",
          },
        );
      }}
      className="relative w-full"
    >
      {isPending ? (
        <>
          <div className="absolute inset-y-0 left-4 flex items-center">
            <LoaderIcon aria-hidden className="animate-spin" />
          </div>
          Redirecting...
        </>
      ) : (
        <>
          <div className="absolute inset-y-0 left-4 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <path
                d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                fill="currentColor"
              />
            </svg>
          </div>
          Continue with Google
        </>
      )}
    </Button>
  );
}
