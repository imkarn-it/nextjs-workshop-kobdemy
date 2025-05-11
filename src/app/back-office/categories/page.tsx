import { Badge } from "@/components/ui/badge";
import CategoriesForm from "@/features/categories/components/category-form";
import CategoryList from "@/features/categories/components/category-list";
import { getCategories } from "@/features/categories/db/categories";

const CategoriesAdminPage = async () => {
  const categories = await getCategories();

  const activeCategories = categories.filter(
    (c) => c.status === "Active"
  ).length;

  const inActiveCategories = categories.filter(
    (c) => c.status === "Inactive"
  ).length;

  return (
    <div className="p-4 sm:p-6 space-y-4">
      {/* Categories Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl sm:text-3xl font-bold">
            Category Management
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your categories here. You can add, edit, or delete
            categories.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 sm:gap-3">
          <Badge
            variant="outline"
            className="px-2 sm:px-3 py-1 text-xs sm:text-sm"
          >
            <span className="font-semibold text-green-700">
              {activeCategories}
            </span>
            Active
          </Badge>

          <Badge
            variant="outline"
            className="px-2 sm:px-3 py-1 text-xs sm:text-sm"
          >
            <span className="font-semibold text-red-400">
              {inActiveCategories}
            </span>
            Inactive
          </Badge>

          <Badge
            variant="outline"
            className="px-2 sm:px-3 py-1 text-xs sm:text-sm"
          >
            <span className="font-semibold text-violet-500">
              {categories.length}
            </span>
            Total
          </Badge>
        </div>
      </div>

      {/* Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        <div className="lg:col-span-1">
          <CategoriesForm />
        </div>

        {/* List */}
        <div className="lg:col-span-2">
          <CategoryList categories={categories} />
        </div>
      </div>
    </div>
  );
};
export default CategoriesAdminPage;
