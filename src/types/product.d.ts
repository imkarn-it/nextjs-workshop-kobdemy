import { Product, ProductImage } from "@prisma/client";
import { CatagoryType } from "./catagory";

export interface ProductType extends Product {
  catagory: CatagoryType;
  lowStock: number;
  sku: string;
  mainImage?: ProductImage | null;
  mainImageIndex?: number;
  images?: ProductImage[];
}
