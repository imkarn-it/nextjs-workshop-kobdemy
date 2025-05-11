import { db } from "@/lib/db";
import {
  unstable_cacheLife as cacheLife,
  unstable_cacheTag as cacheTag,
} from "next/cache";
import { getCategoriesGlobalTag, revalidateCategoriesCache } from "./cache";
import { categoriesSchema } from "../schemas/categories";
import { authCheck } from "@/features/auth/db/auth";
import {
  canCreateCatagories,
  canDeleteCatagories,
  canUpdateCatagories,
} from "../permissions/categories";
import { redirect } from "next/navigation";
import { CatagoryStatus } from "@prisma/client";

interface createCategoriesInput {
  name: string;
}

interface updateCategoriesInput {
  id: string;
  name: string;
}

export const getCategories = async () => {
  "use cache";

  cacheLife("days");
  cacheTag(getCategoriesGlobalTag());
  try {
    return await db.catagory.findMany({
      orderBy: { created: "asc" },
      select: {
        id: true,
        name: true,
        status: true,
      },
    });
  } catch (error) {
    console.error("Error getting categories : ", error);
    return [];
  }
};

export const createCategories = async (input: createCategoriesInput) => {
  const user = await authCheck();
  if (!user || !canCreateCatagories(user)) {
    redirect("/");
  }
  try {
    const { success, data, error } = categoriesSchema.safeParse(input);

    if (!success) {
      return {
        message: "กรุณากรอกข้อมูลให้ถูกต้อง",
        error: error.flatten().fieldErrors,
      };
    }

    const exitsCategories = await db.catagory.findFirst({
      where: {
        name: data.name,
      },
    });

    if (exitsCategories) {
      return {
        message: "ชื่อหมวดหมู่นี้มีอยู่แล้ว",
      };
    }

    const newCategories = await db.catagory.create({
      data: {
        name: data.name,
      },
    });

    revalidateCategoriesCache(newCategories.id);
  } catch (error) {
    console.error("Error creating categories : ", error);
    return {
      message: "เกิดข้อผิดพลาดในการสร้างหมวดหมู่",
    };
  }
};

export const updateCategories = async (input: updateCategoriesInput) => {
  const user = await authCheck();
  if (!user || !canUpdateCatagories(user)) {
    redirect("/");
  }
  try {
    const { success, data, error } = categoriesSchema.safeParse(input);
    if (!success) {
      return {
        message: "กรุณากรอกข้อมูลให้ถูกต้อง",
        error: error.flatten().fieldErrors,
      };
    }

    const exitsCategories = await db.catagory.findUnique({
      where: {
        id: input.id,
      },
    });

    if (!exitsCategories) {
      return {
        message: "ไม่พบหมวดหมู่ที่ต้องการแก้ไข",
      };
    }

    const exitsCategoriesName = await db.catagory.findFirst({
      where: {
        name: data.name,
        id: {
          not: input.id,
        },
      },
    });

    if (exitsCategoriesName) {
      return {
        message: "ชื่อหมวดหมู่นี้มีอยู่แล้ว",
      };
    }

    const updatedCategories = await db.catagory.update({
      where: {
        id: input.id,
      },
      data: {
        name: data.name,
      },
    });

    revalidateCategoriesCache(updatedCategories.id);
  } catch (error) {
    console.error("Error updating categories : ", error);
    return {
      message: "เกิดข้อผิดพลาดในการอัพเดทหมวดหมู่",
    };
  }
};

export const changeStatusCategories = async (id: string,status:CatagoryStatus) => {
  const user = await authCheck();
  if (!user || !canUpdateCatagories(user)) {
    redirect("/");
  }
  try {
    const exitsCategories = await db.catagory.findUnique({
      where: {
        id: id,
      },
    });

    if (!exitsCategories) {
      return {
        message: "ไม่พบหมวดหมู่ที่ต้องการปิดการใช้งาน",
      };
    }

    if (exitsCategories.status === status) {
      return {
        message: "หมวดหมู่นี้เป็น สถานะที่คุณต้องการอยู่แล้ว",
      };
    }

    const updatedCategories = await db.catagory.update({
      where: {
        id: id,
      },
      data: {
        status: status,
      },
    });

    revalidateCategoriesCache(updatedCategories.id);
  }catch (error) {
    console.error("Error inactive categories : ", error);
    return {
      message: "เกิดข้อผิดพลาดในการปิดการใช้งานหมวดหมู่",
    };
  }
}

export const removeCategories = async (id: string) => {
  const user = await authCheck();
  if (!user || !canDeleteCatagories(user)) {
    redirect("/");
  }
  try {

    return await changeStatusCategories(id, CatagoryStatus.Inactive);
  } catch (error) {
    console.error("Error deleting categories : ", error);
    return {
      message: "เกิดข้อผิดพลาดในการลบหมวดหมู่",
    };
  }
}

export const activeCategories = async (id: string) => {
  const user = await authCheck();
  if (!user || !canUpdateCatagories(user)) {
    redirect("/");
  }
  try {

    return await changeStatusCategories(id, CatagoryStatus.Active);
  } catch (error) {
    console.error("Error deleting categories : ", error);
    return {
      message: "เกิดข้อผิดพลาดในการเปิดใช้งานหมวดหมู่",
    };
  }
}