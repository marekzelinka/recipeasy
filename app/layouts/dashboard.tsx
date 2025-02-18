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
import { UserDropdown } from "~/components/user-dropdown";
import { requireAuthSession } from "~/lib/auth.server";
import { prisma } from "~/lib/db.server";
import { formatShoppingList } from "~/lib/recipe";
import type { Route } from "./+types/dashboard";

export async function loader({ request }: Route.LoaderArgs) {
  const session = await requireAuthSession(request);

  const user = await prisma.user.findUniqueOrThrow({
    select: { shoppingList: true },
    where: { id: session.user.id },
  });
  const shoppingList = formatShoppingList(user.shoppingList);

  return { shoppingList };
}

export default function DashboardLayout({ loaderData }: Route.ComponentProps) {
  const { shoppingList } = loaderData;

  return (
    <SidebarProvider>
      <AppSidebar shoppingListCount={shoppingList.length} />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2">
          <div className="flex flex-1 items-center gap-2 px-3">
            <SidebarTrigger />
          </div>
          <div className="ml-auto px-3">
            <UserDropdown />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 px-4 py-10">
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
      <NavLink to={url} prefetch="intent">
        <Icon aria-hidden /> {title}
      </NavLink>
    </SidebarMenuButton>
  );
}
