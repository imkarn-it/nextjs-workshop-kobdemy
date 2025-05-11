import { db } from "@/lib/db";

export const getProducts = async () => {
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
      },
    });

    return products.map((product) => ({
      ...product,
      lowStock: 5,
      sku: product.id.substring(0, 8),
    }));
  } catch (error) {
    console.error("Error getting products:", error);
    return [];
  }
};
