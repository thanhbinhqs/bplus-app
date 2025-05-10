import type { LoaderFunctionArgs } from "@remix-run/node";
export async function loader({ request }: LoaderFunctionArgs) {
  console.log("loader called for user profile page.");
  return { message: "Hello" };
}
