"use server";

import { InitialFormState } from "@/types/action";
import { activeCategories, createCategories, removeCategories, updateCategories } from "../db/categories";

export const categoriesAction = async (
  _prev: InitialFormState,
  formData: FormData
) => {
  const rawData = {
    id: formData.get("id") as string,
    name: formData.get("name") as string,
  };

  const result = rawData.id
    ? await updateCategories(rawData)
    : await createCategories(rawData);

  return result && result.message
    ? { success: false, message: result.message, errors: result.error }
    : {
        success: true,
        message: rawData.id ? "อัพเดทหมวดหมู่สำเร็จ" : "สร้างหมวดหมู่สำเร็จ",
      };
};

export const deleteCategoriesAction = async (
  _prev: InitialFormState,
  formData: FormData
) => {
  const id = formData.get("id") as string;

  const result = await removeCategories(id);

  return result && result.message
    ? { success: false, message: result.message }
    : { success: true, message: "ลบหมวดหมู่สำเร็จ" };
};

export const activeCategoriesAction = async (
  _prev: InitialFormState,
  formData: FormData
) => {
  const id = formData.get("id") as string;

  const result = await activeCategories(id);

  return result && result.message
    ? { success: false, message: result.message }
    : { success: true, message: "เปิดใช้หมวดหมู่สำเร็จ" };
};
