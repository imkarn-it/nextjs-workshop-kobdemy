import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { ProductType } from "@/types/product";
import {
  Eye,
  MoreVertical,
  Pencil,
  Plus,
  RefreshCcw,
  Search,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface ProductListProps {
  products: ProductType[];
}

const ProductList = async ({ products }: ProductListProps) => {
  return (
    <>
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-lg sm:text-xl">Products</CardTitle>
            <Button className="mb-4" asChild>
              <Link href="/back-office/products/new">
                <Plus size={15} />
                <span>Add Product</span>
              </Link>
            </Button>
          </div>

          <Tabs>
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="inactive">Inactive</TabsTrigger>
              <TabsTrigger value="low-stock">Low Stock</TabsTrigger>
            </TabsList>

            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-4">
              <div className="flex gap-2">
                <Badge variant="outline" className="sm:px-3 py-1">
                  <span className="font-semibold text-blue-600">
                    {products.length}
                  </span>
                  Total
                </Badge>
                <Badge variant="outline" className="sm:px-3 py-1">
                  <span className="font-semibold text-green-600">
                    {products.filter((p) => p.status === "Active").length}
                  </span>
                  Active
                </Badge>
                <Badge variant="outline" className="sm:px-3 py-1">
                  <span className="font-semibold text-gray-500">
                    {products.filter((p) => p.status === "Inactive").length}
                  </span>
                  Inactive
                </Badge>
                <Badge variant="outline" className="sm:px-3 py-1">
                  <span className="font-semibold text-amber-600">
                    {
                      products.filter(
                        (p) => p.stock < p.lowStock && p.status === "Active"
                      ).length
                    }
                  </span>
                  Low Stock
                </Badge>
              </div>

              <div className="relative w-full sm:w-50 lg:w-64">
                <Search
                  size={16}
                  className="absolute left-2 top-2.5 text-muted-foreground"
                />
                <Input className="pl-8" placeholder="Search products..." />
              </div>
            </div>
          </Tabs>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Product Name</TableHead>
                <TableHead>Catagory</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length > 0 ? (
                products.map((p, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Image
                        alt={p.title}
                        src={p.mainImage || "/images/no-product-image.webp"}
                        width={40}
                        height={40}
                        className="object-cover rounded-md"
                        style={{ width: "auto", height: "auto" }} // Maintain aspect ratio
                      />
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{p.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {p.sku}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{p.catagory.name}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-medium">
                        {p.price.toLocaleString()}
                      </div>
                      {p.basePrice !== p.price && (
                        <div className="text-xs line-through text-muted-foreground">
                          200.00
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div
                        className={cn("text-sm", {
                          "text-red-500": p.stock < p.lowStock,
                          "text-green-500": p.stock > p.lowStock,
                        })}
                      >
                        {p.stock}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          p.status === "Active" ? "default" : "destructive"
                        }
                      >
                        {p.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8"
                          >
                            <MoreVertical size={16} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye size={15} />
                            <span>View</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Pencil size={15} />
                            <span>Edit</span>
                          </DropdownMenuItem>

                          <DropdownMenuSeparator />
                          {p.status === "Active" ? (
                            <DropdownMenuItem>
                              <Trash2 className="text-destructive" size={15} />
                              <span className="text-destructive">Delete</span>
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem>
                              <RefreshCcw
                                className="text-green-600"
                                size={15}
                              />
                              <span className="text-green-600">Active</span>
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center text-muted-foreground"
                  >
                    No products found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
};
export default ProductList;
