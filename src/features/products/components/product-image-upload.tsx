"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ProductImage } from "@prisma/client";
import { ImagePlus, Plus, Star, Trash2 } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

interface ProductImageUplaodProps {
  onImageChange: (
    imageFiles: File[],
    mainIndex: number,
    deleteImageIds?: string[]
  ) => void;
  existingImages?: ProductImage[];
}

const ProductImageUplaod = ({
  onImageChange,
  existingImages = [],
}: ProductImageUplaodProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [seletedImages, setSelectedImages] = useState<File[]>([]);

  const [existingImagesState, setExistingImagesState] =
    useState(existingImages);

  const [deleteImageIds, setDeleteImageIds] = useState<string[]>([]);
  const [initianMainImage, setInitianMainImage] = useState(false);

  const notifyToParent = useCallback(() => {
    onImageChange(seletedImages, mainImageIndex, deleteImageIds);
  }, [seletedImages, mainImageIndex, deleteImageIds, onImageChange]);

  useEffect(() => {
    if (existingImagesState.length > 0 && !initianMainImage) {
      const mainIndex = existingImagesState.findIndex((image) => image.isMain);
      if (mainIndex >= 0) {
        setMainImageIndex(mainIndex);
        setInitianMainImage(true);
      }
    }

    notifyToParent();
  }, [existingImagesState, notifyToParent, initianMainImage]);

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (files.length === 0) return;

    //Filter Image Type
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));

    if (imageFiles.length === 0) return;

    //Create Preview Urls
    const newPreviewUrls = imageFiles.map((file) => URL.createObjectURL(file));

    setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);
    setSelectedImages((prev) => [...prev, ...imageFiles]);

    if (
      existingImagesState.length === 0 &&
      seletedImages.length === 0 &&
      imageFiles.length > 0
    ) {
      setMainImageIndex(0);
    }

    // Reset Input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSetMainIndex = (index: number, isExiting = false) => {
    if (isExiting) {
      setMainImageIndex(index);
    } else {
      setMainImageIndex(existingImagesState.length + index);
    }
  };

  const handleDeleteImage = (index: number, isExiting = false) => {
    if (isExiting) {
      const imageToRemove = existingImagesState[index];
      setDeleteImageIds((prev) => [...prev, imageToRemove.id]);
      setExistingImagesState(existingImagesState.filter((_, i) => i !== index));

      if (mainImageIndex === index) {
        if (existingImagesState.length > 0) {
          setMainImageIndex(0);
        } else if (seletedImages.length > 0) {
          setMainImageIndex(0);
        } else {
          setMainImageIndex(-1);
        }
      } else if (mainImageIndex > index) {
        setMainImageIndex((prev) => prev - 1);
      }
    } else {
      URL.revokeObjectURL(previewUrls[index]);
      setPreviewUrls(previewUrls.filter((_, i) => i !== index));
      setSelectedImages(seletedImages.filter((_, i) => i !== index));

      const actualRemoveIndex = existingImagesState.length + index;

      if (mainImageIndex === actualRemoveIndex) {
        if (existingImagesState.length > 0) {
          setMainImageIndex(0);
        } else if (seletedImages.length > 0) {
          setMainImageIndex(0);
        } else {
          setMainImageIndex(-1);
        }
      } else if (mainImageIndex > actualRemoveIndex) {
        setMainImageIndex((prev) => prev - 1);
      }
    }
  };

  const isMainImage = (index: number, isExiting: boolean) => {
    const actualIndex = isExiting ? index : existingImagesState.length + index;
    return mainImageIndex === actualIndex;
  };

  return (
    <div className="flex flex-col gap-2">
      <Label>
        Product Images <span className="text-red-500">*</span>
      </Label>

      {/* Preview Images Area */}
      {(existingImagesState?.length > 0 || previewUrls.length > 0) && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
          {/* Existing Preview */}
          {existingImagesState.map((image, index) => (
            <div
              key={`existing-${index}`}
              className={cn(
                "relative aspect-square group border rounded-md overflow-hidden",
                {
                  "ring-2 ring-primary": isMainImage(index, true),
                }
              )}
            >
              <Image
                alt={`Product Preview ${index + 1}`}
                src={image.url}
                className="object-cover"
                fill
              />

              {/* Main Image Badge */}
              {isMainImage(index, true) && (
                <Badge className="absolute top-1 left-1">Main</Badge>
              )}

              {/* Image Cintrol Overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute top-1 right-1 flex items-center gap-1">
                <Button
                  type="button"
                  variant="secondary"
                  className="size-6 sm:size-8 rounded-full"
                  onClick={() => handleSetMainIndex(index, true)}
                >
                  <Star
                    size={16}
                    className={cn({
                      "fill-amber-400 text-amber-400": isMainImage(index, true),
                    })}
                  />
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  className="size-6 sm:size-8 rounded-full"
                  onClick={() => handleDeleteImage(index, true)}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          ))}

          {previewUrls.map((url, index) => (
            <div
              key={`new-${index}`}
              className={cn(
                "relative aspect-square group border rounded-md overflow-hidden",
                {
                  "ring-2 ring-primary": isMainImage(index, false),
                }
              )}
            >
              <Image
                alt={`Product Preview ${index + 1}`}
                src={url}
                className="object-cover"
                fill
              />

              {/* Main Image Badge */}
              {isMainImage(index, false) && (
                <Badge className="absolute top-1 left-1">Main</Badge>
              )}

              {/* Image Cintrol Overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute top-1 right-1 flex items-center gap-1">
                <Button
                  type="button"
                  variant="secondary"
                  className="size-6 sm:size-8 rounded-full"
                  onClick={() => handleSetMainIndex(index)}
                >
                  <Star
                    size={16}
                    className={cn({
                      "fill-amber-400 text-amber-400": isMainImage(
                        index,
                        false
                      ),
                    })}
                  />
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  className="size-6 sm:size-8 rounded-full"
                  onClick={() => handleDeleteImage(index)}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          ))}
          {/* Add More Image */}
          <div
            className="hover:bg-muted transition-colors aspect-square border rounded-md flex items-center justify-center cursor-pointer"
            onClick={triggerFileInput}
          >
            <div className="flex flex-col items-center gap-1 text-muted-foreground">
              <Plus size={24} />
              <span className="text-xs">Add More Image</span>
            </div>
          </div>
        </div>
      )}

      {existingImagesState.length === 0 && previewUrls.length === 0 && (
        <div
          onClick={triggerFileInput}
          className="border rounded-md p-8 flex flex-col gap-2 items-center 
        justify-center cursor-pointer hover:bg-muted transition-colors"
        >
          <ImagePlus size={40} />
          <Button type="button" variant="secondary" size="sm">
            Browse File
          </Button>
        </div>
      )}
      <input
        onChange={(e) => handleFileChange(e)}
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        className="hidden"
      />
    </div>
  );
};
export default ProductImageUplaod;
