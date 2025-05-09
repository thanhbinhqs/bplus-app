import { redirect, type MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Bplus App" },
    { name: "description", content: "Welcome to Bplus!" },
  ];
};

import type { LoaderFunctionArgs } from "@remix-run/node"
export async function loader({ request }: LoaderFunctionArgs) {
  // return redirect("/auth/login");
 return {}
}

export default function Index() {
  return (
    <div className="flex h-screen items-center justify-center">
      HOME PAGE
    </div>
  );
}


