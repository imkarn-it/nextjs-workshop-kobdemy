import { Catagory } from "@prisma/client";

export type CatagoryType = Omit<Catagory, "createdAt", "updatedAt">;
