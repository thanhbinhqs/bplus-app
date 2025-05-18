import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import bcrypt from 'bcryptjs';

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

export function convertBase64(file: File): Promise<any> {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);

    fileReader.onload = () => {
      resolve(fileReader.result);
    };

    fileReader.onerror = (error) => {
      reject(error);
    };
  });
}



/**
 * Encode a string to Base64 format
 * @param data - The string to encode
 * @returns The Base64 encoded string
 */
export function encodeBase64(data: string): string {
  return Buffer.from(data, 'utf-8').toString('base64');
}

/**
 * Decode a Base64 encoded string
 * @param encodedData - The Base64 encoded string to decode
 * @returns The original decoded string
 */
export function decodeBase64(encodedData: string): string {
  return Buffer.from(encodedData, 'base64').toString('utf-8');
}