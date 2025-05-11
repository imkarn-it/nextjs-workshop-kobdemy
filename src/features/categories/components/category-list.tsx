"use client";

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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CatagoryType } from "@/types/catagory";
import { MoreVertical, Pencil, RefreshCcw, Search, Trash } from "lucide-react";
import EditCategoryModel from "./edit-category-model";
import { useEffect, useState } from "react";
import DeleteCatagoryModal from "./delete-catagory-modal";
import ActiveCatagoryModal from "./active-catagory-modal";

interface CategoryListProps {
  categories: CatagoryType[];
}

const CategoryList = ({ categories }: CategoryListProps) => {
  // State for modals
  const [isEditModel, setIsEditModel] = useState(false);
  const [isDeleteModel, setIsDeleteModel] = useState(false);
  const [isActiveModel, setIsActiveModel] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CatagoryType | null>(
    null
  );

  const [activeTab, setActiveTab] = useState("all");
  const [filterCatagory, setFilterCatagory] =
    useState<CatagoryType[]>(categories);

  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    let result = [...categories];
    if (activeTab === "active") {
      result = result.filter((catagory) => catagory.status === "Active");
    } else if (activeTab === "inactive") {
      result = result.filter((catagory) => catagory.status === "Inactive");
    }

    if (searchValue) {
      result = result.filter((catagory) =>
        catagory.name.toLowerCase().includes(searchValue.toLowerCase())
      );
    }

    setFilterCatagory(result);
  }, [categories, activeTab, searchValue]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
  };

  // Filter categories based on the active tab
  const handleTabActive = (value: string) => {
    setActiveTab(value);
  };

  const handleOpenEditModel = (catagory: CatagoryType) => {
    setSelectedCategory(catagory);
    setIsEditModel(true);
  };

  const handleOpenDeleteModel = (catagory: CatagoryType) => {
    setSelectedCategory(catagory);
    setIsDeleteModel(true);
  };

  const handleOpenActiveModel = (catagory: CatagoryType) => {
    setSelectedCategory(catagory);
    setIsActiveModel(true);
  };

  return (
    <>
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg sm:text-xl">Category List</CardTitle>
          <Tabs value={activeTab} onValueChange={handleTabActive}>
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="all">All Category</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="inactive">Inactive</TabsTrigger>
            </TabsList>
            <div className="relative">
              <Search
                className="absolute top-2.5 left-2 text-muted-foreground"
                size={16}
              />
              <Input
                value={searchValue}
                onChange={handleSearch}
                className="pl-8"
                placeholder="Search Category..."
              />
            </div>
          </Tabs>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md overflow-hidden">
            <div className="grid grid-cols-12 bg-muted px-2 py-3 sm:px-4 text-xs sm:text-sm font-medium">
              <div className="col-span-1 hidden sm:block">No.</div>
              <div className="col-span-6 sm:col-span-5">Category Name</div>
              <div className="col-span-2 text-center hidden sm:block">
                Products
              </div>
              <div className="col-span-3 sm:col-span-2 text-center">Status</div>
              <div className="col-span-3 sm:col-span-2 text-right">Actions</div>
            </div>
          </div>

          <ScrollArea className="h-[350px] sm:h-[420px]">
            {filterCatagory.length > 0 ? (
              filterCatagory.map((categorie, index) => {
                return (
                  <div
                    key={index}
                    className="grid grid-cols-12 px-2 py-3 sm:px-4 border-t items-center hover:bg-gray-50
                transition-colors duration-100 text-sm"
                  >
                    <div className="col-span-1 hidden sm:block">
                      {index + 1}
                    </div>
                    <div className="col-span-6 sm:col-span-5 truncate pr-2">
                      {categorie.name}
                    </div>
                    <div className="col-span-2 text-center hidden sm:block">
                      0
                    </div>
                    <div className="col-span-3 sm:col-span-2 text-center">
                      <Badge
                        className="px-1 sm:px-2"
                        variant={
                          categorie.status === "Active"
                            ? "default"
                            : "destructive"
                        }
                      >
                        {categorie.status === "Active" ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <div className="col-span-3 sm:col-span-2 text-right">
                      {/* Mobile Action Button */}
                      <div className="flex justify-end gap-1 md:hidden">
                        <Button
                          onClick={() => handleOpenEditModel(categorie)}
                          className="size-6"
                          variant="ghost"
                          size="icon"
                        >
                          <Pencil size={15} />
                        </Button>
                        {categorie.status === "Active" ? (
                          <Button
                            onClick={() => handleOpenDeleteModel(categorie)}
                            className="size-6"
                            variant="ghost"
                            size="icon"
                          >
                            <Trash size={15} />
                          </Button>
                        ) : (
                          <Button
                            onClick={() => handleOpenActiveModel(categorie)}
                            className="size-6"
                            variant="ghost"
                            size="icon"
                          >
                            <RefreshCcw size={15} />
                          </Button>
                        )}
                      </div>

                      {/* Desktop Action Button */}
                      <div className="hidden md:block">
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
                            <DropdownMenuItem
                              onClick={() => handleOpenEditModel(categorie)}
                            >
                              <Pencil size={16} />
                              <span>Edit</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {categorie.status === "Active" ? (
                              <DropdownMenuItem
                                className="text-destructive hover:!text-destructive/80"
                                onClick={() => handleOpenDeleteModel(categorie)}
                              >
                                <Trash size={16} />
                                <span>Delete</span>
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem
                                className="text-green-600 hover:!text-green-800"
                                onClick={() => handleOpenActiveModel(categorie)}
                              >
                                <RefreshCcw size={16} />
                                <span>Activate</span>
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                No categories found matching your search
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      <EditCategoryModel
        open={isEditModel}
        onOpenChange={setIsEditModel}
        catagory={selectedCategory}
      />

      <DeleteCatagoryModal
        open={isDeleteModel}
        onOpenChange={setIsDeleteModel}
        catagory={selectedCategory}
      />

      <ActiveCatagoryModal
        open={isActiveModel}
        onOpenChange={setIsActiveModel}
        catagory={selectedCategory}
      />
    </>
  );
};
export default CategoryList;
