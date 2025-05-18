/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  redirect,
  type LoaderFunctionArgs,
  ActionFunctionArgs,
} from "@remix-run/node";
import {
  data,
  Form,
  Outlet,
  useActionData,
  useLoaderData,
  useMatches,
  useSubmit,
} from "@remix-run/react";
import { ColumnDef } from "@tanstack/react-table";
import AppTable from "~/components/app/table";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { apiRequest } from "~/lib/api-request";
import { User } from "~/lib/interfaces/user";
import { IoIosArrowDropdown } from "react-icons/io";
import { useMemo } from "react";
import moment from "moment";
import { MenuItem } from "~/lib/interfaces/menu-item";

export async function loader({ request }: LoaderFunctionArgs) {
  const limitOptions = [50, 100, 200, 500];
  const url = new URL(request.url);

  const cookies = request.headers.get("cookie");
  const ck_pagination = JSON.parse(
    cookies
      ?.split(";")
      .find((cookie) => cookie.trim().startsWith("bp_pagination="))
      ?.split("=")[1] || "{}"
  );

  const page = url.searchParams.get("page") || ck_pagination.page || "1";
  let limit = url.searchParams.get("limit") || ck_pagination.limit || "50";
  const search = url.searchParams.get("search") || ""; //|| ck_pagination.search;

  if (limitOptions.indexOf(Number(limit)) === -1) limit = "50";

  const userRes = await apiRequest(
    request,
    `/user?page=${page}&limit=${limit}&search=${search}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!userRes?.success) {
    if (userRes.statusCode === 401) return redirect("/auth/login");
    if (userRes.statusCode === 403) return redirect("/forbidden");

    return {
      error: userRes.message,
      statusCode: userRes.statusCode,
    };
  }

  const pagination = {
    page: userRes.data?.page || Number(page),
    limit: userRes.data?.limit || Number(limit),
    total: userRes.data?.total || 0,
    limitOptions: limitOptions,
    search: search,
  };

  return data(
    {
      ...userRes.data,
      pagination: pagination,
      pageName: "Users",
      siteHeader: {
        title: "Users",
      },
    },
    {
      headers: {
        "Set-Cookie": [
          `bp_pagination=${JSON.stringify(pagination)}; path=/`,
        ].join(","),
      },
    }
  );
}

export async function action({ request }: ActionFunctionArgs) {
  const encType = request.headers.get("content-type");
  if (encType != "application/json") return {};

  const body = await request.json();

  const { action, id, pagination, search } = body;
  if (action == "search") {
    const searchValue = Object.values(search)[0] || "";

    return redirect(
      `/dashboard/users?page=1&limit=${pagination?.limit}&search=${searchValue}`,
      {
        headers: {
          "Set-Cookie": [
            `bp_pagination=${JSON.stringify({
              ...pagination,
              search: searchValue,
              page: 1,
            })}; path=/`,
          ].join(","),
        },
      }
    );
  } else
    return redirect(`/dashboard/users/${action}?id=${id}`, {
      headers: {
        "Set-Cookie": [
          `bp_pagination=${JSON.stringify(pagination)}; path=/`,
        ].join(","),
      },
    });

  return {};
}

export default function UserListingPage() {
  const { data = [], pagination } = useLoaderData<typeof loader>();
  const matches = useMatches();

  const menu = (matches.find((match: any) => match.data?.menu)?.data as any)
    ?.menu;

  const submit = useSubmit();

  const users = useMemo(() => {
    return data;
  }, [data]);

  const userCollums: ColumnDef<User>[] = [
    {
      id: "id",
      accessorKey: "id",
      header: () => (
        <div className="w-full flex items-center justify-center">No</div>
      ),
      size: 60,
      enableResizing: false,

      cell: ({ row }) => row.index + 1,
      meta: {
        sticky: "left",
        align: "center",
      },
    },
    {
      id: "action",
      header: () => (
        <div className="w-full flex items-center justify-center">Action</div>
      ),
      cell: ({ row }) => {
        const username = row.getValue("username");
        const active = row.getValue("active");
        const deleted: boolean = row.original.deleted;
        const id = row.getValue("id") as string;
        const actionMenu: MenuItem[] =
          menu?.filter(
            (item: MenuItem) =>
              item.subject == "USER" && item.type == "ACTION_MENU"
          ) || [];

        return (
          <div className="flex items-center justify-center cursor-pointer w-full h-full !m-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="link">
                  <IoIosArrowDropdown />
                </Button>
              </DropdownMenuTrigger>
              <Form>
                <DropdownMenuContent>
                  <DropdownMenuLabel className="text-center">
                    <span className="">{"Action > " + username}</span>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    {actionMenu
                      .filter(
                        (item: MenuItem) =>
                          item.slug != "delete" && item.slug != "rollback"
                      )
                      .map((item: MenuItem, index: number) => (
                        <DropdownMenuItem
                          key={`${item.slug}_${index}`}
                          className="cursor-pointer hover:!bg-gray-200"
                          onClick={() => actionHandler(item.slug, id)}
                        >
                          {item.title}
                        </DropdownMenuItem>
                      ))}
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  {actionMenu
                    .filter(
                      (item: MenuItem) =>
                        item.slug == "delete" || item.slug == "rollback"
                    )
                    .map((item: MenuItem, index: number) => {
                      if (!deleted && item.slug == "delete")
                        return (
                          <DropdownMenuItem
                            key={`${item.slug}`}
                            className="cursor-pointer hover:!bg-red-200"
                            onClick={() => actionHandler("delete", id)}
                          >
                            Delete
                          </DropdownMenuItem>
                        );
                      else if (deleted && item.slug == "rollback")
                        return (
                          <DropdownMenuItem
                            key={`${item.slug}`}
                            className="cursor-pointer hover:!bg-red-200"
                            onClick={() => actionHandler("rollback", id)}
                          >
                            Rollback
                          </DropdownMenuItem>
                        );
                    })}
                </DropdownMenuContent>
              </Form>
            </DropdownMenu>
          </div>
        );
      },
      size: 60,
      enableSorting: false,
      enableResizing: true,
      meta: { align: "center", ellipsis: false },
    },
    {
      id: "username",
      accessorKey: "username",
      header: () => (
        <div className="w-full flex items-center justify-center">Username</div>
      ),
      size: 200,
      enableResizing: true,
      meta: {
        sticky: "left",
        search: true,
      },
    },
    {
      accessorKey: "fullname",
      header: () => (
        <div className="w-full flex items-center justify-center">Fullname</div>
      ),
      size: 200,
      enableResizing: true,
      meta: {
        sticky: "left",
      },
    },
    {
      accessorKey: "email",
      header: () => (
        <div className="w-full flex items-center justify-center">Email</div>
      ),
      size: 150,
      enableResizing: true,
    },
    {
      accessorKey: "phone",
      header: () => (
        <div className="w-full flex items-center justify-center">Phone</div>
      ),
      size: 150,
      enableResizing: true,
    },

    {
      accessorKey: "gen",
      header: () => (
        <div className="w-full flex items-center justify-center">Gen</div>
      ),
      size: 100,
      enableResizing: true,
    },
    {
      accessorKey: "birthday",
      header: () => (
        <div className="w-full flex items-center justify-center">Birthday</div>
      ),
      size: 100,
      enableResizing: true,
    },
    {
      accessorKey: "address",
      header: () => (
        <div className="w-full flex items-center justify-center">Address</div>
      ),
      size: 150,
      enableResizing: true,
    },
    {
      id: "active",
      accessorKey: "active",
      size: 100,
      enableResizing: true,
      header: () => {
        return (
          <div className="w-full flex items-center justify-center">Active</div>
        );
      },
      cell: ({ row }) => {
        const active = row.getValue("active");
        return (
          <div className="w-full flex items-center justify-center">
            {active ? (
              <span className="text-green-500">Active</span>
            ) : (
              <span className="text-red-500">Deactive</span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: () => (
        <div className="w-full flex items-center justify-center">
          Created At
        </div>
      ),
      size: 200,
      enableResizing: true,
      cell: ({ row }) => {
        const createdAt = row.getValue("createdAt") as string;
        return (
          <div className="w-full flex items-center justify-center">
            {moment(createdAt).format("YYYY-MM-DD HH:mm:ss")}
          </div>
        );
      },
    },
    {
      accessorKey: "updatedAt",
      header: () => (
        <div className="w-full flex items-center justify-center">
          Updated At
        </div>
      ),
      size: 200,
      enableResizing: true,
      cell: ({ row }) => {
        const updatedAt = row.getValue("updatedAt") as string;
        return (
          <div className="w-full flex items-center justify-center">
            {moment(updatedAt).format("YYYY-MM-DD HH:mm:ss")}
          </div>
        );
      },
    },
  ];

  const actionHandler = (action: any, id: string) => {
    // userAction[action](id);
    submit(
      { id: id, action: action, pagination },
      { method: "post", encType: "application/json" }
    );
  };

  const onSearch = (columnId: string, value: string) => {
    submit(
      {
        action: "search",
        search: value,
        pagination,
      },
      { method: "post", encType: "application/json" }
    );
  };

  return (
    <>
      <AppTable columns={userCollums} data={users} onSearch={onSearch} />
      <Outlet />
    </>
  );
}
