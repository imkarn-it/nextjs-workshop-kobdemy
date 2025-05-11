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
import { useForm } from "@/hooks/use-form";
import { Plus } from "lucide-react";
// Removed invalid Form import
import { categoriesAction } from "../actions/categories";
import ErrorMessage from "@/components/shared/error-massage";

const CategoriesForm = () => {
  const { errors, formAction, isPending, clearErrors } =
    useForm(categoriesAction);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
          <Plus size={18} />
          <span>Add Category</span>
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Create new catagory for your products
        </CardDescription>
      </CardHeader>

      <form action={formAction} onChange={clearErrors} className="space-y-4">
        <CardContent>
          <div className="space-y-2">
            <InputForm
              label="Category Name"
              id="name"
              placeholder="Enter Category Name"
              required
            />
          </div>
          {/* Error Message */}
          {errors.name && <ErrorMessage error={errors.name[0]} />}
        </CardContent>

        <CardFooter>
          <SubmitBtn
            pending={isPending}
            className="w-full"
            name="Add Category"
            icon={Plus}
          />
        </CardFooter>
      </form>
    </Card>
  );
};
export default CategoriesForm;
