import Model from "@/components/shared/model"
import SubmitBtn from "@/components/shared/submit-btn";
import { Button } from "@/components/ui/button";
import { useForm } from "@/hooks/use-form";
import { CatagoryType } from "@/types/catagory";
import { Trash2 } from "lucide-react";
import Form from "next/form";
import { deleteCategoriesAction } from "../actions/categories";
import {  useEffect } from "react";

interface DeleteCatagoryModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    catagory: CatagoryType | null;
}

const DeleteCatagoryModal = ({open,onOpenChange,catagory}:DeleteCatagoryModalProps) => {
    
    const { state,formAction,isPending } = useForm(deleteCategoriesAction);
  
    useEffect(() => {
        if (state?.success) {
          onOpenChange(false);
        }
      }, [state, onOpenChange]);

    return (
    <Model 
    open={open} 
    onOpenChange={onOpenChange} 
    title="Delete Catagory" 
    description="Are you sure delete catagory">
        <Form action={formAction}>
            <input type="hidden" name="id" value={catagory?.id} />
        
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-6">
            <Button disabled={isPending} onClick={() => onOpenChange(false)} variant="outline" type="button">Cancle</Button>
            <SubmitBtn pending={isPending} className="bg-destructive hover:bg-destructive/80" icon={Trash2} name="Delete" />
        </div>
        </Form>
    </Model>
  )
}

export default DeleteCatagoryModal