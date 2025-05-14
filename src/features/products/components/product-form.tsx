"use client";

import InputForm from "@/components/shared/input-form";
import SubmitBtn from "@/components/shared/submit-btn";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "@/hooks/use-form";
import { CatagoryType } from "@/types/catagory";
import { SelectValue } from "@radix-ui/react-select";
import { Save } from "lucide-react";
import Form from "next/form";
import { useState } from "react";
import { productAction } from "../actions/products";
import ErrorMessage from "@/components/shared/error-massage";
import ProductImageUplaod from "./product-image-upload";
import { ProductType } from "@/types/product";

interface ProductFormProps {
  categories: CatagoryType[];
  product: ProductType | null;
}

const ProductForm = ({ categories, product }: ProductFormProps) => {
  const [basePrice, setBasePrice] = useState(
    product ? product.basePrice.toString() : ""
  );
  const [salePrice, setSalePrice] = useState(
    product ? product.price.toString() : ""
  );

  //   Image State
  const [productImages, setProductImages] = useState<File[]>([]);
  const [mainImageIndex, setMainImageIndex] = useState(0);

  const [deleteImageIds, setDeleteImageIds] = useState<string[]>([]);

  const { formAction, errors, isPending, clearErrors } = useForm(
    productAction,
    "/back-office/products"
  );

  const handleSubmit = async (formData: FormData) => {
    if (product) {
      formData.append("product-id", product.id);
    }

    if (productImages.length > 0) {
      productImages.forEach((file) => {
        formData.append("images", file);
      });
    }
    formData.append("main-image-index", mainImageIndex.toString());

    console.log(mainImageIndex);
    if (deleteImageIds.length > 0) {
      formData.append("delete-image-ids", JSON.stringify(deleteImageIds));
    }

    return formAction(formData);
  };

  const handleImageChange = (
    imageFiles: File[],
    mainIndex: number,
    deleteImageIds: string[] = []
  ) => {
    setProductImages(imageFiles);
    setMainImageIndex(mainIndex);
    setDeleteImageIds(deleteImageIds);
  };

  const CalDiscount = () => {
    const basePriceNum = parseFloat(basePrice) || 0;
    const salePriceNum = parseFloat(salePrice) || 0;

    if (basePriceNum === 0 || salePriceNum === 0) return "0%";
    if (basePriceNum < salePriceNum) return "0%";

    const discount = ((basePriceNum - salePriceNum) / basePriceNum) * 100;
    return `${discount.toFixed(2)}%`;
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl">
          Product Information
        </CardTitle>
        <CardDescription>Enter the details of the product</CardDescription>
      </CardHeader>
      <Form
        action={handleSubmit}
        onChange={clearErrors}
        className="flex flex-col gap-4"
      >
        <CardContent className="flex flex-col gap-6">
          {/* Basic Information */}
          <div className="flex flex-col gap-4">
            <h3 className="font-medium">Basic Information</h3>
            {/* Product Title */}
            <div className="flex flex-col gap-2">
              <InputForm
                label="Product Title"
                id="title"
                placeholder="Enter Product Title"
                required
                defaultValue={product?.title}
              />
              {/* Error Message */}
              {errors?.title && <ErrorMessage error={errors.title[0]} />}
            </div>

            {/* Product Description */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="description">
                Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                placeholder="Enter Product Description"
                name="description"
                className="min-h-20"
                defaultValue={product?.description}
              />
              {/* Error Message */}
              {errors?.description && (
                <ErrorMessage error={errors.description[0]} />
              )}
            </div>

            {/* Catagory Selection */}
            <div className="flex flex-col gap-2">
              <Label>
                Catagory <span className="text-red-500">*</span>
              </Label>
              <Select name="catagory-id" defaultValue={product?.catagoryId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Catagory" />
                </SelectTrigger>
                <SelectContent>
                  {categories
                    .filter((c) => c.status === "Active")
                    .map((c, index) => (
                      <SelectItem key={index} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              {/* Error Message */}
              {errors?.categoryId && (
                <ErrorMessage error={errors.categoryId[0]} />
              )}
            </div>
          </div>

          {/* Product Image */}
          <ProductImageUplaod
            onImageChange={handleImageChange}
            existingImages={product?.images}
          />

          {/* Pricing Information */}
          <div className="flex flex-col gap-4">
            <h3 className="font-medium">Pricing Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Cost */}
              <div className="flex flex-col gap-2">
                <InputForm
                  label="Cost Price"
                  id="cost"
                  type="number"
                  min={0}
                  step={0.01}
                  placeholder="0.00"
                  defaultValue={product?.cost}
                />
                {/* Error Message */}
                {errors?.cost && <ErrorMessage error={errors.cost[0]} />}
              </div>

              {/* Base Price */}
              <div className="flex flex-col gap-2">
                <InputForm
                  label="Base Price"
                  id="base-price"
                  type="number"
                  min={0}
                  step={0.01}
                  placeholder="0.00"
                  required
                  defaultValue={product?.basePrice || basePrice}
                  onChange={(e) => setBasePrice(e.target.value)}
                />
                {/* Error Message */}
                {errors?.basePrice && (
                  <ErrorMessage error={errors.basePrice[0]} />
                )}
              </div>

              {/* Sell Price */}
              <div className="flex flex-col gap-2">
                <InputForm
                  label="Sell Price"
                  id="price"
                  type="number"
                  min={0}
                  step={0.01}
                  placeholder="0.00"
                  required
                  defaultValue={product?.price || basePrice}
                  onChange={(e) => setSalePrice(e.target.value)}
                />
                {/* Error Message */}
                {errors?.price && <ErrorMessage error={errors.price[0]} />}
              </div>

              {/* Discount % */}
              <div className="flex flex-col gap-2">
                <Label>Discount</Label>
                <div className="h-9 px-3 rounded-md border border-input bg-gray-50 flex items-center">
                  {CalDiscount()}
                </div>
              </div>
            </div>
          </div>
          {/* Stock Information */}
          <div className="flex flex-col gap-4">
            <h3 className="font-medium">Stock Information</h3>
            {/* Stock */}
            <div>
              <InputForm
                label="Stock Quantity"
                id="stock"
                type="number"
                min={0}
                placeholder="0"
                required
                defaultValue={product?.stock}
              />
              {/* Error Message */}
              {errors?.stock && <ErrorMessage error={errors.stock[0]} />}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <SubmitBtn
            pending={isPending}
            name={product ? "Update Product" : "Save Product"}
            icon={Save}
            className="w-full"
          />
        </CardFooter>
      </Form>
    </Card>
  );
};
export default ProductForm;
