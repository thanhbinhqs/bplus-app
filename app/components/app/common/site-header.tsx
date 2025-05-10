import { Separator } from "../../ui/separator";
import { SidebarTrigger } from "../../ui/sidebar";
// import { useRouteLoaderData } from "@remix-run/react";

export default function SiteHeader({
  pageName,
  onTriggerClick,
}: {
  pageName: string;
  onTriggerClick?: () => void;
}) {
  // const { pageName = "" } = useRouteLoaderData("routes/_auth.dashboard");
  return (
    <header className="w-full group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger
          className="-ml-1"
          id="sidebar-trigger"
          onClick={onTriggerClick}
        />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">{pageName}</h1>
      </div>
    </header>
  );
}
