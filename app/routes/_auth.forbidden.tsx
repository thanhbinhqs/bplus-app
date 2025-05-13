import { Link, useLoaderData, useSearchParams } from "@remix-run/react";

import type { LoaderFunctionArgs } from "@remix-run/node";
export async function loader({ request }: LoaderFunctionArgs) {
  const cookies = request.headers.get("cookie");
  const returnUrl =
    cookies
      ?.split(";")
      .find((cookie) => cookie.trim().startsWith("returnUrl="))
      ?.split("=")[1] || "/";

  return {
    returnUrl,
  };
}

export default function ForbiddenPage() {
  const { returnUrl } = useLoaderData<typeof loader>();

  return (
    <div className="flex-1 flex flex-col justify-center items-center gap-3">
      <img src="/images/oops.png" alt="Logo" className="size-20" />
      <div className="text-2xl">
        URL:<span className="font-semibold"> {returnUrl}</span>
      </div>
      <p className="font-semibold text-2xl">
        You don't have access to this page.
      </p>
      <Link to="/" className="btn btn-primary">
        Back to Home
      </Link>
    </div>
    
  );
}
