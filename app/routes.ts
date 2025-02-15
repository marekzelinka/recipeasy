import {
  index,
  layout,
  prefix,
  route,
  type RouteConfig,
} from "@react-router/dev/routes";

export default [
  index("routes/welcome.tsx"),
  layout("layouts/sidebar.tsx", [route("recipes", "routes/recipes.tsx")]),
  ...prefix("api", [
    route("shopping-list/update/:recipeId", "api/update-shopping-list.tsx"),
    route("auth/*", "api/auth.tsx"),
  ]),
] satisfies RouteConfig;
