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
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "~/components/ui/sidebar";

export default function SidebarLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="bg-background sticky top-0 flex h-14 shrink-0 items-center gap-2">
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

const menuItems = [
  {
    title: "Recipes",
    url: "/recipes",
    icon: CookingPotIcon,
  },
  {
    title: "Shopping List",
    url: "/shopping-list",
    icon: ShoppingBasket,
  },
];

function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButtonNavLink {...item} />
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
