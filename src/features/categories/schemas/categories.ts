import { z } from "zod";

// Define Contants
const MIN_NAME_LENGTH = 2;
const MAX_NAME_LENGTH = 50;

// Define Validation Message
const ERROR_MESSAGE = {
  name: `ชื่อหมวดหมู่ต้องต้องมีความยาวระหว่าง ${MIN_NAME_LENGTH} ถึง ${MAX_NAME_LENGTH} ตัวอักษร`,
};

//Main categories Schema
export const categoriesSchema = z.object({
  name: z
    .string()
    .min(MIN_NAME_LENGTH, ERROR_MESSAGE.name)
    .max(MAX_NAME_LENGTH, ERROR_MESSAGE.name),
});
