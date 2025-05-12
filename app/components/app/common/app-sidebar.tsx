/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link } from "@remix-run/react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  SidebarRail,
} from "../../ui/sidebar";
import MainNavbar from "./main-navbar";
import NavUser from "./nav-user";

export default function AppSidebar({ ...props }) {
  // const data = useRouteLoaderData("routes/_auth");
  // const [userRes, menuRes] = Array.isArray(data) ? data : [null, null];
  // const user = userRes?.data;
  // const menu = menuRes?.data;

  // if (!user || !menu) return null;
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <img src="/images/plus.png" alt="Logo" className="size-4" />
          </div>
          <Link to="/" className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">Bplus</span>
            <span className="truncate text-xs">Go to future</span>
          </Link>
        </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent>
        <MainNavbar />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
