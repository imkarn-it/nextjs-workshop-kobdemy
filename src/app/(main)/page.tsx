import Image from "next/image";
import { Button } from "@/components/ui/button";
import { authCheck } from "@/features/auth/db/auth";
import { Store } from "lucide-react";

const HomePage = async () => {
  const objUser = await authCheck();

  return (
    <>
      <div>HomePage</div>
      <Button>
        <Store />
        Click me
      </Button>
    </>
  );
};
export default HomePage;
