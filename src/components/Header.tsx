
import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, Search, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Link } from "react-router-dom";

interface HeaderProps {
  onSearch?: (query: string) => void;
}

export default function Header({ onSearch }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) onSearch(searchQuery);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-background backdrop-blur border-b">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2 md:gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="ghost" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px] sm:w-[300px]">
              <nav className="flex flex-col gap-4 py-6">
                <Link to="/" className="text-lg font-medium">HOME</Link>
                <Link to="/#featured" className="text-lg font-medium">FEATURED</Link>
                <Link to="/#all-products" className="text-lg font-medium">ALL PRODUCTS</Link>
                <Link to="/admin" className="text-lg font-medium text-muted-foreground">ADMIN LOGIN</Link>
              </nav>
            </SheetContent>
          </Sheet>
          <Link to="/" className="flex items-center">
          <img src="/logo.png" alt="STORE LOGO" className="h-16" />
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link to="/" className="font-medium transition-colors hover:text-foreground/80">HOME</Link>
            <Link to="/#featured" className="font-medium transition-colors hover:text-foreground/80">FEATURED</Link>
            <Link to="/#all-products" className="font-medium transition-colors hover:text-foreground/80">ALL PRODUCTS</Link>
          </nav>
        </div>
        
        <div className="flex items-center gap-2">
          <form onSubmit={handleSearch} className="hidden md:flex">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="w-[200px] pl-8 md:w-[250px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>
          <Link to="/admin" className="hidden md:block text-sm text-muted-foreground hover:text-primary">Admin</Link>
        </div>
      </div>
    </header>
  );
}
