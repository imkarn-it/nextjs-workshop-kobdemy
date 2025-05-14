import Model from "@/components/shared/model";
import SubmitBtn from "@/components/shared/submit-btn";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { ProductType } from "@/types/product";
import Form from "next/form";
import { useForm } from "@/hooks/use-form";
import { useEffect } from "react";
import { restoreProductAction } from "../actions/products";

interface RestoreProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: ProductType | null;
}

const RestoreProductModal = ({
  open,
  onOpenChange,
  product,
}: RestoreProductModalProps) => {
  const { state, formAction, isPending } = useForm(restoreProductAction);

  useEffect(() => {
    if (state.success) {
      onOpenChange(false);
    }
  }, [state, onOpenChange]);

  return (
    <Model
      open={open}
      onOpenChange={onOpenChange}
      title="Active Product"
      description={`Are you sure you want to active this product: ${product?.title}`}
    >
      <Form action={formAction}>
        <input type="hidden" name="product-id" value={product?.id} />
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancle
          </Button>
          <SubmitBtn pending={isPending} name="Active" icon={RefreshCcw} />
        </div>
      </Form>
    </Model>
  );
};

export default RestoreProductModal;
