import HeaderAdmin from "@/components/admin-page/header/header";
import SidebarAdmin from "@/components/admin-page/sidebar/sidebar";
import { authCheck } from "@/features/auth/db/auth";
import { SlidebarProvider } from "@/providers/Sidebar";
import { redirect } from "next/navigation";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = async ({ children }: AdminLayoutProps) => {
  const user = await authCheck();

  if (!user || user.role !== "Admin") {
    redirect("/");
  }

  return (
    <SlidebarProvider>
      <div className="bg-background flex min-h-svh">
        <SidebarAdmin user={user} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <HeaderAdmin user={user} />
          <main className=" flex-1 overflow-y-auto md:ml-64 pt-16 p-4 md:px-6 transition-all duration-200">
            {children}
          </main>
        </div>
      </div>
    </SlidebarProvider>
  );
};
export default AdminLayout;
