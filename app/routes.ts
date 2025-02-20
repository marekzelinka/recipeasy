import {
  index,
  layout,
  prefix,
  route,
  type RouteConfig,
} from "@react-router/dev/routes";

export default [
  index("routes/welcome.tsx"),
  layout("layouts/dashboard.tsx", [
    ...prefix("recipes", [
      index("routes/recipes.tsx"),
      route("new", "routes/add-recipe.tsx"),
      ...prefix(":recipeId", [
        route("edit", "routes/edit-recipe.tsx"),
        route("destroy", "routes/destory-recipe.tsx"),
      ]),
      ...prefix("shopping-list", [
        index("routes/shopping-list.tsx"),
        route("clear", "routes/clear-shopping-list.tsx"),
        route("update/:recipeId", "routes/update-shopping-list.tsx"),
      ]),
    ]),
  ]),
  ...prefix("api", [
    route("autofill", "routes/autofill.tsx"),
    route("auth/*", "routes/auth.tsx"),
  ]),
] satisfies RouteConfig;
