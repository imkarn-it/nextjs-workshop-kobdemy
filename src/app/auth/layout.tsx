import { authCheck } from "@/features/auth/db/auth";
import { redirect } from "next/navigation";
import HeaderCustomer from "@/components/customer-page/headers/header";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout = async ({ children }: AuthLayoutProps) => {
  const objUser = await authCheck();

  if (objUser) {
    redirect("/");
  }

  return (
    <div className="flex flex-col justify-center min-h-svh">
      <HeaderCustomer user={null} />
      <main>{children}</main>
    </div>
  );
};
export default AuthLayout;
