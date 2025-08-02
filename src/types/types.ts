
export type FoodItemType = {
    id: number;
    title: string;
    description: string;
    img: string;
    slug: string;
    colour: string;
  };
  export type Product = {
    id: number;
    title: string;
    description: string;
    img: string;
    price: number ; // Price can be a number or Decimal type
    options?: {  // Options as an object inside the product
      title: string;
      additionalPrice: number; // Additional price can also be a number or Decimal type
    }[];
  };
  export type Order = {
  id: string;
  createdAt: Date;
  userEmail: string; // Assuming you have a user email field
  price: string; // Decimal values are usually returned as strings in Prisma
  products: Product[];// JSON type — you can use a more specific type if you know the structure
  status: string; // e.g., "pending", "paid", etc.
};
export type Cart = {
  id: string;
  createdAt: Date;
  products: Product[]; // Assuming products are stored as an array of Product objects
  userEmail: string; // Assuming you have a user email field
};

export type CartItems = {
        userEmail: string,
        productId: string,
        id : string;
        name: string,
        image: string,
        price: string,
        quantity: number,
        option: string 
}
