import { clsx, type ClassValue } from "clsx";
// eslint-disable-next-line no-restricted-imports
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
