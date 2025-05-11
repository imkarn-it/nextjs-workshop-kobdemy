import { getGlobalTag, getIdTag } from "@/lib/dataCache";
import { revalidateTag } from "next/cache";

export const getUserGlobalTag = () => {
  return getGlobalTag("user");
};

export const getUserIdTag = (id: string) => {
  return getIdTag("user", id);
};

export const revalidateUserCache = (id: string) => {
  revalidateTag(getUserGlobalTag());
  revalidateTag(getUserIdTag(id));
};
