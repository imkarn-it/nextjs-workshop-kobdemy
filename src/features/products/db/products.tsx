import { db } from "@/lib/db";
import {
  unstable_cacheLife as cacheLife,
  unstable_cacheTag as cacheTag,
} from "next/cache";
import {
  getProductIdTag,
  getProductsGlobalTag,
  revalidateProductsCache,
} from "./cache";
import { productSchema } from "../schemas/product";
import { canCreateProduct, canUpdateProduct } from "../permissions/products";
import { authCheck } from "@/features/auth/db/auth";
import { redirect } from "next/navigation";
import { deleteFromImageKit } from "@/lib/imageKit";
import { ProductStatus } from "@prisma/client";

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
      orderBy: {
        created: "desc",
      },
      include: {
        catagory: {
          select: {
            id: true,
            name: true,
            status: true,
          },
        },
        images: true,
      },
    });

    const formattedProducts = products.map((product) => {
      // Main Pic
      const mainImage = product.images.find((image) => image.isMain);
      //Main index
      const mainImageIndex = mainImage
        ? product.images.findIndex((image) => image.isMain)
        : 0;

      return {
        ...product,
        lowStock: 5,
        sku: product.id.substring(0, 8).toUpperCase(),
        mainImage: mainImage || null,
        mainImageIndex,
      };
    });

    return formattedProducts;
  } catch (error) {
    console.error("Error getting products:", error);
    return [];
  }
};

export const getProductsById = async (id: string) => {
  "use cache";

  cacheLife("hours");
  cacheTag(getProductIdTag(id));
  try {
    const product = await db.product.findFirst({
      where: {
        id,
      },
      include: {
        catagory: {
          select: {
            id: true,
            name: true,
            status: true,
          },
        },
        images: {
          orderBy: {
            created: "asc",
          },
        },
      },
    });

    if (!product) {
      return null;
    }

    // Main Pic
    const mainImage = product.images.find((image) => image.isMain);
    //Main index
    const mainImageIndex = mainImage
      ? product.images.findIndex((image) => image.isMain)
      : 0;

    return {
      ...product,
      lowStock: 5,
      sku: product.id.substring(0, 8).toUpperCase(),
      mainImage: mainImage || null,
      mainImageIndex,
    };
  } catch (error) {
    console.error("Error getting products id :", error);
    return null;
  }
};

export const createProduct = async (input: CreateProductInput) => {
  const user = await authCheck();
  if (!user || !canCreateProduct(user)) {
    redirect("/");
  }
  try {
    const { success, data, error } = productSchema.safeParse(input);
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
        message: "ไม่พบหมวดหมู่ที่คุณในระบบ หรือ อาจจะถูกปิดการใช้งาน",
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

export const updateProduct = async (
  input: CreateProductInput & { id: string; deleteImageIds: string[] }
) => {
  const user = await authCheck();
  if (!user || !canUpdateProduct(user)) {
    redirect("/");
  }
  try {
    const { success, data, error } = productSchema.safeParse(input);
    if (!success) {
      return {
        message: "กรุณากรอกข้อมูลให้ถูกต้อง",
        error: error.flatten().fieldErrors,
      };
    }

    const exitingProduct = await db.product.findUnique({
      where: {
        id: input.id,
      },
      include: {
        images: true,
      },
    });

    if (!exitingProduct) {
      return {
        message: "ไม่พบสินค้าที่ต้องการแก้ไข",
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
        message: "ไม่พบหมวดหมู่ที่คุณในระบบ หรือ อาจจะถูกปิดการใช้งาน",
      };
    }

    if (input.deleteImageIds && input.deleteImageIds.length > 0) {
      for (const delImgId of input.deleteImageIds) {
        const imgToDelete = exitingProduct.images.find(
          (image) => image.id == delImgId
        );

        if (imgToDelete) {
          await deleteFromImageKit(imgToDelete.fileId);
        }
      }
    }

    const updatedProduct = await db.$transaction(async (prisma) => {
      const product = prisma.product.update({
        where: {
          id: input.id,
        },
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

      if (input.deleteImageIds && input.deleteImageIds.length > 0) {
        await prisma.productImage.deleteMany({
          where: {
            id: {
              in: input.deleteImageIds,
            },
            productId: input.id,
          },
        });
      }

      await prisma.productImage.updateMany({
        where: {
          productId: input.id,
        },
        data: {
          isMain: false,
        },
      });

      if (input.images && input.images.length > 0) {
        await Promise.all(
          input.images.map((image) => {
            return prisma.productImage.create({
              data: {
                url: image.url,
                fileId: image.fileId,
                isMain: false,
                productId: input.id,
              },
            });
          })
        );
      }

      const allImages = await prisma.productImage.findMany({
        where: {
          productId: input.id,
        },
        orderBy: {
          created: "asc",
        },
      });

      if (allImages.length > 0) {
        const validIndex = Math.min(input.mainImageIndex, allImages.length - 1);

        if (validIndex >= 0) {
          await prisma.productImage.update({
            where: {
              id: allImages[validIndex].id,
            },
            data: {
              isMain: true,
            },
          });
        }
      }

      return product;
    });

    revalidateProductsCache(updatedProduct.id);
  } catch (error) {
    console.error("Error updating product : ", error);
    return {
      message: "เกิดข้อผิดพลาดในการอัพเดทข้อมูลสินค้า",
    };
  }
};

export const changeProductStatus = async (
  id: string,
  status: ProductStatus
) => {
  const user = await authCheck();
  if (!user || !canUpdateProduct(user)) {
    redirect("/");
  }
  try {
    const product = await db.product.findUnique({
      where: {
        id: id,
      },
    });

    if (!product) {
      return {
        message: "ไม่พบสินค้าที่ต้องการเปลี่ยนสถานะ",
      };
    }

    if (product.status === status) {
      return {
        message: "สินค้านี้มีสถานะนี้อยู่แล้ว",
      };
    }

    const updateProduct = await db.product.update({
      where: {
        id: id,
      },
      data: {
        status: status,
      },
    });

    revalidateProductsCache(updateProduct.id);
  } catch (error) {
    console.error("Error change product status :", error);
    return {
      message: "เกิดข้อผิดพลาดในเปลี่ยนสถานะสินค้า",
    };
  }
};
