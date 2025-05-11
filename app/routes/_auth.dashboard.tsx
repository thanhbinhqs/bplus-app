import { type LoaderFunctionArgs } from "@remix-run/node";
import { Outlet, useOutletContext } from "@remix-run/react";

export async function loader({ request }: LoaderFunctionArgs) {
  //get page name from first part of pathname
  const url = new URL(request.url);
  const pathname = url.pathname;

  //pagename is second part of pathname
  const pageName = pathname.split("/")[2] || "Home";

  const capitalizedPageName = pageName
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
  return {
    pageName: capitalizedPageName,
  };
}

export default function DashboardPage() {
  return <Outlet />;
}
