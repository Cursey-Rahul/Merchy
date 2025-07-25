
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
  