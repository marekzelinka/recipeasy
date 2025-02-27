import { ChefHatIcon, CookingPotIcon, LoaderIcon } from "lucide-react";
import { useState } from "react";
import { href, Link } from "react-router";
import { toast } from "sonner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { useOptionalUser } from "~/hooks/use-user";
import { authClient } from "~/lib/auth";
import type { Route } from "./+types/welcome";

export const meta: Route.MetaFunction = () => [{ title: "Recipeasy" }];

export default function Welcome() {
  const user = useOptionalUser();

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-2">
        <div className="flex flex-col items-center gap-2 font-medium">
          <div className="flex size-8 items-center justify-center rounded-md">
            <ChefHatIcon aria-hidden className="size-6" />
          </div>
          <span className="sr-only">Recipeasy</span>
        </div>
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Welcome to Recipeasy</CardTitle>
              <CardDescription>
                A better way to collect all of your favourite recipes and easily
                prepare your shopping list.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {user ? (
                <Button type="button" asChild className="relative w-full">
                  <Link to={href("/recipes")}>
                    <div className="absolute inset-y-0 left-4 flex items-center">
                      <CookingPotIcon aria-hidden />
                    </div>
                    View your recipes
                  </Link>
                </Button>
              ) : (
                <SignInWithGoogleButton />
              )}
            </CardContent>
          </Card>
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>Privacy Notice</AccordionTrigger>
              <AccordionContent>
                We won't use your email address for anything other than
                authenticating with this demo application.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Terms of Service</AccordionTrigger>
              <AccordionContent>
                This is a portfolio project, there are no terms of service.
                Don't be surprised if your data dissappears.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
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
            callbackURL: "/recipes",
            fetchOptions: {
              onError: () => setIsPending(false),
            },
          }),
          {
            loading: "Redirecting…",
            success: "You are being redirected…",
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
