# DineSmart - Complete Screens Inventory

## Mobile App Screens (React Native - Expo)

### Customer Flow (10 Screens)

#### 1. QR Scanner (Entry Point)
- **File**: `apps/mobile/app/index.tsx`
- **Purpose**: Scan table QR code to enter app
- **Features**:
  - Expo Camera integration
  - Real-time QR code detection
  - Extracts table ID from QR
  - Auto-navigates to menu on successful scan
  - Manual table ID entry option
- **UI Elements**: Camera view, scanning frame overlay, manual entry input

#### 2. Menu Categories
- **File**: `apps/mobile/app/(customer)/menu-categories.tsx`
- **Purpose**: Browse food categories
- **Features**:
  - 6-category grid layout (Pasta, Rice, Burger, Sushi, Dessert, Beverages)
  - Category images
  - Green "Select" buttons
  - Table ID display in header
  - Responsive grid
- **UI Elements**: Category cards with images, header with table ID, status bar

#### 3. Menu Items (Dynamic by Category)
- **File**: `apps/mobile/app/(customer)/menu-items/[category].tsx`
- **Purpose**: Browse items in selected category
- **Features**:
  - FlatList of menu items
  - Item image, name, description, price
  - Green "Add to Cart" button per item
  - Category header
  - Back navigation
  - Search/filter capability
- **UI Elements**: MenuItemCard component, header, FlatList, button

#### 4. Product Detail
- **File**: `apps/mobile/app/(customer)/product-detail/[id].tsx`
- **Purpose**: Full product information
- **Features**:
  - Large product image (full width)
  - Product name and description
  - Ingredients list
  - Price display (Rs. format)
  - Quantity selector (-, count, + buttons)
  - Green "Add to Cart" button
  - Nutritional info (optional)
- **UI Elements**: Image, text sections, QuantitySelector, button

#### 5. Shopping Cart
- **File**: `apps/mobile/app/(customer)/cart.tsx`
- **Purpose**: Manage added items
- **Features**:
  - List of cart items with images
  - Item name, quantity, price
  - Quantity adjustment buttons
  - Remove item option
  - Subtotal display
  - Empty cart state
  - Green "Proceed to Place Order" button
  - Cart persistence
- **UI Elements**: CartItemRow cards, totals section, buttons

#### 6. Order Summary
- **File**: `apps/mobile/app/(customer)/order-summary.tsx`
- **Purpose**: Review order before payment
- **Features**:
  - Order items display with images
  - Subtotal calculation
  - Tax calculation (10%)
  - Grand total display
  - Item quantity and price breakdown
  - "Proceed to Payment" button
  - Edit items option
- **UI Elements**: Item cards, calculation section, button

#### 7. Payment Method Selection
- **File**: `apps/mobile/app/(customer)/payment-method.tsx`
- **Purpose**: Choose payment method
- **Features**:
  - 3 payment options (Cash in Hand, Debit Card, Credit Card)
  - Radio button selection (green when selected)
  - Icon + description for each option
  - "Apply Promo Code" section
  - Green border for selected option
  - Green "Confirm & Pay" button
  - Price display
- **UI Elements**: Radio buttons, card selection UI, promo code input, button

#### 8. Order Confirmation
- **File**: `apps/mobile/app/(customer)/order-confirmation.tsx`
- **Purpose**: Confirm successful order placement
- **Features**:
  - Order ID display
  - Estimated wait time
  - Order summary recap
  - Table number confirmation
  - Success message/icon
  - Green "View Order Status" button
  - Navigation to order tracking
- **UI Elements**: Success card, order details, button

#### 9. Order Tracking / Waiting Time
- **File**: `apps/mobile/app/(customer)/order-tracking.tsx`
- **Purpose**: Real-time order status tracking
- **Features**:
  - Estimated waiting time at top
  - 4-step progress indicator:
    1. Order placed
    2. Start prep
    3. In-progress
    4. Served
  - Circle indicators with connecting lines
  - Current step highlighted in green
  - Cooking illustration
  - "Proceed to Bill" button when served
  - Live status updates (mocked)
  - Cancel order option
- **UI Elements**: StatusTracker component, time display, illustration, buttons

#### 10. Order History
- **File**: `apps/mobile/app/(customer)/order-history.tsx`
- **Purpose**: View past orders
- **Features**:
  - List of historical orders
  - Order ID, date, items count, total price
  - Order status indicator
  - Reorder button per order
  - Search/filter options
  - Date sorting
  - Order details expansion
- **UI Elements**: Order cards, buttons, list, search input

---

### Admin Flow (7 Screens)

#### 1. Admin Login
- **File**: `apps/mobile/app/(admin)/admin-login.tsx`
- **Purpose**: Staff authentication
- **Features**:
  - Email input field
  - Password input field
  - Green login button
  - Kitchen aesthetic background
  - Demo credentials display
  - Error message display
  - Session storage
- **UI Elements**: Text inputs, button, background image, error alert

#### 2. Admin Dashboard
- **File**: `apps/mobile/app/(admin)/dashboard.tsx`
- **Purpose**: Overview of restaurant operations
- **Features**:
  - Quick stats cards:
    - Total orders today
    - Pending orders
    - Items in stock
    - Expiring items
  - Food safety certifications display
  - Recent orders summary
  - Latest sanitization logs
  - Quick action buttons
  - Staff profile display
- **UI Elements**: Stat cards, certification cards, order list, log table, profile

#### 3. Orders Management
- **File**: `apps/mobile/app/(admin)/orders-management.tsx`
- **Purpose**: Manage and update orders
- **Features**:
  - Orders list with status badges
  - Order ID, table number, items, total
  - Status: Order placed → Start prep → In-progress → Served
  - Expandable order details
  - Order items with images
  - Order timeline visualization
  - Update status button
  - Filter by status
- **UI Elements**: Order cards, status badges, expansion, details view

#### 4. Inventory
- **File**: `apps/mobile/app/(admin)/inventory.tsx`
- **Purpose**: Stock level management
- **Features**:
  - Ingredient list
  - Stock quantity display
  - Category labels (Meat, Seafood, Vegetable, Spice)
  - Status badges (FRESH, WARNING, EXPIRED)
  - Status indicator icons
  - Edit button per item
  - Add ingredient button
- **UI Elements**: Ingredient cards, badges, icons, buttons

#### 5. Hygiene & Compliance
- **File**: `apps/mobile/app/(admin)/hygiene-compliance.tsx`
- **Purpose**: Food safety compliance monitoring
- **Features**:
  - Food safety certifications display
  - SL Certification with details
  - Issue and expiry dates
  - Certification badges
  - Sanitization log table
  - Session type, employee, date, time, status
  - Status badges (VERIFIED, PENDING)
  - Add new log button
- **UI Elements**: Certification cards, log table, badges

#### 6. Expiry Alerts
- **File**: `apps/mobile/app/(admin)/expiry-alerts.tsx`
- **Purpose**: Manage expiring ingredients
- **Features**:
  - List of expiring/expired items
  - Item name, category, quantity
  - Expiry date in red
  - "ACTION REQUIRED" button
  - "CREATE SPECIAL DISH" option
  - Status badges (WARNING, EXPIRED)
  - Sort by urgency
- **UI Elements**: Alert cards, action buttons, status badges

#### 7. Staff Profile
- **File**: `apps/mobile/app/(admin)/staff-profile.tsx`
- **Purpose**: Admin account management
- **Features**:
  - Staff name and email display
  - Role information
  - Account settings
  - Logout button
  - Shift information (optional)
  - Contact information
- **UI Elements**: Profile card, info display, logout button

---

## Web Admin Dashboard Screens (Next.js)

### Authentication

#### Admin Login Page
- **File**: `app/admin/login/page.tsx`
- **URL**: `/admin/login`
- **Features**:
  - Email input field
  - Password input field
  - Kitchen aesthetic background image
  - Green login button
  - Error message display
  - Demo credentials hint box
  - Form validation
- **Design**: Split layout - image on left, form on right
- **UI Elements**: Input fields, button, background image, info box

---

### Main Admin Sections

#### 1. Dashboard
- **File**: `app/admin/dashboard/page.tsx`
- **URL**: `/admin/dashboard`
- **Features**:
  - Stat cards (4 columns):
    - Total orders today
    - Pending orders
    - Items in stock
    - Expiring items
  - Food Safety Certifications section
    - SL Certification display
    - Issue and expiry dates
    - Official approved seal badge
  - Recent Orders section
    - Order ID, table, status
    - Status badges with colors
  - Sanitization Log table
    - Session type, employee, date, time, status
    - Status badges (VERIFIED)
    - Responsive table layout
- **UI Elements**: Stat cards, certification cards, order list, table, badges

#### 2. Orders Management
- **File**: `app/admin/orders/page.tsx`
- **URL**: `/admin/orders`
- **Features**:
  - Orders list with expandable details
  - Order header with ID, table, items, total, status
  - Expandable order details showing:
    - Order items with images
    - Item prices and quantities
    - Order timeline (4 steps)
    - Update status button
  - Status badges with color coding
  - Chevron icon for expand/collapse
  - Status progression visualization
- **UI Elements**: Order cards, status badges, expansion UI, timeline

#### 3. Inventory Management
- **File**: `app/admin/inventory/page.tsx`
- **URL**: `/admin/inventory`
- **Features**:
  - Stat cards (4):
    - Total items
    - Fresh count
    - Warning count
    - Expired count
  - Category filter buttons (All, MEAT, SEAFOOD, VEGETABLE, SPICE)
  - Inventory table with columns:
    - Ingredient name with icon
    - Category
    - Stock with progress bar
    - Expiry date
    - Status badge
    - Edit button
  - "Add Ingredient" button
  - Responsive table
- **UI Elements**: Stat cards, filter buttons, table, badges, progress bars

#### 4. Hygiene & Compliance
- **File**: `app/admin/hygiene/page.tsx`
- **URL**: `/admin/hygiene`
- **Features**:
  - Food Safety Certifications section
    - SL Certification card (green background)
    - Official approved seal badge
    - Certification level
    - Issue and expiry dates
    - Green checkmark icon
  - Recent Sanitization Log table
    - Session type with icon
    - Employee name
    - Date and time
    - Status badge (VERIFIED)
    - Responsive table
  - Compliance Status card
    - Green background
    - Checkmark icon
    - Compliance message
    - Last checked timestamp
  - "Log Sanitization" button
- **UI Elements**: Certification cards, table, badges, status card

#### 5. Expiry Alerts
- **File**: `app/admin/expiry-alerts/page.tsx`
- **URL**: `/admin/expiry-alerts`
- **Features**:
  - Alert summary cards (3):
    - Items expiring soon
    - Expired items
    - Action required
  - Expiring items list with cards:
    - Item name with alert icon
    - Status badge (WARNING/EXPIRED)
    - Category, quantity, expiry date
    - "Create Dish" action button
    - Expandable details showing:
      - Suggested actions
      - Mark as disposed button
  - Items highlighted by status (orange for warning, red for expired)
  - No items message
- **UI Elements**: Alert cards, item cards, status badges, action buttons

#### 6. Settings
- **File**: `app/admin/settings/page.tsx`
- **URL**: `/admin/settings`
- **Features**:
  - Restaurant Information section
    - Restaurant name input
    - Email input
    - Phone input
    - Address input
    - Save button
  - Account Settings section
    - Current password input
    - New password input
    - Confirm password input
    - Update password button
  - Notifications section
    - Order alerts toggle
    - Expiry alerts toggle
    - Compliance alerts toggle
    - Checkboxes with descriptions
- **UI Elements**: Input fields, buttons, toggles/checkboxes

---

## Admin Layout & Navigation

#### Admin Layout
- **File**: `app/admin/layout.tsx`
- **Features**:
  - Sidebar navigation (hidden on mobile)
  - Green header (#2B7C4F)
  - Menu items:
    - Dashboard
    - Orders
    - Inventory
    - Hygiene
    - Expiry Alerts
    - Settings
  - Admin profile display
  - Logout button
  - Mobile menu toggle
  - Responsive design
- **UI Elements**: Sidebar, header, menu items, profile card

---

## Landing Page

#### Home Page
- **File**: `app/page.tsx`
- **URL**: `/`
- **Features**:
  - Green header with logo
  - Welcome section
  - Grid with 2 options:
    - Customer Mobile App card
    - Admin Dashboard card
  - Features section (3 columns)
  - Technology stack section
  - Footer
  - Links to both apps
- **UI Elements**: Header, cards, feature grid, tech stack grid

---

## Components Summary

### UI Components (Mobile)
1. **Button** - Custom styled button
2. **Card** - Card container
3. **TextField** - Input field with label
4. **QuantitySelector** - Quantity +/- control

### Layout Components (Mobile)
1. **Header** - App header with title
2. **SafeAreaContainer** - Safe area wrapper

### Card Components (Mobile)
1. **MenuItemCard** - Menu item display
2. **CartItemRow** - Cart item row
3. **StatusTracker** - 4-step order progress

### UI Components (Web)
- Entire shadcn/ui library included
- Button, Card, Input, Label, Badge, Table, etc.

---

## Total Screens Created

### Mobile App
- Customer: 10 screens
- Admin: 7 screens
- **Total: 17 screens**

### Web Admin Dashboard
- Auth: 1 screen (login)
- Main: 6 screens (dashboard, orders, inventory, hygiene, expiry, settings)
- **Total: 7 pages**

### Additional
- Landing page: 1
- Admin layout: 1

**Grand Total: 26 screens/pages fully implemented**

---

## Status Summary

| Component | Status | Notes |
|-----------|--------|-------|
| Mobile Customer App | ✅ Complete | All 10 screens done |
| Mobile Admin App | ✅ Complete | All 7 screens done |
| Web Admin Dashboard | ✅ Complete | All 7 pages done |
| Design System | ✅ Complete | Colors, typography, spacing |
| Mock Data | ✅ Complete | Menu, orders, inventory, etc. |
| TypeScript | ✅ Complete | Strict mode throughout |
| Responsive Design | ✅ Complete | Mobile-first approach |
| Authentication | ✅ Complete | Demo/development level |
| Navigation | ✅ Complete | Expo Router + Next.js routing |
| Documentation | ✅ Complete | Comprehensive docs provided |

---

## File Count

- **TypeScript/React files**: 50+
- **Screens/Pages**: 26
- **Components**: 11
- **Contexts**: 3
- **Type files**: 2
- **Mock data files**: 2
- **Documentation files**: 5
- **Configuration files**: 4

**Total: 100+ files created**

---

**All screens created and ready to use!** 🎉
