import { type ReactNode } from "react";

export function EmptyState({
  icon,
  title = "No data",
  description,
  children,
}: {
  icon?: ReactNode;
  title?: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <div className="w-full px-6 py-8">
      <div className="flex flex-col items-center justify-center gap-4">
        {icon ? (
          <div className="text-muted-foreground flex items-center justify-center text-4xl">
            {icon}
          </div>
        ) : null}
        <div className="flex flex-col gap-0.5 text-center">
          <h3 className="font-semibold">{title}</h3>
          {description ? (
            <p className="text-muted-foreground text-sm">{description}</p>
          ) : null}
        </div>
        {children}
      </div>
    </div>
  );
}
