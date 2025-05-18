/* eslint-disable react/no-unescaped-entities */
import { Form, useActionData, Link, data, redirect } from "@remix-run/react";
import { ActionFunctionArgs } from "@remix-run/node";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useToast } from "~/hooks/use-toast";
import { useEffect } from "react";

import type { LoaderFunctionArgs } from "@remix-run/node";
import { API_URL } from "~/lib/api-request";
export async function loader({ request }: LoaderFunctionArgs) {
  //clear cookies

  return data(
    { message: "ok" },
    {
      headers: {
        "Set-Cookie": [
          `bp_token=; HttpOnly; Path=/; Max-Age=0;`,
          `bp_menu=; HttpOnly; Path=/; Max-Age=0`,
          `bp_pagination=; HttpOnly; Path=/; Max-Age=0`,
          `bp_user=; HttpOnly; Path=/; Max-Age=0;`,

        ].join(", "),
      },
    }
  );
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const returnUrl = new URL(request.url).searchParams.get("returnUrl") || "/";
  const username = formData.get("username");
  const password = formData.get("password");
  // Basic validation
  if (!username || !password) {
    return data({ error: "User and password are required" }, { status: 400 });
  }

  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });
  const json = await response.json();
  if (json.success) {
    const data = json.data;
    return redirect(returnUrl, {
      headers: {
        "Set-Cookie": [
          `bp_token=${data.token}; HttpOnly; Path=/;`,
          
        ].join(", "),
      },
      status: 302,
    });
  }

  return data(json, { status: json.statusCode });
}

export default function LoginPage() {
  const actionData = useActionData();

  const { toast } = useToast();

  useEffect(() => {
    if (actionData && !actionData?.success) {
      toast({
        variant: "destructive",
        title: `Error: ${actionData?.statusCode}`,
        description: actionData?.message,
        duration: 2000,
      });
    }
  }, [actionData, toast]);

  const defaultValues = {
    username: "admin",
    password: "1234567890",
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100  bg-[url('/images/login-back.jpg')] bg-cover bg-center">
      <div className="w-[94%] md:w-1/2 lg:w-1/3 p-8 space-y-8 bg-white">
        <div>
          <h2 className="mt-4 text-center text-2xl font-bold tracking-tight text-gray-900 uppercase">
            Đăng nhập tài khoản
          </h2>
        </div>
        <Form method="post" className="mt-8 space-y-6">
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
                defaultValue={defaultValues.username}
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
                defaultValue={defaultValues.password}
              />
            </div>
          </div>

          <Button type="submit" className="w-full">
            Sign in
          </Button>
        </Form>
        <p className="text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/auth/register"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
