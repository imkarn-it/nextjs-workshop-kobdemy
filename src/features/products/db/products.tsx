import { db } from "@/lib/db";
import {
  unstable_cacheLife as cacheLife,
  unstable_cacheTag as cacheTag,
} from "next/cache";
import { getProductsGlobalTag, revalidateProductsCache } from "./cache";
import { createProductSchema } from "../schemas/product";
import { canCreateProduct } from "../permissions/products";
import { authCheck } from "@/features/auth/db/auth";
import { redirect } from "next/navigation";

interface CreateProductInput {
  title: string;
  description: string;
  cost?: number;
  basePrice: number;
  price: number;
  stock: number;
  categoryId: string;
  mainImageIndex: number;
  images: Array<{ url: string; fileId: string }>;
}

export const getProducts = async () => {
  "use cache";

  cacheLife("hours");
  cacheTag(getProductsGlobalTag());

  try {
    const products = await db.product.findMany({
      include: {
        catagory: {
          select: {
            id: true,
            name: true,
            status: true,
          },
        },
        images: {
          where: {
            isMain: true,
          },
          take: 1,
        },
      },
    });

    const formattedProducts = products.map((product) => ({
      ...product,
      lowStock: 5,
      sku: product.id.substring(0, 8).toUpperCase(),
      mainImage: product.images.length > 0 ? product.images[0].url : null,
    }));

    return formattedProducts;
  } catch (error) {
    console.error("Error getting products:", error);
    return [];
  }
};

export const createProduct = async (input: CreateProductInput) => {
  const user = await authCheck();
  if (!user || !canCreateProduct(user)) {
    redirect("/");
  }
  try {
    const { success, data, error } = createProductSchema.safeParse(input);
    if (!success) {
      return {
        message: "กรุณากรอกข้อมูลให้ถูกต้อง",
        error: error.flatten().fieldErrors,
      };
    }

    const category = await db.catagory.findUnique({
      where: {
        id: data.categoryId,
        status: "Active",
      },
    });

    if (!category) {
      return {
        message: "ไม่พบหมวดหมู่ที่คุณในระบบ",
      };
    }

    const newProduct = await db.$transaction(async (prisma) => {
      const product = await db.product.create({
        data: {
          title: data.title,
          description: data.description,
          cost: data.cost,
          basePrice: data.basePrice,
          price: data.price,
          stock: data.stock,
          catagoryId: data.categoryId,
        },
      });

      if (input.images && input.images.length > 0) {
        await Promise.all(
          input.images.map((image, index) => {
            return prisma.productImage.create({
              data: {
                url: image.url,
                fileId: image.fileId,
                isMain: index === input.mainImageIndex,
                productId: product.id,
              },
            });
          })
        );
      }

      return product;
    });

    revalidateProductsCache(newProduct.id);
  } catch (error) {
    console.error("Error creating product:", error);
    return {
      message: "เกิดข้อผิดพลาดในการสร้างสินค้า",
    };
  }
};
