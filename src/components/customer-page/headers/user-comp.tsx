"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SheetClose } from "@/components/ui/sheet";
import { useSignout } from "@/hooks/use-signout";
import { UserType } from "@/types/user";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserCompProps {
  user: UserType;
}

export const AuthButton = () => (
  <div className="flex justify-center gap-3">
    <Button size="lg" asChild>
      <SheetClose asChild>
        <Link href="/auth/signup">สมัครสมาชิก</Link>
      </SheetClose>
    </Button>
    <Button size="lg" variant="outline" asChild>
      <SheetClose asChild>
        <Link href="/auth/signin">เข้าสู่ระบบ</Link>
      </SheetClose>
    </Button>
  </div>
);

export const SignoutButton = ({ isMobile = false }) => {
  const { isPending, handleSignout } = useSignout();

  if (isMobile) {
    return (
      <SheetClose asChild>
        <Button
          variant="destructive"
          size="lg"
          disabled={isPending}
          onClick={handleSignout}
        >
          ออกจากระบบ
        </Button>
      </SheetClose>
    );
  }

  return (
    <Button
      className="w-full mt-4"
      variant="destructive"
      disabled={isPending}
      onClick={handleSignout}
    >
      ออกจากระบบ
    </Button>
  );
};

export const UserAvatar = ({ user }: UserCompProps) => {
  return (
    <div className="px-4">
      <Card className="border-primary/50">
        <CardContent className="flex flex-col items-center gap-3">
          {/* Picture */}
          <Image
            alt={user.name || "Profile Pic"}
            src={user.picture || "/images/no-user-image.webp"}
            width={128}
            height={128}
            priority
            className="rounded-full border-2 border-primary object-cover"
          />

          {/* Name & Email */}
          <h2 className="text-xl font-semibold">{user.name || user.email}</h2>
        </CardContent>
      </Card>
    </div>
  );
};

export const UserAvatarSmall = ({ user }: UserCompProps) => {
  return (
    <Avatar className="border-2 border-primary">
      <AvatarImage src={user.picture || undefined} alt={user.name || "User"} />
      <AvatarFallback className="text-primary-foreground bg-primary">
        {user.name
          ? user.name.slice(0, 2).toUpperCase()
          : user.email.slice(0, 2).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
};

export const UserDropDownAvatar = ({ user }: UserCompProps) => {
  return (
    <Avatar className="size-16 border-2 border-primary">
      <AvatarImage src={user.picture || undefined} alt={user.name || "User"} />
      <AvatarFallback className="text-lg">
        {user.name
          ? user.name.slice(0, 2).toUpperCase()
          : user.email.slice(0, 2).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
};
