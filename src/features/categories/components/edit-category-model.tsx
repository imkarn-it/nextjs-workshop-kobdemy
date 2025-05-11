import InputForm from "@/components/shared/input-form";
import Model from "@/components/shared/model";
import SubmitBtn from "@/components/shared/submit-btn";
import { useForm } from "@/hooks/use-form";
import { CatagoryType } from "@/types/catagory";
import { Save } from "lucide-react";
import Form from "next/form";
import { categoriesAction } from "../actions/categories";
import ErrorMessage from "@/components/shared/error-massage";
import { useEffect } from "react";

interface EditCategoryModelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  catagory: CatagoryType;
}

const EditCategoryModel = ({
  open,
  onOpenChange,
  catagory,
}: EditCategoryModelProps) => {

  const{state,errors,formAction,isPending,clearErrors} = useForm(categoriesAction);

  useEffect(() => {
    if (state?.success) {
      onOpenChange(false);
    }
  }, [state, onOpenChange]);

  useEffect(() => {
    if(open){
      clearErrors();
    }
  }, [open,clearErrors]);

  return (
<Model open={open} onOpenChange={onOpenChange} title="Update Category" description="Update your category information">
        <Form action={formAction} onChange={clearErrors} className="space-y-4">
          <input type="hidden" name="id" value={catagory?.id} />
          <div className="space-y-2">
            <InputForm
              label="Category Name"
              placeholder="Edit Category Name"
              id="name"
              required
              defaultValue={catagory?.name}
            />
            {/* Error Message */}
            {errors?.name && <ErrorMessage error={errors.name[0]} />}
          </div>
          <SubmitBtn pending={isPending} className="w-full" name="Update Category" icon={Save} />
        </Form>
    </Model>
  );
};
export default EditCategoryModel;
