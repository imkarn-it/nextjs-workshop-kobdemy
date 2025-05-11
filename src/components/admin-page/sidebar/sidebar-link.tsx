import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface SlidebarLinkProps {
  label: string;
  href: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClose: () => void;
}

const SlidebarLink = ({
  label,
  href,
  icon,
  isActive,
  onClose,
}: SlidebarLinkProps) => {
  return (
    <Button
      onClick={onClose}
      variant={isActive ? "secondary" : "ghost"}
      asChild
    >
      <Link
        className={cn(
          "w-full justify-start gap-3",
          isActive
            ? "font-semibold"
            : "text-muted-foreground hover:text-foreground"
        )}
        href={href}
      >
        {icon} <span>{label}</span>
      </Link>
    </Button>
  );
};
export default SlidebarLink;
