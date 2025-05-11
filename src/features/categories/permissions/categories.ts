import { UserType } from "@/types/user";

export const canCreateCatagories = (user: UserType) => {
  return user.role === "Admin";
};

export const canUpdateCatagories = (user: UserType) => {
  return user.role === "Admin";
};

export const canDeleteCatagories = (user: UserType) => {
  return user.role === "Admin";
};
