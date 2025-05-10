import { redirect, type LoaderFunctionArgs } from "@remix-run/node";
import { Link, Outlet, useLoaderData, useSearchParams } from "@remix-run/react";
import { ColumnDef } from "@tanstack/react-table";
import AppTable from "~/components/app/table";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { apiRequest } from "~/lib/api-request";
import { User } from "~/lib/interfaces/user";
import { IoIosArrowDropdown } from "react-icons/io";
import { ReactNode, useMemo, useState } from "react";
import SetUserProfileDialog from "~/components/app/user/set-profile-dialog";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const userRes = await apiRequest(request, "/user", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!userRes?.success) {
    if (userRes.statusCode === 401) return redirect("/auth/login");
    if (userRes.statusCode === 403) return redirect("/forbidden");

    return {
      error: userRes.message,
      statusCode: userRes.statusCode,
    };
  }

  return { ...userRes.data };
}

export default function UserListingPage() {
  const {
    total = 0,
    limit = 50,
    page = 1,
    data = [],
  } = useLoaderData<typeof loader>();

  const [searchParams, setSearchParams] = useSearchParams();

  const users = useMemo(() => {
    return data;
  }, []);

  const [currentDialog, setCurrentDialog] = useState<ReactNode>(null);

  const userCollums: ColumnDef<User>[] = [
    {
      id: "id",
      accessorKey: "id",
      header: "No",
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
      header: ({ table }) => (
        // <div className="flex items-center justify-center">
        //   <input
        //     type="checkbox"
        //     checked={table.getIsAllRowsSelected()}
        //     onChange={table.getToggleAllRowsSelectedHandler()}
        //     className="cursor-pointer"
        //   />
        // </div>
        <div>Action</div>
      ),
      cell: ({ row }) => {
        const username = row.getValue("username");
        const active = row.getValue("active");
        const id = row.getValue("id") as string;

        return (
          <div className="flex items-center justify-center cursor-pointer w-full h-full !m-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="link">
                  <IoIosArrowDropdown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel className="text-center">
                  <span className="">{"Action > " + username}</span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    className="cursor-pointer hover:!bg-gray-200"
                    onClick={() => actionHandler("profile", id)}
                  >
                    Profile
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    className="cursor-pointer hover:!bg-gray-200"
                    onClick={() => actionHandler("active", id)}
                  >
                    {!active ? <span>Active</span> : <span>Deactive</span>}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer hover:!bg-gray-200"
                    onClick={() => actionHandler("role", id)}
                  >
                    Role
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer hover:!bg-gray-200"
                    onClick={() => actionHandler("permission", id)}
                  >
                    Permission
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer hover:!bg-gray-200"
                    onClick={() => actionHandler("password", id)}
                  >
                    Password
                  </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />
                {/* <DropdownMenuGroup>
                <DropdownMenuItem>Team</DropdownMenuItem>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Invite users</DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem>Email</DropdownMenuItem>
                      <DropdownMenuItem>Message</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>More...</DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
  
              </DropdownMenuGroup>
              
              <DropdownMenuSeparator /> */}
                <DropdownMenuItem
                  className="cursor-pointer hover:!bg-red-200"
                  onClick={() => actionHandler("delete", id)}
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
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
      header: "Username",
      size: 800,
      enableResizing: true,
      meta: {
        sticky: "left",
      },
    },
    {
      accessorKey: "fullname",
      header: "Fullname",
      size: 300,
      enableResizing: true,
      meta: {
        sticky: "left",
      },
    },
    {
      accessorKey: "email",
      header: "Email",
      size: 150,
      enableResizing: true,
    },
    {
      accessorKey: "phone",
      header: "Phone",
      size: 150,
      enableResizing: true,
    },

    {
      accessorKey: "gen",
      header: "Gen",
      size: 150,
      enableResizing: true,
    },
    {
      accessorKey: "birthday",
      header: "Birthday",
      size: 150,
      enableResizing: true,
    },
    {
      accessorKey: "address",
      header: "Address",
      size: 150,
      enableResizing: true,
    },
    {
      id: "active",
      accessorKey: "active",
      header: "Active",
      size: 100,
      enableResizing: true,
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      size: 150,
      enableResizing: true,
    },
    {
      accessorKey: "updatedAt",
      header: "Updated At",
      size: 150,
      enableResizing: true,
    },
  ];

  const actionDialogCloseHandler = () => {
    setCurrentDialog(null);
  };

  const actionHandler = (action: any, id: string) => {
    userAction[action](id);
  };

  const userAction = {
    profile: (id: string) => {
      setCurrentDialog(
        <SetUserProfileDialog id={id} onClose={actionDialogCloseHandler} />
      );
    },
    active: (id: string) => {},
    role: (id: string) => {},
    permission: (id: string) => {},
    password: (id: string) => {},
    delete: (id: string) => {},
  };

  return (
    <>
      {users.length > 0 ? (
        <>
          {currentDialog && currentDialog}
          <AppTable columns={userCollums} data={users} />
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-full w-full">
          <h2 className="text-lg font-bold">No Data</h2>
        </div>
      )}
    </>
  );
}
