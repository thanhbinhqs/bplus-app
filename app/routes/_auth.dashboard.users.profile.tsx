import {
  Form,
  redirect,
  useLoaderData,
  useNavigate,
  useSubmit,
} from "@remix-run/react";
import { ChangeEvent, useState } from "react";

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
import AppDialog from "~/components/app/dialog";
import moment from "moment";
import { convertBase64 } from "~/lib/utils";

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

  const [avatar, setAvatar] = useState<string>(user.avatar || "");

  const closeHandler = () => {
    setOpen(false);
    navigate("/dashboard/users");
  };

  const submitHandler = () => {
    submit({}, { method: "POST", encType: "application/json" });
  };

  const avatarOnchange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file =
      event.target.files && event.target.files?.length > 0
        ? event.target.files[0]
        : null;
    if (!file) return;
    const avat = await convertBase64(file);
    setAvatar(avat);
  };

  return (
    <AppDialog
      open={open}
      title="User Profile"
      description="Update user profile"
      close={closeHandler}
    >
      <Form className="flex justify-center items-center w-full flex-col gap-3 overflow-y-auto">
        <div className="w-full">
          <Label htmlFor="username">Username</Label>
          <Input
            type="text"
            name="username"
            defaultValue={user.username}
            disabled
          />
        </div>
        <div className="w-full">
          <Label htmlFor="fullname">Fullname</Label>
          <Input type="text" name="fullname" defaultValue={user.fullname} />
        </div>
        <div className="w-full">
          <Label htmlFor="email">Email</Label>
          <Input type="email" name="email" defaultValue={user.email} />
        </div>
        <div className="w-full">
          <Label htmlFor="phone">Phone</Label>
          <Input type="tel" name="phone" defaultValue={user.phone} />
        </div>
        <div className="w-full">
          <Label htmlFor="address">Address</Label>
          <Input type="text" name="address" defaultValue={user.address} />
        </div>
        <div className="w-full">
          <Label htmlFor="gen">Gen</Label>
          <Input type="number" name="gen" defaultValue={user.gen} />
        </div>
        <div className="w-full">
          <Label htmlFor="birthday">Birthday</Label>
          <Input
            type="date"
            name="birthday"
            defaultValue={
              user.birthday
                ? moment(user.birthday).format("DD/MM/YYYY")
                : undefined
            }
          />
        </div>
        <div className="w-full">
          <Label htmlFor="avatar">Avatar</Label>
          <Input type="file" name="avatar" onChange={avatarOnchange} />
          {avatar && (
            <img src={avatar} alt="" className="w-20 h-20 rounded-full" />
          )}
        </div>

        <Button type="submit" onClick={submitHandler}>
          Save
        </Button>
      </Form>
    </AppDialog>
  );
}
