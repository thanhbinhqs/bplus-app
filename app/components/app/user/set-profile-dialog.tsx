import { Form, useSubmit } from "@remix-run/react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

import type { LoaderFunctionArgs } from "@remix-run/node";
export async function loader({ request }: LoaderFunctionArgs) {
  console.log("Resources loader called!");
  return {};
}

export default function SetUserProfileDialog({
  id,
  onClose,
}: {
  id: string;
  onClose: () => void;
}) {
  // const [open, setOpen] = useState(true);
  const submit = useSubmit();

  const closeHandler = () => {
    submit(null);
    // setOpen(false);
    onClose();
  };
  return (
    <Dialog open={true} onOpenChange={closeHandler}>
      <Form method="post" className="mt-8 space-y-6">
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>{id}</DialogDescription>
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
              />
            </div>
          </div>

          <Button type="submit" className="w-full">
            Sign in
          </Button>

          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Form>
    </Dialog>
  );
}
