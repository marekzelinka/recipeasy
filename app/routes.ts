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
      route(":recipeId/edit", "routes/edit-recipe.tsx"),
      route("shopping-list", "routes/shopping-list.tsx"),
    ]),
  ]),
  ...prefix("api", [
    route("destroy-recipe/:recipeId", "resources/destory-recipe.tsx"),
    route("clear-list", "resources/clear-list.tsx"),
    route("update-list/:recipeId", "resources/update-list.tsx"),
    route("auth/*", "resources/auth.tsx"),
  ]),
] satisfies RouteConfig;
