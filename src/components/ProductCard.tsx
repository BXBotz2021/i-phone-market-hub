
import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Product } from "@/lib/types";

interface ProductCardProps {
  product: Product;
  showAdminControls?: boolean;
  onEdit?: (product: Product) => void;
  onDelete?: (productId: string) => void;
}

export default function ProductCard({ 
  product, 
  showAdminControls = false,
  onEdit,
  onDelete
}: ProductCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const nextImage = () => {
    if (product.images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "New": return "bg-green-500";
      case "Excellent": return "bg-blue-500";
      case "Good": return "bg-yellow-500";
      case "Fair": return "bg-orange-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <Card className="overflow-hidden h-full flex flex-col transition-all hover:shadow-md">
      <div 
        className="relative aspect-square overflow-hidden bg-muted cursor-pointer"
        onClick={nextImage}
      >
        {product.images.length > 0 ? (
          <img
            src={product.images[currentImageIndex]}
            alt={product.model}
            className="object-cover w-full h-full transition-opacity hover:opacity-90"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
            No image
          </div>
        )}
        
        <div className="absolute top-2 right-2 flex flex-col gap-1">
          {!product.inStock && (
            <Badge variant="destructive">Out of Stock</Badge>
          )}
          {product.featured && (
            <Badge className="bg-iphone-blue">Featured</Badge>
          )}
        </div>
        
        <Badge 
          className={`absolute bottom-2 left-2 ${getConditionColor(product.condition)}`}
        >
          {product.condition}
        </Badge>
      </div>
      
      <CardContent className="pt-4 flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg">{product.model}</h3>
          <span className="font-bold text-lg">${product.price}</span>
        </div>
        
        <div className="flex flex-wrap gap-1 mb-2">
          <Badge variant="outline">{product.color}</Badge>
          <Badge variant="outline">{product.storage}</Badge>
          {product.variant !== "Standard" && (
            <Badge variant="outline">{product.variant}</Badge>
          )}
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-2">
          {product.description}
        </p>
      </CardContent>
      
      <CardFooter className="pt-0">
        {showAdminControls ? (
          <div className="flex gap-2 w-full">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={() => onEdit && onEdit(product)}
            >
              Edit
            </Button>
            <Button 
              variant="destructive" 
              size="sm" 
              className="flex-1"
              onClick={() => onDelete && onDelete(product.id)}
            >
              Delete
            </Button>
          </div>
        ) : (
          <Button className="w-full bg-iphone-blue hover:bg-iphone-blue/90">
            View Details
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
