
export interface Product {
  id: string;
  model: string;
  variant: string;
  storage: string;
  color: string;
  condition: "New" | "Excellent" | "Good" | "Fair";
  price: number;
  description: string;
  images: string[];
  inStock: boolean;
  featured?: boolean;
  createdAt: string;
}

export interface User {
  username: string;
  isAdmin: boolean;
}
