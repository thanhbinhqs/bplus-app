import { Form, redirect, useSubmit } from "@remix-run/react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

import type { ActionFunctionArgs } from "@remix-run/node";
export async function action({ request }: ActionFunctionArgs) {
  return redirect("/dashboard/users");
  return {};
}

export default function UserProfilePage() {
  const [open, setOpen] = useState(true);
  const submit = useSubmit();

  const closeHandler = () => {
    submit(null);
    setOpen(false);
  };

  const defaultValues = {
    username: "admin",
    password: "Abc@13579",
  };

  return (
    // <Dialog open={open} onOpenChange={closeHandler}>
    //   <Form method="post" className="mt-8 space-y-6">
    //     {/* <DialogTrigger asChild>
    //     <Button variant="outline">Edit Profile</Button>
    //   </DialogTrigger> */}
    //     <DialogContent className="sm:max-w-[425px]">
    //       <DialogHeader>
    //         <DialogTitle>Edit profile</DialogTitle>
    //         <DialogDescription>
    //           Make changes to your profile here. Click save when you're done.
    //         </DialogDescription>
    //       </DialogHeader>

    //       <div className="space-y-4">
    //         <div>
    //           <Label htmlFor="username">Username</Label>
    //           <Input
    //             id="username"
    //             name="username"
    //             type="username"
    //             autoComplete="username"
    //             required
    //             className="mt-1"
    //             placeholder="Enter your username"
    //             defaultValue={defaultValues.username}
    //           />
    //         </div>
    //         <div>
    //           <Label htmlFor="password">Password</Label>
    //           <Input
    //             id="password"
    //             name="password"
    //             type="password"
    //             autoComplete="current-password"
    //             required
    //             className="mt-1"
    //             placeholder="Enter your password"
    //             defaultValue={defaultValues.password}
    //           />
    //         </div>
    //       </div>

    //       <Button type="submit" className="w-full">
    //         Sign in
    //       </Button>

    //       <DialogFooter>
    //         <Button type="submit">Save changes</Button>
    //       </DialogFooter>
    //     </DialogContent>
    //   </Form>
    // </Dialog>
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-3xl font-bold mb-4">User Profile</h1>
    </div>
  );
}
