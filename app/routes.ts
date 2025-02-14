import { index, route, type RouteConfig } from "@react-router/dev/routes";

export default [
  index("routes/welcome.tsx"),
  route("api/auth/*", "api/auth.tsx"),
] satisfies RouteConfig;
