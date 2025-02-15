import { redirect } from "react-router";
import { auth } from "./auth.server";

export async function getAuthSession(request: Request) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  return session;
}

export async function requireAuthSession(request: Request) {
  const session = await getAuthSession(request);
  if (!session) {
    throw redirect("/");
  }

  return session;
}
