import { z } from "zod";

// Define Contants
const MIN_TITLE_LENGTH = 3;
const MIN_DESC_LENGTH = 10;

// Define Validation Message
const ERROR_MESSAGE = {
  title: `ชื่อต้องต้องมีความยาวอย่างน้อย ${MIN_TITLE_LENGTH} ตัวอักษร`,
  description: `รายละเอียดสินค้าต้องต้องมีความยาวอย่างน้อย ${MIN_DESC_LENGTH} ตัวอักษร`,
  categoryId: "กรุณาเลือกหมวดหมู่สินค้า",
  basePrice: "ราคาสินค้าต้องมีค่ามากกว่า 0",
  price: "ราคาขายสินค้าต้องมีค่ามากกว่า 0",
  stock: "จํานวนสินค้าต้องมีค่ามากกว่า 0",
};

//Main Product Schema
export const productSchema = z.object({
  title: z.string().min(MIN_TITLE_LENGTH, ERROR_MESSAGE.title),
  description: z.string().min(MIN_DESC_LENGTH, ERROR_MESSAGE.description),
  categoryId: z.string().min(1, ERROR_MESSAGE.categoryId),
  cost: z.coerce.number().nonnegative().optional(),
  basePrice: z.coerce.number().positive(ERROR_MESSAGE.basePrice),
  price: z.coerce.number().positive(ERROR_MESSAGE.price),
  stock: z.coerce.number().positive(ERROR_MESSAGE.stock),
});
