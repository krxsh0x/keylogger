import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const fetcher = async (url: string, token: string) => {
  const res = await fetch(url, {
    headers: {
      Authorization: `${token}`,
    },
  });
  return res.json();
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString();
};
