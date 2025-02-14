import { LoaderIcon } from "lucide-react";
import { useTransition } from "react";
import { Form } from "react-router";
import { authClient } from "~/lib/auth.client";
import { envClient } from "~/lib/env.client";
import { ColorGoogleIcon } from "./icons/color-google-icon";
import { Button } from "./ui/button";

export function LoginForm() {
  return (
    <Form>
      <div className="grid gap-4">
        <SignInWithGoogleButton />
      </div>
    </Form>
  );
}

function SignInWithGoogleButton() {
  const [isPending, startTransition] = useTransition();

  function signInWithGoogle() {
    startTransition(async () => {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: envClient.VITE_BETTER_AUTH_CALLBACK_URL,
      });
    });
  }

  return (
    <Button
      type="button"
      disabled={isPending}
      onClick={signInWithGoogle}
      className="relative w-full"
    >
      {isPending ? (
        <>
          <div className="absolute inset-y-0 left-4 flex items-center">
            <LoaderIcon className="animate-spin" />
          </div>
          Redirecting...
        </>
      ) : (
        <>
          <div className="absolute inset-y-0 left-4 flex items-center">
            <ColorGoogleIcon />
          </div>
          Continue with Google
        </>
      )}
    </Button>
  );
}
