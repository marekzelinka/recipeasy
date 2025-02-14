import { auth } from "./auth.server";

export async function getAuthSession(request: Request) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  return session;
}
