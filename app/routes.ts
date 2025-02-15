import {
  index,
  layout,
  route,
  type RouteConfig,
} from "@react-router/dev/routes";

export default [
  index("routes/welcome.tsx"),
  layout("layouts/sidebar.tsx", [route("recipes", "routes/recipes.tsx")]),
  route("api/auth/*", "api/auth.tsx"),
] satisfies RouteConfig;
