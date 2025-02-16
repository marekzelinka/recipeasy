import { LoaderIcon } from "lucide-react";
import { useState } from "react";
import { Form } from "react-router";
import { toast } from "sonner";
import { authClient } from "~/lib/auth.client";
import { envClient } from "~/lib/env.client";
import { GoogleIcon } from "../icons/google-icon";
import { Button } from "../ui/button";

export function LoginForm() {
  return (
    <Form method="POST">
      <div className="grid gap-4">
        <SignInWithGoogleButton />
      </div>
    </Form>
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
            <GoogleIcon aria-hidden />
          </div>
          Continue with Google
        </>
      )}
    </Button>
  );
}
