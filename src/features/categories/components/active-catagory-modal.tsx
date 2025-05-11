import Model from "@/components/shared/model";
import SubmitBtn from "@/components/shared/submit-btn";
import { Button } from "@/components/ui/button";
import { useForm } from "@/hooks/use-form";
import { CatagoryType } from "@/types/catagory";
import { Trash2 } from "lucide-react";
import Form from "next/form";
import { activeCategoriesAction } from "../actions/categories";
import { useEffect } from "react";

interface ActiveCatagoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  catagory: CatagoryType | null;
}

const ActiveCatagoryModal = ({
  open,
  onOpenChange,
  catagory,
}: ActiveCatagoryModalProps) => {
  const { state, formAction, isPending } = useForm(activeCategoriesAction);

  useEffect(() => {
    if (state?.success) {
      onOpenChange(false);
    }
  }, [state, onOpenChange]);

  return (
    <Model
      open={open}
      onOpenChange={onOpenChange}
      title="Active Catagory"
      description="Are you sure active catagory"
    >
      <Form action={formAction}>
        <input type="hidden" name="id" value={catagory?.id} />

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-6">
          <Button
            disabled={isPending}
            onClick={() => onOpenChange(false)}
            variant="outline"
            type="button"
          >
            Cancle
          </Button>
          <SubmitBtn
            pending={isPending}
            className="bg-green-600 hover:bg-green-800"
            icon={Trash2}
            name="Active"
          />
        </div>
      </Form>
    </Model>
  );
};

export default ActiveCatagoryModal;
