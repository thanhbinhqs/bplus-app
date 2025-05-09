import { Outlet, redirect } from "react-router-dom";
import AppSidebar from "~/components/app/common/app-sidebar";
import SiteHeader from "~/components/app/common/site-header";
import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar";

import type { LoaderFunctionArgs } from "@remix-run/node";
import { apiRequest } from "~/lib/api-request";
import { MenuItem } from "~/lib/interfaces/menu-item";
import { useLoaderData } from "@remix-run/react";

export async function loader({ request }: LoaderFunctionArgs) {
  const pathname = new URL(request.url).pathname.split("/");
  //remove fist part of pathname by /
  const returnUrl = "/" + pathname.slice(2, pathname.length).join("/");
  const userRes = await apiRequest(request, "/user/me");
  const menuRes = await apiRequest(request, "/menu");
  if (!userRes?.success || !menuRes?.success) {
    return redirect("/auth/login?returnUrl=" + returnUrl);
  }
  const menu: MenuItem[] = menuRes.data || [];

  const checkMenu = menu.flatMap((item) => {
    return [item, ...(item.children || [])];
  });

  if (
    !checkMenu.some((item) => item.path.startsWith(returnUrl)) &&
    returnUrl != "/forbidden" &&
    returnUrl != "/dashboard/profile" &&
    returnUrl != "/dashboard/change-password"
  ) {
    return redirect("/forbidden", {
      headers: {
        "Set-Cookie": [
          `returnUrl=${returnUrl};path=/;`,
          `code=403;path=/;`,
        ].join(", "),
      },
    });
  }

  //pagename is second part of pathname
  const pageName = pathname[2] || "Home";

  const capitalizedPageName = pageName
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return {
    user: userRes.data,
    menu: menuRes.data,
    pageName: capitalizedPageName,
  };
}

export default function AuthLayout() {
  const { pageName } = useLoaderData<typeof loader>();
  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "12rem",
        "--sidebar-width-mobile": "20rem",
      }}
      className="app-sidebar"
    >
      <AppSidebar variant="offcanvas" id="app-sidebar" />
      <SidebarInset>
        <div className="flex flex-col justify-center items-center">
          <SiteHeader pageName={pageName} />

          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
