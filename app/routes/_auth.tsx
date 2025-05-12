import { Outlet, redirect, useNavigation } from "react-router-dom";
import AppSidebar from "~/components/app/common/app-sidebar";
import SiteHeader from "~/components/app/common/site-header";
import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar";

import type { LoaderFunctionArgs } from "@remix-run/node";
import { apiRequest } from "~/lib/api-request";
import { MenuItem } from "~/lib/interfaces/menu-item";
import { useLoaderData } from "@remix-run/react";
import { ReactNode, useEffect } from "react";
import React from "react";
import Loading from "~/components/app/loading";

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
  const [isOpen, setIsOpen] = React.useState<boolean>(true);
  const [sideHeaderContent, setSideHeaderContent] = React.useState<ReactNode>(
    <></>
  );
  const navigation = useNavigation();

  useEffect(() => {
    onTriggerClickHandler();
  }, []);

  const onTriggerClickHandler = () => {
    const container = document.querySelector("#auth-container");
    if (isOpen) {
      container?.classList.add("w-[calc(100vw-192px)]");
      container?.classList.remove("w-[calc(100vw-48px)]");
    } else {
      container?.classList.add("w-[calc(100vw-48px)]");
      container?.classList.remove("w-[calc(100vw-192px)]");
    }
    setIsOpen(!isOpen);
  };

  return (
    <>
      {navigation.state === "loading" && <Loading />}
      <SidebarProvider
        style={{
          "--sidebar-width": "12rem",
          "--sidebar-width-mobile": "20rem",
        }}
        className="app-sidebar"
      >
        <AppSidebar variant="offcanvas" id="app-sidebar" />
        <SidebarInset>
          <div className="flex flex-col justify-start items-center h-full">
            <SiteHeader
              pageName={pageName}
              onTriggerClick={onTriggerClickHandler}
              content={sideHeaderContent}
            />
            <div className="flex-1 w-full border overflow-hidden ">
              <div
                className="max-w-full !overflow-y-visible w-[calc(100vw-192px)] max-h-[calc(100vh-64px)] mx-auto"
                id="auth-container"
              >
                <Outlet />
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
