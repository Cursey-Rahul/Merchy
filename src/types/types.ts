export type Creator = {
  id: string;
  userId: string;
  slug: string;
  title: string;
  description: string;
  image: string;
};

export type Product = {
  id: string;
  createdAt: Date;
  title: string;
  description: string;
  img: string;
  price: number | string; // Can be number or Decimal (returned as string from DB)
  options?: {
    title: string;
    additionalPrice: number;
  }[];
  creatorSlug: string;
  featured?: boolean;
};

export type Order = {
  id: string;
  createdAt: Date;
  userEmail: string;
  price: string; // Decimal values are returned as strings from Prisma
  products: Product[];
  status: string;
};

export type Cart = {
  id: string;
  createdAt: Date;
  products: Product[];
  userEmail: string;
};

export type CartItems = {
  userEmail: string;
  productId: string;
  id: string;
  title: string;
  img: string;
  price: string;
  quantity: number;
  options?: string;
};

export type CartItem = {
  userEmail: string;
  productId: string;
  id: string;
  title: string;
  img: string;
  price: string;
  quantity: number;
  options?: string;
};

export type User = {
  id: string;
  name?: string;
  email: string;
  emailVerified?: Date;
  image?: string;
  userType: string; // "user" or "creator"
  isAdmin: boolean;
};