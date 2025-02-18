import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { redirect } from "react-router";
import { prisma } from "./db.server";
import { env } from "./env.server";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "sqlite",
  }),
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // Cache duration in seconds
    },
  },
  trustedOrigins: [env.BETTER_AUTH_URL],
  socialProviders: {
    google: {
      prompt: "select_account",
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
  },
});

export async function getAuthSession(request: Request) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  return session;
}

export async function requireAuthSession(request: Request, redirectTo = "/") {
  const session = await getAuthSession(request);
  if (!session) {
    throw redirect(redirectTo);
  }

  return session;
}
