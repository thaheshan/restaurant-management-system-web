import { MenuCategory, MenuItem, InventoryItem, Certification, SanitizationLog } from '@/types';

// Menu Categories
export const MENU_CATEGORIES: MenuCategory[] = [
  { id: 'pasta', name: 'PASTA', image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400' },
  { id: 'rice', name: 'RICE', image: 'https://images.unsplash.com/photo-1609501676725-7186f017a4b5?w=400' },
  { id: 'burger', name: 'BURGER', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400' },
  { id: 'sushi', name: 'SUSHI ROLLS', image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400' },
  { id: 'dessert', name: 'DESSERT', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400' },
  { id: 'beverages', name: 'BEVERAGES', image: 'https://images.unsplash.com/photo-1608037545488-c52646db42da?w=400' },
];

// Menu Items
export const MENU_ITEMS: Record<string, MenuItem[]> = {
  pasta: [
    {
      id: 'pasta-1',
      name: 'Spaghetti Carbonara',
      description: 'Creamy pasta with bacon and parmesan',
      price: 1500,
      category: 'pasta',
      image: 'https://images.unsplash.com/photo-1612874742237-6526221fcf16?w=400',
      ingredients: ['Spaghetti', 'Bacon', 'Eggs', 'Parmesan', 'Black Pepper'],
    },
    {
      id: 'pasta-2',
      name: 'Penne Arrabbiata',
      description: 'Spicy tomato-based pasta sauce',
      price: 1300,
      category: 'pasta',
      image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400',
      ingredients: ['Penne', 'Tomatoes', 'Garlic', 'Red Chili', 'Olive Oil'],
    },
  ],
  rice: [
    {
      id: 'rice-1',
      name: 'Chicken Biriyani',
      description: 'Rice, chicken, onion, tomatoes, yogurt, salt, ginger, garlic, spices',
      price: 2000,
      category: 'rice',
      image: 'https://images.unsplash.com/photo-1609501676725-7186f017a4b5?w=400',
      ingredients: ['Rice', 'Chicken', 'Yogurt', 'Spices', 'Onion', 'Tomato'],
    },
    {
      id: 'rice-2',
      name: 'Mixed Nasi Goreng',
      description: 'Rice, chicken, egg, prawns, mixed vegetables, oil, salt, spices',
      price: 3000,
      category: 'rice',
      image: 'https://images.unsplash.com/photo-1585238341710-4b7e1d60e73e?w=400',
      ingredients: ['Rice', 'Chicken', 'Prawns', 'Egg', 'Mixed Vegetables'],
    },
  ],
  burger: [
    {
      id: 'burger-1',
      name: 'Classic Cheeseburger',
      description: 'Beef patty with melted cheese and fresh vegetables',
      price: 1800,
      category: 'burger',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
      ingredients: ['Beef Patty', 'Cheddar Cheese', 'Lettuce', 'Tomato', 'Onion', 'Bun'],
    },
    {
      id: 'burger-2',
      name: 'Spicy Chicken Burger',
      description: 'Crispy fried chicken with spicy mayo',
      price: 1600,
      category: 'burger',
      image: 'https://images.unsplash.com/photo-1562547256-4d9e42616ba3?w=400',
      ingredients: ['Fried Chicken', 'Spicy Mayo', 'Lettuce', 'Tomato', 'Bun'],
    },
  ],
  sushi: [
    {
      id: 'sushi-1',
      name: 'California Roll',
      description: 'Crab, avocado, and cucumber roll',
      price: 2200,
      category: 'sushi',
      image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=400',
      ingredients: ['Crab', 'Avocado', 'Cucumber', 'Rice', 'Nori'],
    },
    {
      id: 'sushi-2',
      name: 'Spicy Tuna Roll',
      description: 'Spicy tuna with jalapeño and mayo',
      price: 2400,
      category: 'sushi',
      image: 'https://images.unsplash.com/photo-1564489551854-b72b27e84530?w=400',
      ingredients: ['Tuna', 'Jalapeño', 'Spicy Mayo', 'Rice', 'Nori'],
    },
  ],
  dessert: [
    {
      id: 'dessert-1',
      name: 'Chocolate Cake',
      description: 'Rich chocolate cake with chocolate frosting',
      price: 800,
      category: 'dessert',
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400',
      ingredients: ['Chocolate', 'Flour', 'Eggs', 'Sugar', 'Butter'],
    },
    {
      id: 'dessert-2',
      name: 'Strawberry Cheesecake',
      description: 'Creamy cheesecake with fresh strawberries',
      price: 900,
      category: 'dessert',
      image: 'https://images.unsplash.com/photo-1533134242443-742029dffb73?w=400',
      ingredients: ['Cream Cheese', 'Graham Cracker', 'Strawberry', 'Sugar'],
    },
  ],
  beverages: [
    {
      id: 'beverage-1',
      name: 'Fresh Orange Juice',
      description: 'Freshly squeezed orange juice',
      price: 400,
      category: 'beverages',
      image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400',
      ingredients: ['Orange'],
    },
    {
      id: 'beverage-2',
      name: 'Iced Tea',
      description: 'Refreshing iced tea with lemon',
      price: 350,
      category: 'beverages',
      image: 'https://images.unsplash.com/photo-1556742208103-0bb441acd231?w=400',
      ingredients: ['Tea', 'Lemon', 'Ice', 'Sugar'],
    },
  ],
};

// Inventory Items
export const INVENTORY_ITEMS: InventoryItem[] = [
  {
    id: 'inv-1',
    name: 'Chicken',
    category: 'meat',
    stock: 15,
    unit: 'kg',
    status: 'fresh',
    expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    lastUpdated: new Date(),
  },
  {
    id: 'inv-2',
    name: 'Prawns',
    category: 'seafood',
    stock: 8,
    unit: 'kg',
    status: 'warning',
    expiryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    lastUpdated: new Date(),
  },
  {
    id: 'inv-3',
    name: 'Carrots',
    category: 'vegetable',
    stock: 20,
    unit: 'kg',
    status: 'fresh',
    expiryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    lastUpdated: new Date(),
  },
  {
    id: 'inv-4',
    name: 'Tomatoes',
    category: 'vegetable',
    stock: 12,
    unit: 'kg',
    status: 'expired',
    expiryDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    lastUpdated: new Date(),
  },
  {
    id: 'inv-5',
    name: 'Spices Mix',
    category: 'spice',
    stock: 5,
    unit: 'kg',
    status: 'fresh',
    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    lastUpdated: new Date(),
  },
];

// Certifications
export const CERTIFICATIONS: Certification[] = [
  {
    id: 'cert-1',
    name: 'SL Certification',
    level: 'Standard License Level 4',
    issueDate: new Date('2025-01-12'),
    expiryDate: new Date('2026-01-12'),
    badge: '🏆',
  },
];

// Sanitization Logs
export const SANITIZATION_LOGS: SanitizationLog[] = [
  {
    id: 'log-1',
    type: 'Surface Prep',
    employee: 'Sunil',
    date: new Date('2026-01-26'),
    time: '11:30 AM',
    status: 'verified',
  },
  {
    id: 'log-2',
    type: 'Deep Clean',
    employee: 'Pradeep',
    date: new Date('2026-01-26'),
    time: '12:30 PM',
    status: 'verified',
  },
  {
    id: 'log-3',
    type: 'Tables Clean',
    employee: 'Sunil',
    date: new Date('2026-01-26'),
    time: '12:00 PM',
    status: 'verified',
  },
];
