import { redirect, type LoaderFunctionArgs } from "@remix-run/node";
export async function loader({ request }: LoaderFunctionArgs) {
  const cookies = request.headers.get("cookie");
  const token = cookies
    ?.split(";")
    .find((cookie) => cookie.trim().startsWith("token="))
    ?.split("=")[1];
  if (!token) {
    return redirect("/auth/login");
  }
  const res = await fetch(`${process.env.API_URL}/auth/logout?token=${token}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return redirect("/auth/login");
}

export default function LogoutPage() {
  return <div>Logout</div>;
}
