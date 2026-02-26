import { User, FoodItem, InventoryItem, Role } from "../types";

export const mockUsers: User[] = [
  { id: "1", name: "Alessandro Romano", email: "admin@restaurant.com",     role: "super_admin",    createdAt: "2024-01-01", isActive: true  },
  { id: "2", name: "Sofia Chen",        email: "manager@restaurant.com",   role: "manager",        createdAt: "2024-01-05", isActive: true  },
  { id: "3", name: "Marco Russo",       email: "chef@restaurant.com",      role: "chef",           createdAt: "2024-02-01", isActive: true  },
  { id: "4", name: "Elena Petrov",      email: "waiter@restaurant.com",    role: "waiter",         createdAt: "2024-02-10", isActive: true  },
  { id: "5", name: "James Okafor",      email: "inventory@restaurant.com", role: "inventory_staff",createdAt: "2024-03-01", isActive: false },
];

export const DEMO_ACCOUNTS = {
  admin:   { email: "admin@restaurant.com",   password: "admin123",   user: mockUsers[0] },
  manager: { email: "manager@restaurant.com", password: "manager123", user: mockUsers[1] },
};

export const mockFoodItems: FoodItem[] = [
  { id:"1", name:"Truffle Risotto",       description:"Creamy Arborio rice with black truffle shavings",    category:"main_course", price:38, cost:12, ingredients:["Arborio rice","Black truffle","Parmesan"],  allergens:["Dairy","Gluten"], isAvailable:true,  preparationTime:25, calories:520, createdAt:"2024-01-01", updatedAt:"2024-01-15" },
  { id:"2", name:"Burrata Caprese",       description:"Fresh burrata with heirloom tomatoes and basil oil", category:"appetizer",   price:22, cost:6,  ingredients:["Burrata","Heirloom tomatoes","Basil"],      allergens:["Dairy"],          isAvailable:true,  preparationTime:10, calories:310, createdAt:"2024-01-01", updatedAt:"2024-01-20" },
  { id:"3", name:"Chocolate Fondant",     description:"Warm dark chocolate cake with molten center",        category:"dessert",     price:16, cost:4,  ingredients:["Dark chocolate","Butter","Eggs","Sugar"],   allergens:["Dairy","Eggs","Gluten"], isAvailable:true, preparationTime:15, calories:480, createdAt:"2024-01-01", updatedAt:"2024-02-01" },
  { id:"4", name:"Wagyu Beef Tenderloin", description:"A5 Wagyu 200g, bone marrow sauce, truffle puree",   category:"main_course", price:95, cost:45, ingredients:["Wagyu beef","Bone marrow","Truffle"],       allergens:["Dairy"],          isAvailable:true,  preparationTime:35, calories:780, createdAt:"2024-02-10", updatedAt:"2024-02-20" },
  { id:"5", name:"Elderflower Spritz",    description:"St-Germain, prosecco, cucumber, mint",               category:"beverage",    price:14, cost:3,  ingredients:["St-Germain","Prosecco","Cucumber","Mint"],  allergens:["Sulphites"],      isAvailable:true,  preparationTime:5,  calories:180, createdAt:"2024-01-15", updatedAt:"2024-01-15" },
  { id:"6", name:"Sea Bass Crudo",        description:"Line-caught sea bass, citrus ponzu, micro herbs",    category:"appetizer",   price:28, cost:10, ingredients:["Sea bass","Ponzu","Lime","Capers"],         allergens:["Fish","Soy"],     isAvailable:false, preparationTime:12, calories:220, createdAt:"2024-02-01", updatedAt:"2024-02-15" },
];

export const mockInventoryItems: InventoryItem[] = [
  { id:"1", name:"Roma Tomatoes",  category:"Vegetables", quantity:15,  unit:"kg",    minimumStock:10,  maximumStock:50,  currentStock:15,  healthStatus:"good",     expiryDate:"2024-03-15", receivedDate:"2024-03-10", supplier:"Farm Fresh Co.",      pricePerUnit:3.5,   location:"Cold Room A",  lastUpdated:"2024-03-10" },
  { id:"2", name:"Fresh Basil",    category:"Herbs",      quantity:2,   unit:"kg",    minimumStock:3,   maximumStock:10,  currentStock:2,   healthStatus:"warning",  expiryDate:"2024-03-13", receivedDate:"2024-03-08", supplier:"Herb Garden Ltd",     pricePerUnit:18,    location:"Cold Room B",  lastUpdated:"2024-03-08" },
  { id:"3", name:"Black Truffle",  category:"Specialty",  quantity:0.5, unit:"kg",    minimumStock:0.3, maximumStock:2,   currentStock:0.5, healthStatus:"fresh",    expiryDate:"2024-03-20", receivedDate:"2024-03-09", supplier:"Truffle House Italy", pricePerUnit:1200,  location:"Vault Storage",lastUpdated:"2024-03-09" },
  { id:"4", name:"Arborio Rice",   category:"Grains",     quantity:25,  unit:"kg",    minimumStock:20,  maximumStock:100, currentStock:25,  healthStatus:"fresh",    expiryDate:"2025-01-01", receivedDate:"2024-02-01", supplier:"Italian Imports",     pricePerUnit:4.2,   location:"Dry Storage",  lastUpdated:"2024-02-01" },
  { id:"5", name:"Burrata",        category:"Dairy",      quantity:8,   unit:"piece", minimumStock:12,  maximumStock:30,  currentStock:8,   healthStatus:"critical", expiryDate:"2024-03-12", receivedDate:"2024-03-09", supplier:"Puglia Dairy",        pricePerUnit:6.5,   location:"Cold Room A",  lastUpdated:"2024-03-09" },
  { id:"6", name:"Wagyu A5 Beef",  category:"Meat",       quantity:3.5, unit:"kg",    minimumStock:2,   maximumStock:10,  currentStock:3.5, healthStatus:"fresh",    expiryDate:"2024-03-14", receivedDate:"2024-03-11", supplier:"Japan Premium Meats", pricePerUnit:280,   location:"Meat Locker",  lastUpdated:"2024-03-11" },
];

export const mockRoles: Role[] = [
  { id:"1", name:"super_admin",    displayName:"Super Admin",    description:"Full system access",          permissions:[{id:"p1",module:"Food",action:"manage",description:"Full food management"},{id:"p2",module:"Inventory",action:"manage",description:"Full inventory"},{id:"p3",module:"Roles",action:"manage",description:"Full roles"},{id:"p4",module:"Users",action:"manage",description:"Full users"}],      userCount:1, color:"#FF4500" },
  { id:"2", name:"manager",        displayName:"Manager",        description:"Restaurant operations",       permissions:[{id:"p5",module:"Food",action:"write",description:"Add/edit food"},{id:"p6",module:"Inventory",action:"write",description:"Manage inventory"},{id:"p7",module:"Users",action:"read",description:"View staff"}],                                                                                    userCount:2, color:"#4A90D9" },
  { id:"3", name:"chef",           displayName:"Head Chef",      description:"Kitchen & menu management",   permissions:[{id:"p8",module:"Food",action:"write",description:"Manage menu"},{id:"p9",module:"Inventory",action:"read",description:"View inventory"}],                                                                                                                                                        userCount:3, color:"#E67E22" },
  { id:"4", name:"waiter",         displayName:"Waiter",         description:"Front of house staff",        permissions:[{id:"p10",module:"Food",action:"read",description:"View menu"}],                                                                                                                                                                                                                                 userCount:8, color:"#27AE60" },
  { id:"5", name:"inventory_staff",displayName:"Inventory Staff",description:"Stock & storage management",  permissions:[{id:"p11",module:"Inventory",action:"write",description:"Update inventory"}],                                                                                                                                                                                                                   userCount:2, color:"#8E44AD" },
];

export const revenueChart = [
  { date:"Mon", revenue:6800 }, { date:"Tue", revenue:5200 }, { date:"Wed", revenue:7100 },
  { date:"Thu", revenue:8400 }, { date:"Fri", revenue:9200 }, { date:"Sat", revenue:11800 },
  { date:"Sun", revenue:10250 },
];
