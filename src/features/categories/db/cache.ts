import { getGlobalTag, getIdTag } from "@/lib/dataCache";
import { revalidateTag } from "next/cache";

export const getCategoriesGlobalTag = () => {
  return getGlobalTag("categories");
};

export const getCategoriesIdTag = (id: string) => {
  return getIdTag("categories", id);
};

export const revalidateCategoriesCache = (id: string) => {
  revalidateTag(getCategoriesGlobalTag());
  revalidateTag(getCategoriesIdTag(id));
};
