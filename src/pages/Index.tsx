
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import ProductGrid from "@/components/ProductGrid";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Product } from "@/lib/types";
import { getAllProducts } from "@/lib/products";

export default function Index() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [conditionFilter, setConditionFilter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("newest");
  
  // Load products
  useEffect(() => {
    const loadedProducts = getAllProducts();
    setProducts(loadedProducts);
    setFilteredProducts(loadedProducts);
  }, []);
  
  // Apply filters and sorting
  useEffect(() => {
    let result = [...products];
    
    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(product => 
        product.model.toLowerCase().includes(query) ||
        product.color.toLowerCase().includes(query) ||
        product.storage.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
      );
    }
    
    // Apply condition filter
    if (conditionFilter) {
      result = result.filter(product => product.condition === conditionFilter);
    }
    
    // Apply sorting
    switch (sortBy) {
      case "newest":
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
    }
    
    setFilteredProducts(result);
  }, [products, searchQuery, conditionFilter, sortBy]);
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };
  
  const resetFilters = () => {
    setSearchQuery("");
    setConditionFilter(null);
    setSortBy("newest");
  };
  
  const featuredProducts = products.filter(p => p.featured && p.inStock);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header onSearch={handleSearch} />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section
  className="py-16 md:py-24"
  style={{
    backgroundImage: "url('/hero-bg.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  }}
>
  {/* Overlay */}
  <div className="absolute inset-0 bg-black/50"></div>

  <div className="container relative z-10">
    <div className="max-w-2xl mx-auto text-center">
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-white">
        Premium Used iPhones at Affordable Prices
      </h1>
      <p className="text-lg md:text-xl text-white mb-8">
        Certified pre-owned iPhones with warranty and exceptional quality.
      </p>
      <Button 
        className="bg-iphone-blue hover:bg-iphone-blue/90 px-8 py-6 text-lg"
        onClick={() => {
          const element = document.getElementById('all-products');
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }}
      >
        Shop Now
      </Button>
    </div>
  </div>
</section>
        
        {/* Featured Products */}
        {featuredProducts.length > 0 && (
          <section id="featured" className="py-12 bg-white">
            <div className="container">
              <h2 className="text-3xl font-bold mb-8">Featured iPhones</h2>
              <ProductGrid products={featuredProducts} />
            </div>
          </section>
        )}
        
        {/* All Products */}
        <section id="all-products" className="py-12 bg-gray-50">
          <div className="container">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
              <h2 className="text-3xl font-bold">All iPhones</h2>
              
              <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
                <Select value={conditionFilter || ""} onValueChange={(value) => setConditionFilter(value || null)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Conditions</SelectItem>
                    <SelectItem value="New">New</SelectItem>
                    <SelectItem value="Excellent">Excellent</SelectItem>
                    <SelectItem value="Good">Good</SelectItem>
                    <SelectItem value="Fair">Fair</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="price-asc">Price: Low to High</SelectItem>
                    <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button variant="outline" onClick={resetFilters}>
                  Reset
                </Button>
              </div>
            </div>
            
            <ProductGrid products={filteredProducts} />
            
            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium mb-2">No products found</h3>
                <p className="text-muted-foreground mb-4">Try adjusting your search criteria</p>
                <Button variant="outline" onClick={resetFilters}>
                  Reset Filters
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>
      
      <footer className="bg-iphone-dark text-white py-8">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">iPhone Resale Store</h3>
              <p className="text-gray-300">
                Premium used iPhones at affordable prices. 
                All devices are thoroughly tested and come with warranty.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="/" className="text-gray-300 hover:text-white">Home</a></li>
                <li><a href="/#featured" className="text-gray-300 hover:text-white">Featured</a></li>
                <li><a href="/#all-products" className="text-gray-300 hover:text-white">All Products</a></li>
                <li><a href="/admin" className="text-gray-300 hover:text-white">Admin</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">Contact</h3>
              <address className="text-gray-300 not-italic">
                <p>Email: contact@iphoneresale.com</p>
                <p>Phone: (123) 456-7890</p>
              </address>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-700 text-center text-gray-300">
            <p>&copy; {new Date().getFullYear()} iPhone Resale Store. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
