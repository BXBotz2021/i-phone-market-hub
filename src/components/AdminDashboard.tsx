
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import ProductGrid from "./ProductGrid";
import ProductForm from "./ProductForm";
import { Product } from "@/lib/types";
import { getAllProducts, addProduct, updateProduct, deleteProduct } from "@/lib/products";

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState("products");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Check if admin is logged in
  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdminLoggedIn") === "true";
    if (!isAdmin) {
      navigate("/admin");
    }
  }, [navigate]);
  
  // Load products
  useEffect(() => {
    setProducts(getAllProducts());
  }, []);
  
  const handleLogout = () => {
    localStorage.removeItem("isAdminLoggedIn");
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
    navigate("/admin");
  };
  
  const handleAddProduct = (productData: Omit<Product, 'id' | 'createdAt'>) => {
    try {
      const newProduct = addProduct(productData);
      setProducts(getAllProducts());
      setShowAddForm(false);
      toast({
        title: "Product added",
        description: `${newProduct.model} was added successfully`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add product",
      });
    }
  };
  
  const handleUpdateProduct = (productData: Omit<Product, 'id' | 'createdAt'>) => {
    if (!editingProduct) return;
    
    try {
      const updated = updateProduct(editingProduct.id, productData);
      if (updated) {
        setProducts(getAllProducts());
        setEditingProduct(null);
        toast({
          title: "Product updated",
          description: `${updated.model} was updated successfully`,
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update product",
      });
    }
  };
  
  const handleDeleteProduct = (productId: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        const result = deleteProduct(productId);
        if (result) {
          setProducts(getAllProducts());
          toast({
            title: "Product deleted",
            description: "Product was deleted successfully",
          });
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to delete product",
        });
      }
    }
  };
  
  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setActiveTab("edit");
  };
  
  const handleCancelEdit = () => {
    setEditingProduct(null);
    setShowAddForm(false);
    setActiveTab("products");
  };
  
  const featuredProducts = products.filter(p => p.featured);
  const outOfStockProducts = products.filter(p => !p.inStock);
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Admin Dashboard</h2>
        <Button variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{products.length}</CardTitle>
            <CardDescription>Total Products</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{featuredProducts.length}</CardTitle>
            <CardDescription>Featured Products</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{outOfStockProducts.length}</CardTitle>
            <CardDescription>Out of Stock</CardDescription>
          </CardHeader>
        </Card>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="products">All Products</TabsTrigger>
            <TabsTrigger value="add" onClick={() => setShowAddForm(true)}>Add Product</TabsTrigger>
            {editingProduct && (
              <TabsTrigger value="edit">Edit Product</TabsTrigger>
            )}
          </TabsList>
          
          {activeTab === "products" && (
            <Button className="bg-iphone-blue hover:bg-iphone-blue/90" onClick={() => {
              setShowAddForm(true);
              setActiveTab("add");
            }}>
              Add New Product
            </Button>
          )}
        </div>
        
        <TabsContent value="products" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Product Inventory</CardTitle>
              <CardDescription>
                Manage your iPhone products here. Click on a product to edit or delete it.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProductGrid 
                products={products}
                showAdminControls={true}
                onEditProduct={handleEditProduct}
                onDeleteProduct={handleDeleteProduct}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="add" className="mt-4">
          {showAddForm && (
            <ProductForm
              onSubmit={handleAddProduct}
              onCancel={handleCancelEdit}
            />
          )}
        </TabsContent>
        
        <TabsContent value="edit" className="mt-4">
          {editingProduct && (
            <ProductForm
              product={editingProduct}
              onSubmit={handleUpdateProduct}
              onCancel={handleCancelEdit}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
