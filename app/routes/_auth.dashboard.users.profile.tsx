import {
  data,
  Form,
  redirect,
  useLoaderData,
  useNavigate,
  useSubmit,
} from "@remix-run/react";
import { ChangeEvent, useState } from "react";

import type { ActionFunctionArgs } from "@remix-run/node";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";

import type { LoaderFunctionArgs } from "@remix-run/node";
import { apiRequest } from "~/lib/api-request";
import { User } from "~/lib/interfaces/user";
import AppDialog from "~/components/app/dialog";
import moment from "moment";
import { convertBase64 } from "~/lib/utils";
import { AppPaginator } from "~/lib/interfaces/paginator";

import { z } from "zod";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const cookies = request.headers.get("cookie");
  const pagination = JSON.parse(
    cookies
      ?.split(";")
      .find((cookie) => cookie.trim().startsWith("bp_pagination="))
      ?.split("=")[1] || "{}"
  );
  const page = pagination.page || 1;
  const limit = pagination.limit || 50;
  const search = pagination.search || "";

  const id = url.searchParams.get("id");
  // let id = params.id;
  if (!id)
    return redirect(
      `/dashboard/users?page=${page}&limit=${limit}&search=${search}`
    );

  const json = await apiRequest(request, `/user/${id}`, {
    method: "GET",
  });

  if (json.success)
    return data({
      user: json.data,
      pagination,
    });
  else
    return redirect(
      `/dashboard/users?page=${page}&limit=${limit}&search=${search}`
    );
}

export async function action({ request }: ActionFunctionArgs) {
  const cookies = request.headers.get("cookie");
  const paginationStr = JSON.parse(
    cookies
      ?.split(";")
      .find((cookie) => cookie.trim().startsWith("bp_pagination="))
      ?.split("=")[1] || "{}"
  );
  const pagination = paginationStr ? JSON.parse(paginationStr) : {};
  const page = pagination.page || 1;
  const limit = pagination.limit || 50;
  const search = pagination.search || "";

  return redirect(
    `/dashboard/users?page=${page}&limit=${limit}&search=${search}`
  );
}

const formSchema = z.object({
  username: z.string().min(1),
  fullname: z.string().min(1).optional(),
  email: z.string().min(1).optional(),
  phone: z.string().min(1).optional(),
  address: z.string().min(1).optional(),
  gen: z.string().min(1).optional(),
  birthday: z.string().min(1).optional(),
  avatar: z.string().optional(),
});

export default function UserProfileDialog() {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const submit = useSubmit();
  const { user, pagination }: { user: User; pagination: AppPaginator } =
    useLoaderData<typeof loader>();
  const [avatar, setAvatar] = useState<string>(user.avatar || "");

  const closeHandler = () => {
    navigate(
      `/dashboard/users?page=${pagination.page}&limit=${pagination.limit}&search=${pagination.search}`
    );
    setOpen(false);
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
