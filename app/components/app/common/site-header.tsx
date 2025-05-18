/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMatches, useNavigate } from "@remix-run/react";
import { Separator } from "../../ui/separator";
import { SidebarTrigger } from "../../ui/sidebar";
import React from "react";
import { PaginationComponent } from "./header-paginator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
// import { useRouteLoaderData } from "@remix-run/react";

export default function SiteHeader({
  onTriggerClick,
}: {
  pageName: string;
  onTriggerClick?: () => void;
  content?: React.ReactNode;
}) {
  const navigate = useNavigate();
  // const { pageName = "" } = useRouteLoaderData("routes/_auth.dashboard");
  const matches = useMatches();
  // Lấy handle từ route hiện tại
  // const headerContent: HeaderContentProps = matches
  //   .filter((match: any) => match?.handle?.headerContent)
  //   .map((match: any) => match?.handle?.headerContent)[0];

  // Lấy dữ liệu pagination từ loader của route con
  const paginationData = (
    matches.find((match: any) => match.data?.pagination)?.data as any
  )?.pagination;

  const siteHeader = (
    matches.find((match: any) => match.data?.siteHeader)?.data as any
  )?.siteHeader;

  const createContent = () => {
    if (!paginationData) return null;
    const { page, total, limit, limitOptions } = paginationData;

    const handleSizeChange = (newSize: number) => {
      navigate(`?page=${1}&limit=${newSize}`, {});
    };
    return (
      <div className="flex items-center gap-2">
        <p className="text-gray-400">
          {(page - 1) * limit + 1}-
          {page * limit <= total ? page * limit : total}/{total}
        </p>
        <PaginationComponent page={page} total={total} limit={limit} />
        <Select onValueChange={(size: any) => handleSizeChange(size)}>
          <SelectTrigger className="w-[80px]">
            <SelectValue placeholder={limit} />
          </SelectTrigger>
          <SelectContent className="w-[80px]">
            {limitOptions.map((limit: any) => (
              <SelectItem key={limit} value={limit}>
                {limit}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  };

  return (
    <header className="w-full group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
      <div className="flex w-full justify-start items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger
          className="-ml-1"
          id="sidebar-trigger"
          onClick={onTriggerClick}
        />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        {siteHeader?.title && (
          <h1 className="text-base font-medium">{siteHeader?.title}</h1>
        )}
        {siteHeader?.content && (
          <div className="flex items-center gap-2">{siteHeader?.content}</div>
        )}
        <div className="flex-1"></div>
        {createContent()}
      </div>
    </header>
  );
}
