import { createAuthClient } from "better-auth/react";
import { envClient } from "./env.client";

export const authClient = createAuthClient({
  baseURL: envClient.VITE_APP_URL,
});

export const { signIn, signUp, signOut, useSession, getSession, $fetch } =
  authClient;
