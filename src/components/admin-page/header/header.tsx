"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSignout } from "@/hooks/use-signout";
import { useSidebar } from "@/providers/Sidebar";
import { UserType } from "@/types/user";
import { Menu } from "lucide-react";
import Link from "next/link";

interface HeaderAdminProps {
  user: UserType;
}

const HeaderAdmin = ({ user }: HeaderAdminProps) => {
  const { toggleSidebar } = useSidebar();
  const { isPending, handleSignout } = useSignout();
  return (
    <header className="fixed top-0 inset-x-0 md:left-64 h-16 bg-card border-b z-10 transition-all duration-200">
      <div className="flex items-center justify-between h-full px-4">
        {/* Toggle Sidebar Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={toggleSidebar}
        >
          <Menu size={20} />
        </Button>

        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Avatar>
                <AvatarImage
                  src={user.picture || undefined}
                  alt={user.name || "User"}
                />
                <AvatarFallback className="text-primary-foreground bg-primary">
                  {user.name
                    ? user.name.slice(0, 2).toUpperCase()
                    : user.email.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link className="w-full" href="/my-profile">
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer bg-primary text-primary-foreground"
              disabled={isPending}
              onClick={handleSignout}
            >
              Signout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
export default HeaderAdmin;
