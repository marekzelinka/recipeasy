import { PlusIcon } from "lucide-react";
import { Form } from "react-router";
import { Button } from "../ui/button";

export function AddRecipeButton() {
  return (
    <Form action="new">
      <Button type="submit" size="sm">
        <PlusIcon aria-hidden />
        Add Recipe
      </Button>
    </Form>
  );
}
