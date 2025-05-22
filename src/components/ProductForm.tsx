
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
  
  const [imageUrl, setImageUrl] = useState("");

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
  
  const handleAddImage = () => {
    if (imageUrl && !formData.images.includes(imageUrl)) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, imageUrl]
      }));
      setImageUrl("");
    }
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
            <div className="flex gap-2 mt-2">
              <Input
                placeholder="Enter image URL"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
              <Button 
                type="button"
                onClick={handleAddImage}
                variant="secondary"
              >
                Add
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
