import Model from "@/components/shared/model";
import SubmitBtn from "@/components/shared/submit-btn";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { ProductType } from "@/types/product";
import Form from "next/form";
import { useForm } from "@/hooks/use-form";
import { deleteProductAction } from "../actions/products";
import { useEffect } from "react";

interface DeleteProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: ProductType | null;
}

const DeleteProductModal = ({
  open,
  onOpenChange,
  product,
}: DeleteProductModalProps) => {
  const { state, formAction, isPending } = useForm(deleteProductAction);

  useEffect(() => {
    if (state.success) {
      onOpenChange(false);
    }
  }, [state, onOpenChange]);

  return (
    <Model
      open={open}
      onOpenChange={onOpenChange}
      title="Delete Product"
      description={`Are you sure you want to delete this product: ${product?.title}`}
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
          <SubmitBtn
            pending={isPending}
            name="Delete"
            icon={Trash2}
            className="bg-destructive hover:bg-destructive/80"
          />
        </div>
      </Form>
    </Model>
  );
};

export default DeleteProductModal;
