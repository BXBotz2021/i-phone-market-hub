import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Product } from "@/lib/types";

interface ProductFormProps {
  product?: Product;
  onSubmit: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

const INITIAL_PRODUCT = {
  model: "",
  variant: "Standard",
  storage: "128GB",
  color: "Black",
  condition: "Excellent" as const,
  price: 0,
  description: "",
  images: [],
  inStock: true,
  featured: false
};

const CONDITIONS = ["New", "Excellent", "Good", "Fair"];

const STORAGE_OPTIONS = [
  "32GB", "64GB", "128GB", "256GB", "512GB", "1TB"
];

export default function ProductForm({ product, onSubmit, onCancel }: ProductFormProps) {
  const isEditing = !!product;
  const [formData, setFormData] = useState<Omit<Product, 'id' | 'createdAt'>>(
    isEditing ? 
      {
        model: product.model,
        variant: product.variant,
        storage: product.storage,
        color: product.color,
        condition: product.condition,
        price: product.price,
        description: product.description,
        images: [...product.images],
        inStock: product.inStock,
        featured: product.featured || false
      } : 
      INITIAL_PRODUCT
  );

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "price" ? parseFloat(value) || 0 : value
    }));
  };
  
  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleUpload = async () => {
    if (!imageFile) {
      alert("Please select an image file first!");
      return;
    }

    setIsUploading(true);
    
    try {
      const uploadFormData = new FormData();
      uploadFormData.append("image", imageFile);

      const res = await fetch("/api/upload-image", {
        method: "POST",
        body: uploadFormData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      const uploadedImageUrl = data.url;

      setFormData(prev => ({
        ...prev,
        images: [...prev.images, uploadedImageUrl]
      }));

      setImageFile(null);
    } catch (err) {
      console.error("Upload error:", err);
      alert("Image upload error: " + (err instanceof Error ? err.message : "Unknown error"));
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{isEditing ? "Edit Product" : "Add New Product"}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="model">Model*</Label>
              <Input
                id="model"
                name="model"
                placeholder="iPhone 14 Pro"
                value={formData.model}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="variant">Variant</Label>
              <Select 
                value={formData.variant}
                onValueChange={(value) => handleSelectChange("variant", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select variant" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Standard">Standard</SelectItem>
                  <SelectItem value="Mini">Mini</SelectItem>
                  <SelectItem value="Pro">Pro</SelectItem>
                  <SelectItem value="Pro Max">Pro Max</SelectItem>
                  <SelectItem value="Plus">Plus</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="storage">Storage</Label>
              <Select 
                value={formData.storage}
                onValueChange={(value) => handleSelectChange("storage", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select storage" />
                </SelectTrigger>
                <SelectContent>
                  {STORAGE_OPTIONS.map(option => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="color">Color*</Label>
              <Input
                id="color"
                name="color"
                placeholder="Midnight"
                value={formData.color}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="condition">Condition</Label>
              <Select 
                value={formData.condition}
                onValueChange={(value: any) => handleSelectChange("condition", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  {CONDITIONS.map(condition => (
                    <SelectItem key={condition} value={condition}>{condition}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="price">Price* ($)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                placeholder="999.99"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe the condition, included accessories, etc."
              value={formData.description}
              onChange={handleChange}
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Product Images</Label>
            <div className="flex flex-wrap gap-2">
              {formData.images.map((image, index) => (
                <div key={index} className="relative group">
                  <img 
                    src={image} 
                    alt={`Product ${index + 1}`}
                    className="h-20 w-20 object-cover rounded border"
                  />
                  <Button 
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleRemoveImage(index)}
                  >
                    ✕
                  </Button>
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-2 items-center">
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleFileChange} 
                className="hidden" 
                id="image-upload"
              />
              <Label 
                htmlFor="image-upload" 
                className="px-4 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-md text-sm font-medium cursor-pointer"
              >
                Choose File
              </Label>
              {imageFile && (
                <span className="text-sm text-muted-foreground">
                  {imageFile.name}
                </span>
              )}
              <Button
                type="button"
                onClick={handleUpload}
                variant="secondary"
                disabled={!imageFile || isUploading}
              >
                {isUploading ? "Uploading..." : "Upload"}
              </Button>
            </div>
          </div>
          
          <div className="flex flex-col gap-4">
            <div className="flex items-center space-x-2">
              <Switch 
                id="inStock" 
                checked={formData.inStock}
                onCheckedChange={(checked) => handleSwitchChange("inStock", checked)}
              />
              <Label htmlFor="inStock">In Stock</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="featured" 
                checked={formData.featured}
                onCheckedChange={(checked) => handleSwitchChange("featured", checked)}
              />
              <Label htmlFor="featured">Featured Product</Label>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" className="bg-iphone-blue hover:bg-iphone-blue/90">
            {isEditing ? "Update Product" : "Add Product"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
