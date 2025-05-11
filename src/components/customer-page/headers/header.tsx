import Link from "next/link";
import { Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "./navbar";
import { UserType } from "@/types/user";

interface HeaderCustomerProps {
  user: UserType | null;
}

const HeaderCustomer = ({ user }: HeaderCustomerProps) => {
  return (
    <header className="fixed top-0 inset-x-0 z-40 border-b border-b-border shadow-sm">
      <div className="items-center max-w-7xl mx-auto px-4 flex justify-between xl:px-0 h-16">
        {/* Icon */}
        <Link href="/" className="flex items-center gap-2 text-primary">
          <Store size={28} />
          <h2 className="text-2xl font-bold"> Kob Store</h2>
        </Link>

        {/* Menu */}

        <Navbar user={user} />
      </div>
    </header>
  );
};
export default HeaderCustomer;
