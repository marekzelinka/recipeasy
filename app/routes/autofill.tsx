import { parseLink } from "~/lib/parse-link";
import type { Route } from "./+types/autofill";

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);

  const link = url.searchParams.get("link");
  if (!link) {
    return Response.json(
      { ok: false, error: "Invalid link" },
      {
        status: 400,
      },
    );
  }

  const linkResponse = await parseLink({ link });
  if (!linkResponse.ok) {
    return Response.json(linkResponse, {
      status: 400,
    });
  }

  return Response.json(linkResponse);
}
