export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

export interface Category {
  id: string;
  name: string;
  image: string;
}

export const categories: Category[] = [
  { id: 'pasta', name: 'PASTA', image: '/images/pasta.png' },
  { id: 'rice', name: 'RICE', image: '/images/rice.png' },
  { id: 'burger', name: 'BURGER', image: '/images/burger.png' },
  { id: 'sushi-rolls', name: 'SUSHI ROLLS', image: '/images/sushi.png' },
  {
    id: 'dessert',
    name: 'DESSERT',
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=300&fit=crop',
  },
  {
    id: 'beverages',
    name: 'BEVERAGES',
    image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=300&fit=crop',
  },
];

export const products: Product[] = [
  {
    id: 'chicken-biriyani',
    name: 'Chicken Biriyani',
    description: 'Rice, chicken, onion, tomatoes, yogurt, salt, ginger, garlic, spices',
    price: 2000,
    image: '/images/chicken-biriyani.png',
    category: 'rice',
  },
  {
    id: 'mixed-nasi-goreng',
    name: 'Mixed Nasi Goreng',
    description: 'Rice, chicken, egg, prawns, mixed vegetables, oil, salt, spices',
    price: 3000,
    image: '/images/nasi-goreng.png',
    category: 'rice',
  },
  {
    id: 'spaghetti-carbonara',
    name: 'Spaghetti Carbonara',
    description: 'Pasta, eggs, parmesan cheese, pancetta, black pepper, cream',
    price: 2500,
    image: '/images/pasta.png',
    category: 'pasta',
  },
  {
    id: 'classic-burger',
    name: 'Classic Beef Burger',
    description: 'Beef patty, lettuce, tomato, cheese, pickles, sesame bun',
    price: 1800,
    image: '/images/burger.png',
    category: 'burger',
  },
  {
    id: 'salmon-sushi',
    name: 'Salmon Sushi Roll',
    description: 'Fresh salmon, sushi rice, nori, avocado, wasabi, soy sauce',
    price: 3500,
    image: '/images/sushi.png',
    category: 'sushi-rolls',
  },
  {
    id: 'strawberry-cheesecake',
    name: 'Strawberry Cheesecake',
    description: 'Cream cheese, strawberries, graham cracker crust, whipped cream',
    price: 1500,
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=300&fit=crop',
    category: 'dessert',
  },
  {
    id: 'tropical-mojito',
    name: 'Tropical Mojito',
    description: 'Rum, lime, mint, sugar, soda water, tropical fruits',
    price: 1200,
    image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=300&fit=crop',
    category: 'beverages',
  },
];

export const getProductsByCategory = (categoryId: string): Product[] => {
  return products.filter((p) => p.category === categoryId);
};

export const getProductById = (productId: string): Product | undefined => {
  return products.find((p) => p.id === productId);
};

export const getCategoryById = (categoryId: string): Category | undefined => {
  return categories.find((c) => c.id === categoryId);
};
