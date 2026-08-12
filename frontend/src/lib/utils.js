import { USER_ROLES } from "@/constants/roles";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs) => {
  return twMerge(clsx(inputs));
}


export const isOwner = (role) => {
  return role === USER_ROLES.owner;
}
