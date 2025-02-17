import { CookingPotIcon, ShoppingBasket } from "lucide-react";
import type { JSX } from "react";
import { NavLink, Outlet, useMatch } from "react-router";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "~/components/ui/sidebar";
import { prisma } from "~/lib/db.server";
import { requireAuthSession } from "~/lib/session.server";
import { formatUserShoppingList } from "~/lib/shopping-list";
import type { Route } from "./+types/sidebar";

export async function loader({ request }: Route.LoaderArgs) {
  const session = await requireAuthSession(request);

  const user = await prisma.user.findUniqueOrThrow({
    select: { shoppingList: true },
    where: { id: session.user.id },
  });
  const shoppingList = formatUserShoppingList(user.shoppingList);

  return { shoppingList };
}

export default function SidebarLayout({ loaderData }: Route.ComponentProps) {
  const { shoppingList } = loaderData;

  return (
    <SidebarProvider>
      <AppSidebar shoppingListCount={shoppingList.length} />
      <SidebarInset>
        <header className="sticky top-0 flex h-14 shrink-0 items-center gap-2 bg-background">
          <div className="flex flex-1 items-center gap-2 px-3">
            <SidebarTrigger />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="mx-auto w-full max-w-3xl flex-1">
            <Outlet />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

function AppSidebar({ shoppingListCount }: { shoppingListCount: number }) {
  const items = [
    {
      title: "Recipes",
      url: "/recipes",
      icon: CookingPotIcon,
    },
    {
      title: "Shopping List",
      url: "/recipes/shopping-list",
      icon: ShoppingBasket,
      badge: shoppingListCount,
    },
  ];

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButtonNavLink {...item} />
                  {item.badge ? (
                    <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
                  ) : null}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

function SidebarMenuButtonNavLink({
  title,
  url,
  icon: Icon,
}: {
  title: string;
  url: string;
  icon: JSX.ElementType;
}) {
  const match = useMatch(url);
  const isActive = Boolean(match);

  return (
    <SidebarMenuButton asChild isActive={isActive}>
      <NavLink to={url}>
        <Icon aria-hidden />
        <span>{title}</span>
      </NavLink>
    </SidebarMenuButton>
  );
}
