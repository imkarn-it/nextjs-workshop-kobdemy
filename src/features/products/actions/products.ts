"use server";

import { InitialFormState } from "@/types/action";
import {
  changeProductStatus,
  createProduct,
  updateProduct,
} from "../db/products";
import { uploadToImageKit } from "@/lib/imageKit";

export const productAction = async (
  _prev: InitialFormState,
  formData: FormData
) => {
  const rawData = {
    id: formData.get("product-id") as string,
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    categoryId: formData.get("catagory-id") as string,
    cost: formData.get("cost") as string,
    basePrice: formData.get("base-price") as string,
    price: formData.get("price") as string,
    stock: formData.get("stock") as string,
    images: formData.getAll("images") as File[],
    mainImageIndex: formData.get("main-image-index") as string,
    deletedImageIds: formData.get("delete-image-ids") as string,
  };

  const processedData = {
    ...rawData,
    cost: rawData.cost ? parseFloat(rawData.cost) : undefined,
    basePrice: rawData.basePrice ? parseFloat(rawData.basePrice) : 0,
    price: rawData.price ? parseFloat(rawData.price) : 0,
    stock: rawData.stock ? parseInt(rawData.stock) : 0,
    mainImageIndex: rawData.mainImageIndex
      ? parseInt(rawData.mainImageIndex)
      : 0,
    deleteImageIds: rawData.deletedImageIds
      ? (JSON.parse(rawData.deletedImageIds) as string[])
      : [],
  };

  const uploadedImages = [];

  for (const imgFile of processedData.images) {
    const uploadResult = await uploadToImageKit(imgFile, "product");

    if (uploadResult && !uploadResult.message) {
      uploadedImages.push({
        url: uploadResult.url || "",
        fileId: uploadResult.fileId || "",
      });
    }
  }

  const result = processedData.id
    ? await updateProduct({
        ...processedData,
        images: uploadedImages,
      })
    : await createProduct({
        ...processedData,
        images: uploadedImages,
      });

  return result && result.message
    ? { success: false, message: result.message, errors: result.error }
    : {
        success: true,
        message: processedData.id ? "แก้ไขสินค้าสำเร็จ" : "สร้างสินค้าสำเร็จ",
      };
};

export const deleteProductAction = async (
  _prev: InitialFormState,
  formData: FormData
) => {
  const id = formData.get("product-id") as string;

  const result = await changeProductStatus(id, "Inactive");

  return result && result.message
    ? { success: false, message: result.message }
    : {
        success: true,
        message: "ปิดการใช้งานสินค้าสำเร็จ",
      };
};

export const restoreProductAction = async (
  _prev: InitialFormState,
  formData: FormData
) => {
  const id = formData.get("product-id") as string;

  const result = await changeProductStatus(id, "Active");

  return result && result.message
    ? { success: false, message: result.message }
    : {
        success: true,
        message: "เปิดการใช้งานสินค้าสำเร็จ",
      };
};
