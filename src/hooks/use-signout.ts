import { signoutAction } from "@/features/auth/actions/auth";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useSignout = () => {
  const [isPending, startTransition] = useTransition();
  const route = useRouter();

  const handleSignout = () => {
    startTransition(async () => {
      const result = await signoutAction();
      if (result.success) {
        toast.success(result.message);
        route.push("/auth/signin");
      } else {
        toast.error(result.message);
      }
    });
  };

  return { isPending, handleSignout };
};
