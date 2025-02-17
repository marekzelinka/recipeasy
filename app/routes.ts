import {
  index,
  layout,
  prefix,
  route,
  type RouteConfig,
} from "@react-router/dev/routes";

export default [
  index("routes/welcome.tsx"),
  layout("layouts/sidebar.tsx", [
    ...prefix("recipes", [
      index("routes/recipes.tsx"),
      route("new", "routes/add-recipe.tsx"),
      route("shopping-list", "routes/shopping-list.tsx"),
    ]),
  ]),
  ...prefix("api", [
    route("shopping-list/clear", "resources/clear-shopping-list.tsx"),
    route(
      "shopping-list/update/:recipeId",
      "resources/update-shopping-list.tsx",
    ),
    route("auth/*", "resources/auth.tsx"),
  ]),
] satisfies RouteConfig;
