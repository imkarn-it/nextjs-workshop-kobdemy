import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserType } from "@/types/user";
import Link from "next/link";
import {
  SignoutButton,
  UserAvatarSmall,
  UserDropDownAvatar,
} from "./user-comp";

interface DesktopUserMenuProps {
  user: UserType;
}

const DesktopUserMenu = ({ user }: DesktopUserMenuProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="size-8 rounded-full">
          <UserAvatarSmall user={user}></UserAvatarSmall>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" sideOffset={4}>
        <DropdownMenuLabel className="flex flex-col items-center gap-2">
          <UserDropDownAvatar user={user} />
          <span>สวัสดี, {user.name || user.email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer" asChild>
          <Link href="/my-profile">โปรไฟล์ของฉัน</Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" asChild>
          <Link href="/my-cart">
            <span>ตะกร้าของฉัน</span> <Badge className="ml-auto">0</Badge>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" asChild>
          <Link href="/my-order">ประวัติการสั่งซื้อ</Link>
        </DropdownMenuItem>
        {user && user.role === "Admin" && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer" asChild>
              <Link href="/back-office">หลังบ้าน</Link>
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator />
        <div>
          <SignoutButton />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export default DesktopUserMenu;
