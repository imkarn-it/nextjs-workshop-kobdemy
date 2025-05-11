import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { UserType } from "@/types/user";
import { AuthButton, SignoutButton, UserAvatar } from "./user-comp";
import { MobileNavLinks } from "./nav-link";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";

interface MobileMenuProps {
  user: UserType | null;
}

const MobileMenu = ({ user }: MobileMenuProps) => {
  return (
    <Sheet>
      <SheetTrigger className="md:hidden" asChild>
        <Button variant="link" size="icon">
          <Menu size={20} />
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="flex flex-col w-full md:max-w-sm">
        <SheetHeader>
          <SheetTitle className="text-primary text-xl">
            {user ? "โปรไฟล์ของคุณ" : "ยินดีต้อนรับ"}
          </SheetTitle>
        </SheetHeader>
        <div className="flex-1 flex flex-col gap-6">
          {/* User Profile && Auth Btn */}
          {user ? <UserAvatar user={user} /> : <AuthButton />}

          <Separator />

          <div className="px-4">
            <ScrollArea type="always" className="h-48 sm:h-60 w-full">
              {/* Nav Link */}
              <MobileNavLinks />

              {/* Go to Admin Page*/}
              {user && user.role === "Admin" && (
                <div className="mt-4">
                  <Separator className="mb-4" />
                  <Button
                    variant="secondary"
                    size="lg"
                    className="w-full"
                    asChild
                  >
                    <Link href="/back-office">หน้าหลังบ้าน</Link>
                  </Button>
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
        {user && (
          <SheetFooter>
            <SignoutButton isMobile />
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
};
export default MobileMenu;
