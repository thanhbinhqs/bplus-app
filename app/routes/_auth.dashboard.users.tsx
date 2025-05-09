import { redirect, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { ColumnDef } from "@tanstack/react-table";
import AppTable from "~/components/app/table";
import { apiRequest } from "~/lib/api-request";
import { User } from "~/lib/interfaces/user";
export async function loader({ request }: LoaderFunctionArgs) {
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

  return userRes.data;
}

const userCollums: ColumnDef<User>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <input
          type="checkbox"
          checked={table.getIsAllRowsSelected()}
          onChange={table.getToggleAllRowsSelectedHandler()}
          className="cursor-pointer"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <input
          type="checkbox"
          checked={row.getIsSelected()}
          onChange={row.getToggleSelectedHandler()}
          className="cursor-pointer"
        />
      </div>
    ),
    size: 40,
    enableSorting: false,
    enableResizing: true,
    meta: { align: "center", ellipsis: false },
  },
  {
    header: "No",
    size: 70,
    enableResizing: false,

    cell: ({ row }) => row.index + 1,
    meta: {
      sticky: "left",
      align: "center",
    },
  },
  {
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

export default function UserListingPage() {
  const {
    total = 0,
    limit = 50,
    page = 1,
    data = [],
  } = useLoaderData<typeof loader>();

  return (
    <div className="flex-1 w-full h-full m-2 border overflow-hidden">
      <AppTable columns={userCollums} data={data} />
    </div>
  );
}
