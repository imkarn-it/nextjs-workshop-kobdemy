import { ShoppingBag } from "lucide-react";
import Link from "next/link";

function CartIcon() {
  return (
    <Link href="/cart" className="md:hidden">
      <ShoppingBag size={20} />
    </Link>
  );
}
export default CartIcon;
