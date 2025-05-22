
import { Product } from "./types";

// Sample data - in a real app this would come from an API
const SAMPLE_PRODUCTS: Product[] = [
  {
    id: "1",
    model: "iPhone 14 Pro",
    variant: "Pro",
    storage: "256GB",
    color: "Deep Purple",
    condition: "Excellent",
    price: 899,
    description: "Nearly flawless condition. Battery health at 96%. Includes original box and accessories.",
    images: [
      "https://images.unsplash.com/photo-1663761879666-f7c519a4b428?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1664491800325-705048bb7742?auto=format&fit=crop&q=80&w=600"
    ],
    inStock: true,
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    model: "iPhone 13",
    variant: "Standard",
    storage: "128GB",
    color: "Midnight",
    condition: "Good",
    price: 599,
    description: "Minor wear on sides. Battery health at 89%. Includes charging cable only.",
    images: [
      "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?auto=format&fit=crop&q=80&w=600",
    ],
    inStock: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    model: "iPhone 15",
    variant: "Standard",
    storage: "512GB",
    color: "Blue",
    condition: "New",
    price: 1199,
    description: "Sealed in box. Full warranty coverage.",
    images: [
      "https://images.unsplash.com/photo-1695048133142-1a20484689ff?auto=format&fit=crop&q=80&w=600",
    ],
    inStock: true,
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "4",
    model: "iPhone 12",
    variant: "Mini",
    storage: "64GB",
    color: "Red",
    condition: "Fair",
    price: 399,
    description: "Visible scratches on screen and frame. Battery health at 82%. Fully functional.",
    images: [
      "https://images.unsplash.com/photo-1607936854279-55e8a4c64888?auto=format&fit=crop&q=80&w=600",
    ],
    inStock: true,
    createdAt: new Date().toISOString(),
  },
];

// In a real app, this would use localStorage or a backend API
let products = [...SAMPLE_PRODUCTS];

// Storage key for localStorage
const STORAGE_KEY = 'iphone-store-products';

// Load products from localStorage
export const loadProducts = (): Product[] => {
  if (typeof window === 'undefined') return products;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      products = JSON.parse(stored);
    } else {
      // Initialize with sample data if nothing exists
      saveProducts(products);
    }
  } catch (error) {
    console.error('Failed to load products:', error);
  }
  
  return products;
};

// Save products to localStorage
export const saveProducts = (newProducts: Product[]): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newProducts));
    products = newProducts;
  } catch (error) {
    console.error('Failed to save products:', error);
  }
};

// Get all products
export const getAllProducts = (): Product[] => {
  return loadProducts();
};

// Get a single product by ID
export const getProductById = (id: string): Product | undefined => {
  return loadProducts().find(product => product.id === id);
};

// Add a new product
export const addProduct = (product: Omit<Product, 'id' | 'createdAt'>): Product => {
  const newProduct: Product = {
    ...product,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  
  const updatedProducts = [...loadProducts(), newProduct];
  saveProducts(updatedProducts);
  
  return newProduct;
};

// Update an existing product
export const updateProduct = (id: string, updates: Partial<Product>): Product | undefined => {
  const currentProducts = loadProducts();
  const index = currentProducts.findIndex(p => p.id === id);
  
  if (index === -1) return undefined;
  
  const updatedProduct = { ...currentProducts[index], ...updates };
  currentProducts[index] = updatedProduct;
  
  saveProducts(currentProducts);
  return updatedProduct;
};

// Delete a product
export const deleteProduct = (id: string): boolean => {
  const currentProducts = loadProducts();
  const filteredProducts = currentProducts.filter(p => p.id !== id);
  
  if (filteredProducts.length === currentProducts.length) return false;
  
  saveProducts(filteredProducts);
  return true;
};
