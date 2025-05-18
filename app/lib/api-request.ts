import { redirect } from "@remix-run/react";

export const API_URL = process.env.API_URL || "http://localhost:3005/api";

export const apiRequest = async (
  request: Request,
  url: string,
  options?: RequestInit
) => {
  const cookies = request.headers.get("cookie");
  const token = cookies
    ?.split(";")
    .find((cookie) => cookie.trim().startsWith("bp_token="))
    ?.split("=")[1];
  if (!token) {
    return {
      success: false,
      statusCode: 401,
      message: "Unauthorized: No token provided",
    };
  }
  try {
    const response = await fetch(`${API_URL}${url}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const json = await response.json();

    return json;
  } catch (error) {
    return {
      success: false,
      statusCode: 500,
      message: "Internal Server Error",
    };
  }
};
