import { AddRecipeButton } from "~/components/recipes/add-recipe-button";
import { UserDropdown } from "~/components/user/user-dropdown";

export default function Recipes() {
  return (
    <div className="space-y-8">
      <nav aria-label="Primary" className="flex items-center justify-between">
        <AddRecipeButton />
        <UserDropdown />
      </nav>
      <section className="space-y-4">
        <h1 className="text-2xl font-bold tracking-tight">Your recipes</h1>
      </section>
    </div>
  );
}
