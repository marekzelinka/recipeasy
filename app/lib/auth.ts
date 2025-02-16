import { createAuthClient } from "better-auth/react";
import { envClient } from "./env";

export const authClient = createAuthClient({
  baseURL: envClient.VITE_APP_URL,
});
