import {
  Form,
  redirect,
  useLoaderData,
  useNavigate,
  useSubmit,
} from "@remix-run/react";
import { useState } from "react";

import type { ActionFunctionArgs } from "@remix-run/node";
import { HeaderContentProps } from "~/lib/interfaces/header-content";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";

import type { LoaderFunctionArgs } from "@remix-run/node";
import { apiRequest } from "~/lib/api-request";
import { User } from "~/lib/interfaces/user";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const cookies = request.headers.get("cookie");

  const page =
    cookies
      ?.split(";")
      .find((cookie) => cookie.trim().startsWith("page="))
      ?.split("=")[1] || "1";

  const limit =
    cookies
      ?.split(";")
      .find((cookie) => cookie.trim().startsWith("limit="))
      ?.split("=")[1] || "50";

  const search =
    cookies
      ?.split(";")
      .find((cookie) => cookie.trim().startsWith("search="))
      ?.split("=")[1] || "";

  let id = url.searchParams.get("id");
  if (!id)
    return redirect(
      `/dashboard/users?page=${page}&limit=${limit}&search=${search}`
    );

  const json = await apiRequest(request, `/user/${id}`, {
    method: "GET",
  });

  if (json.success) return json.data;
  else
    return redirect(
      `/dashboard/users?page=${page}&limit=${limit}&search=${search}`
    );
}

export async function action({ request }: ActionFunctionArgs) {
  const cookies = request.headers.get("cookie");
  const page =
    cookies
      ?.split(";")
      .find((cookie) => cookie.trim().startsWith("page="))
      ?.split("=")[1] || "1";

  const limit =
    cookies
      ?.split(";")
      .find((cookie) => cookie.trim().startsWith("limit="))
      ?.split("=")[1] || "50";

  const search =
    cookies
      ?.split(";")
      .find((cookie) => cookie.trim().startsWith("search="))
      ?.split("=")[1] || "";

  return redirect(
    `/dashboard/users?page=${page}&limit=${limit}&search=${search}`
  );
}

// export const handle = {
//   headerContent: {
//     content: <h1>Nội dung tùy chỉnh cho SiteHeader</h1>,
//     pageName: "Profile",
//   } as HeaderContentProps,
// };

export default function UserProfileDialog() {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const submit = useSubmit();
  const user: User = useLoaderData<typeof loader>();

  const closeHandler = () => {
    setOpen(false);
    navigate("/dashboard/users");
  };

  // const defaultValues = {
  //   username: "admin",
  //   password: "Abc@13579",
  // };

  const submitHandler = () => {
    submit({}, { method: "POST", encType: "application/json" });
  };

  return (
    <Dialog open={open} onOpenChange={closeHandler}>
      {/* <DialogTrigger asChild>
        <Button variant="outline">Edit Profile</Button>
      </DialogTrigger> */}
      <DialogContent
        className="sm:max-w-[425px]"
        onPointerDownOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              name="username"
              type="username"
              autoComplete="username"
              required
              className="mt-1"
              placeholder="Enter your username"
              defaultValue={user.username}
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="mt-1"
              placeholder="Enter your password"
              defaultValue={user.fullname}
            />
          </div>
        </div>

        <Button type="submit" className="w-full" onClick={submitHandler}>
          Sign in
        </Button>

        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    // <div className="flex flex-col items-center justify-center min-h-screen py-2">
    //   <h1 className="text-3xl font-bold mb-4">User Profile</h1>
    // </div>
  );
}
