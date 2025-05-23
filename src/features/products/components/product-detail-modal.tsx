import Model from "@/components/shared/model";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductType } from "@/types/product";
import {
  Clock,
  DollarSign,
  FileText,
  ImageIcon,
  Package,
  ShoppingBag,
  Tag,
} from "lucide-react";
import Image from "next/image";
import dayjs from "@/lib/dayjs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatPrice } from "@/lib/formatPrice";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ProductDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: ProductType | null;
}

const ProductDetailModal = ({
  open,
  onOpenChange,
  product,
}: ProductDetailModalProps) => {
  if (!product) return null;

  const formattedDate = dayjs(product.created).fromNow();
  const stockColor = (() => {
    switch (true) {
      case product.stock <= 0:
        return "text-red-600";
      case product.stock <= product.lowStock:
        return "text-amber-500";
      default:
        return "text-green-600";
    }
  })();

  const stockStatus = (() => {
    switch (true) {
      case product.stock <= 0:
        return "Out of Stock";
      case product.stock <= product.lowStock:
        return "Low Stock";
      default:
        return "In Stock";
    }
  })();

  const discountPercentage = (() => {
    if (product.basePrice > product.price) {
      return (
        ((product.basePrice - product.price) / product.basePrice) *
        100
      ).toFixed(2);
    }
    return "0";
  })();

  const profitPerUnit = product.cost > 0 ? product.price - product.cost : 0;
  const profitMargin =
    product.cost > 0
      ? ((profitPerUnit / product.cost) * 100).toFixed(2)
      : "N/A";

  return (
    <Model
      open={open}
      onOpenChange={onOpenChange}
      title={product.title || ""}
      description={`SKU : ${product.sku}`}
      className="md:max-w-3xl"
    >
      <div>
        <Tabs>
          <TabsList className="grid  grid-cols-3 mb-4 w-full">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="images">{`Images (${
              product.images?.length || 0
            })`}</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <ScrollArea className="max-h-[500px] overflow-y-auto">
              <Card className="mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 px-4 gap-4">
                  {/* Main Image */}
                  <div className="relative aspect-square border rounded-md overflow-hidden group">
                    <Image
                      alt={product.title}
                      src={
                        product.mainImage?.url ||
                        "/images/no-product-image.webp"
                      }
                      className="object-cover transition-transform group-hover:scale-105 duration-300"
                      fill
                    />
                  </div>

                  {/* Product Info */}
                  <div className="p-4 flex flex-col">
                    <div className="mb-2 flex items-center justify-between">
                      <Badge
                        variant={
                          product.status === "Active"
                            ? "default"
                            : "destructive"
                        }
                      >
                        {product.status}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="flex items-center gap-1"
                      >
                        <Tag size={15} />
                        {product.catagory.name}
                      </Badge>
                    </div>

                    <h2 className="text-xl font-bold line-clamp-2">
                      {product.title}
                    </h2>

                    <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                      <Clock size={12} />
                      <span>Added : {formattedDate}</span>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-1">
                        <Package size={14} />
                        <span className={`text-sm font-medium ${stockColor}`}>
                          {stockStatus}
                        </span>
                      </div>

                      <span className="text-sm text-muted-foreground">
                        ({product.stock} items left)
                      </span>
                    </div>

                    <div className="mt-auto">
                      <div className="flex flex-wrap items-baseline gap-2 mb-1">
                        <span>{formatPrice(product.price)}</span>
                        {product.basePrice > product.price && (
                          <div className="flex items-center gap-1">
                            <span className="text-sm line-through text-muted-foreground">
                              {formatPrice(product.basePrice)}
                            </span>
                            <Badge variant="secondary" className="text-xs">
                              {discountPercentage}% off
                            </Badge>
                          </div>
                        )}
                      </div>

                      {product.cost > 0 && (
                        <div className="flex gap-2 text-xs text-muted-foreground">
                          <span>Cost : {formatPrice(product.cost)}</span>
                          <span>•</span>
                          <span>
                            Profit : {formatPrice(profitPerUnit)} (
                            {profitMargin}%)
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <h3 className="text-sm font-semibold mb-2">
                    Sales Statistics
                  </h3>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex flex-col items-center justify-center bg-muted rounded-md p-2">
                      <ShoppingBag className="text-primary mb-1" size={20} />
                      <span className="font-bold">{product.sold}</span>
                      <span className="text-xs text-muted-foreground">
                        Sales
                      </span>
                    </div>
                    <div className="flex flex-col items-center justify-center bg-muted rounded-md p-2">
                      <DollarSign className="text-emerald-500 mb-1" size={20} />
                      <span className="font-bold">
                        {formatPrice(product.sold * product.price)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Income
                      </span>
                    </div>
                    <div className="flex flex-col items-center justify-center bg-muted rounded-md p-2">
                      <FileText className="text-emerald-500 mb-1" size={20} />
                      <span className="font-bold">
                        {product.cost > 0
                          ? formatPrice(
                              product.sold * (product.price - product.cost)
                            )
                          : "N/A"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Profit
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ScrollArea>
          </TabsContent>
          <TabsContent value="details">
            <ScrollArea className="max-h-[500px] overflow-y-auto">
              <Card className="break-all">
                <CardContent className="space-y-4">
                  <div className="flex flex-col gap-2">
                    <h3 className="text-sm font-semibold">Product Details</h3>
                    <p className="text-sm text-muted-foreground">
                      {product.description}
                    </p>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-sm font-semibold mb-2">
                      Specific information
                    </h3>

                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <h2 className="text-muted-foreground">SKU</h2>
                        <p className="font-medium">{product.sku}</p>
                      </div>
                      <div>
                        <h2 className="text-muted-foreground">Catagory</h2>
                        <p className="font-medium">{product.catagory.name}</p>
                      </div>
                      <div>
                        <h2 className="text-muted-foreground">Status</h2>
                        <Badge
                          variant={
                            product.status === "Active"
                              ? "default"
                              : "destructive"
                          }
                        >
                          {product.status}
                        </Badge>
                      </div>
                      <div>
                        <h2 className="text-muted-foreground">Stock</h2>
                        <p className={`font-medium ${stockColor}`}>
                          {product.stock}
                        </p>
                      </div>
                      <div>
                        <h2 className="text-muted-foreground">Base Price</h2>
                        <p className="font-medium">
                          {formatPrice(product.basePrice)}
                        </p>
                      </div>
                      <div>
                        <h2 className="text-muted-foreground">Sale Price</h2>
                        <p className="font-medium">
                          {formatPrice(product.price)}
                        </p>
                      </div>
                      <div>
                        <h2 className="text-muted-foreground">Discount</h2>
                        <p className="font-medium">{discountPercentage}%</p>
                      </div>
                      <div>
                        <h2 className="text-muted-foreground">Create at</h2>
                        <p className="font-medium">
                          {dayjs(product.created).format("ll")}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="text-sm font-semibold mb-2">
                      Sales information
                    </h4>

                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Total Sales</TableHead>
                          <TableHead>Income</TableHead>
                          <TableHead>Cost</TableHead>
                          <TableHead>Profit</TableHead>
                        </TableRow>
                      </TableHeader>

                      <TableBody>
                        <TableRow>
                          <TableCell>{product.sold} items</TableCell>
                          <TableCell>
                            {formatPrice(product.sold * product.price)}
                          </TableCell>
                          <TableCell>
                            {formatPrice(product.sold * product.cost)}
                          </TableCell>
                          <TableCell>
                            {formatPrice(
                              product.sold * (product.price - product.cost)
                            )}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </ScrollArea>
          </TabsContent>
          <TabsContent value="images">
            <ScrollArea className="max-h-[500px] overflow-y-auto">
              <Card>
                <CardContent>
                  <h3 className="text-sm font-semibold mb-3">
                    All Images ({product.images?.length || 0} photos)
                  </h3>

                  {product.images && product.images?.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {product.images?.map((image, index) => {
                        return (
                          <div
                            className="relative aspect-square border rounded-md overflow-hidden cursor-pointer group"
                            key={index}
                          >
                            <Image
                              alt={`Product Image ${index + 1}`}
                              src={image.url}
                              fill
                              className="object-cover transition-transform group-hover:scale-105 duration-300"
                            />
                            {image.isMain && (
                              <Badge className="absolute top-1 left-1 text-[10px] z-10">
                                Main
                              </Badge>
                            )}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-10 bg-muted/50 rounded-md">
                      <ImageIcon
                        className="text-muted-foreground mb-2 opacity-40"
                        size={40}
                      />
                      <p className="text-sm text-muted-foreground">
                        No images found
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </Model>
  );
};
export default ProductDetailModal;
