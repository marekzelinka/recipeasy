import type { ComponentProps } from "react";
import { cn } from "~/lib/utils";

export type ListOfErrors = Array<string | null | undefined> | null | undefined;

export function ErrorList({
  id,
  errors,
  className,
  ...props
}: {
  id: string;
  errors?: ListOfErrors;
} & ComponentProps<"ul">) {
  const errorsToRender = errors?.filter(Boolean);
  if (!errorsToRender?.length) {
    return null;
  }

  return (
    <ul
      role="list"
      id={id}
      className={cn("text-destructive grid gap-0.5 text-xs", className)}
      {...props}
    >
      {errorsToRender.map((error, i) => (
        <li key={i}>{error}</li>
      ))}
    </ul>
  );
}
