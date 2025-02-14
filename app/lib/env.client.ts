import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const envClient = createEnv({
  clientPrefix: "VITE_",
  client: {
    VITE_APP_URL: z.string().min(1),
    VITE_BETTER_AUTH_CALLBACK_URL: z.string().min(1),
  },
  runtimeEnv: import.meta.env,
});
