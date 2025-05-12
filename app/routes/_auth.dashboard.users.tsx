/* eslint-disable @typescript-eslint/no-explicit-any */
import { redirect, type LoaderFunctionArgs } from "@remix-run/node";
import {
  useLoaderData,
  useNavigate,
  useNavigation,
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
import { ReactNode, Suspense, useMemo, useState } from "react";
import SetUserProfileDialog from "~/components/app/user/set-profile-dialog";
import moment from "moment";
import Loading from "~/components/app/loading";

export async function loader({ request }: LoaderFunctionArgs) {
  const pageSizeOptions = [50, 100, 200, 500];
  const url = new URL(request.url);
  const page = url.searchParams.get("page") || "1";
  let pageSize = url.searchParams.get("pageSize") || "50";
  const search = url.searchParams.get("search") || "";

  if (pageSizeOptions.indexOf(Number(pageSize)) === -1) pageSize = "50";

  const userRes = await apiRequest(
    request,
    `/user?page=${page}&limit=${pageSize}&search=${search}`,
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

  return {
    ...userRes.data,
    pagination: {
      page: userRes.data?.page || Number(page),
      pageSize: userRes.data?.limit || Number(pageSize),
      total: userRes.data?.total || 0,
      pageSizeOptions: pageSizeOptions,
    },
    pageName: "Users",
  };
}

// export const handle = {
//   headerContent: {
//     // content: <h1>Nội dung tùy chỉnh cho SiteHeader</h1>,
//     pageName: "Users",
//   } as HeaderContentProps,
// };

export default function UserListingPage() {
  const { data = [] } = useLoaderData<typeof loader>();
  const navigate = useNavigation();

  const users = useMemo(() => {
    return data;
  }, [data]);

  const [currentDialog, setCurrentDialog] = useState<ReactNode>(null);

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
      header: () => (
        <div className="w-full flex items-center justify-center">Username</div>
      ),
      size: 200,
      enableResizing: true,
      meta: {
        sticky: "left",
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
    {navigate.state === "loading" && (
      <Loading /> 
    )}
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
