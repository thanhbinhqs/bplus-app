import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isValidJSON(obj: unknown): boolean {
  try {
    const json = JSON.parse(obj);
    return true;
  } catch (e) {
    return false;
  }
}
