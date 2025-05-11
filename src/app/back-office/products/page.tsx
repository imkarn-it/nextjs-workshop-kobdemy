import ProductList from "@/features/products/components/product-list";
import { getProducts } from "@/features/products/db/products";

const ProductsAdminPage = async () => {
  const products = await getProducts();
  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Products Header */}
      <div
        className="flex flex-col md:flex-row justify-between items-start md:items-center
      gap-4 pb-6 border-b"
      >
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl sm:text-3xl font-bold">
            Products Management
          </h1>
          <p className="text-muted-foreground text-sm">
            Manage your products here. You can add, edit, or delete products.
          </p>
        </div>
        <div>New Product</div>
      </div>

      {/* Products Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        <div className="lg:col-span-3 ">
          <ProductList products={products} />
        </div>
      </div>
    </div>
  );
};
export default ProductsAdminPage;
