# DineSmart - Complete Restaurant Management System

## Overview

DineSmart is a complete restaurant management system with two distinct applications:

1. **Customer Mobile App** - React Native (Expo) for customer ordering
2. **Admin Dashboard** - Next.js web app for restaurant management

---

## Architecture

### Project Structure

```
dinesmart/
├── apps/mobile/                    # React Native Expo app
│   ├── app/
│   │   ├── (customer)/            # Customer flow
│   │   ├── (admin)/               # Admin flow
│   │   └── index.tsx              # QR scanner entry
│   ├── src/
│   │   ├── components/            # Reusable components
│   │   ├── contexts/              # State management
│   │   ├── services/              # Mock data
│   │   └── types/                 # TypeScript types
│   └── package.json
│
├── app/                           # Next.js web admin dashboard
│   ├── admin/
│   │   ├── login/                 # Admin authentication
│   │   ├── dashboard/             # Main dashboard
│   │   ├── orders/                # Order management
│   │   ├── inventory/             # Inventory tracking
│   │   ├── hygiene/               # Compliance dashboard
│   │   ├── expiry-alerts/         # Expiry management
│   │   ├── settings/              # Admin settings
│   │   └── layout.tsx             # Admin sidebar
│   ├── lib/
│   │   ├── types/                 # TypeScript types
│   │   └── data/                  # Mock data
│   ├── page.tsx                   # Landing page
│   └── layout.tsx                 # Root layout
│
├── lib/
│   ├── components/                # shadcn/ui components
│   └── utils.ts
│
└── package.json
```

---

## Customer Mobile App (React Native)

### Entry Point: QR Scanner

- **No authentication required**
- Customers scan table QR code at restaurant
- QR format: `dinesmart://table/{tableId}`
- Opens app directly to menu

### Customer Flow (10 Screens)

1. **QR Scanner** (`index.tsx`)
   - Expo Camera integration
   - Detects QR codes
   - Extracts table ID
   - Navigates to menu

2. **Menu Categories** (`menu-categories.tsx`)
   - 6 categories (Pasta, Rice, Burger, Sushi, Dessert, Beverages)
   - Grid layout with images
   - Category selection

3. **Menu Items** (`menu-items/[category].tsx`)
   - Browse items in selected category
   - Item details with price
   - "Add to Cart" button
   - FlatList for performance

4. **Product Detail** (`product-detail/[id].tsx`)
   - Full product image
   - Ingredients list
   - Price and description
   - Quantity selector (-, count, +)
   - Add to cart action

5. **Shopping Cart** (`cart.tsx`)
   - List of added items
   - Quantity adjustment
   - Remove item option
   - Subtotal calculation
   - "Proceed to Place Order" button

6. **Order Summary** (`order-summary.tsx`)
   - Review all items
   - Subtotal display
   - Tax calculation (10%)
   - Grand total
   - "Proceed to Payment" button

7. **Payment Method** (`payment-method.tsx`)
   - 3 options: Cash, Debit Card, Credit Card
   - Radio button selection
   - Apply promo code option
   - "Confirm & Pay" button

8. **Order Confirmation** (`order-confirmation.tsx`)
   - Order ID
   - Estimated wait time
   - Order summary
   - Table confirmation
   - Link to order tracking

9. **Order Tracking** (`order-tracking.tsx`)
   - 4-step progress bar
   - Status: Order placed → Prep → In-progress → Served
   - Estimated time remaining
   - Cooking illustration
   - "Proceed to Bill" button

10. **Order History** (`order-history.tsx`)
    - Past orders list
    - Order ID, date, items, total
    - Reorder functionality

### Admin Mobile Flow (7 Screens)

1. **Admin Login** (`(admin)/admin-login.tsx`)
   - Email/password authentication
   - Demo: admin@dinesmart.com / admin123
   - Session storage

2. **Admin Dashboard** (`(admin)/dashboard.tsx`)
   - Quick stats overview
   - Recent orders
   - Certifications
   - Sanitization logs

3. **Orders Management** (`(admin)/orders-management.tsx`)
   - Real-time order list
   - Update order status
   - Order details expansion

4. **Inventory** (`(admin)/inventory.tsx`)
   - Stock levels
   - Status badges (Fresh/Warning/Expired)
   - Category filtering

5. **Hygiene Compliance** (`(admin)/hygiene-compliance.tsx`)
   - Certifications display
   - Sanitization logs
   - Compliance status

6. **Expiry Alerts** (`(admin)/expiry-alerts.tsx`)
   - Expiring ingredients list
   - "Create Special Dish" option
   - Dispose item action

7. **Staff Profile** (`(admin)/staff-profile.tsx`)
   - Admin details
   - Logout functionality

### State Management

**CartContext** - Customer cart state
- Items array
- Add/remove items
- Update quantities
- Calculate totals with tax

**OrderContext** - Order persistence
- Current order
- Order history
- Status tracking

**AdminAuthContext** - Staff authentication
- Admin user data
- Login/logout
- Session management

---

## Web Admin Dashboard (Next.js)

### Admin Authentication

- **URL**: `/admin/login`
- **Demo Credentials**:
  - Email: `admin@dinesmart.com`
  - Password: `admin123`
- Session stored in localStorage

### Admin Pages (6 Main Sections)

1. **Dashboard** (`/admin/dashboard`)
   - Stats cards (Orders, Pending, Stock, Expiring)
   - Certifications display
   - Recent orders
   - Sanitization logs

2. **Orders Management** (`/admin/orders`)
   - Order list with status
   - Expandable order details
   - Real-time status updates
   - Order timeline
   - Status update buttons

3. **Inventory** (`/admin/inventory`)
   - Category filtering
   - Stock progress bars
   - Status indicators
   - Expiry dates
   - Edit functionality

4. **Hygiene & Compliance** (`/admin/hygiene`)
   - Food safety certifications
   - Sanitization log table
   - Compliance status card
   - Log sanitization button

5. **Expiry Alerts** (`/admin/expiry-alerts`)
   - Warning/Expired items
   - Expand for suggestions
   - "Create Dish" action
   - Dispose item option

6. **Settings** (`/admin/settings`)
   - Restaurant information
   - Account settings
   - Password change
   - Notification preferences

### Design System

**Color Palette**:
- Primary Green: `#2B7C4F`
- Status Colors:
  - Fresh: Green
  - Warning: Orange
  - Expired: Red
  - Placed: Blue
  - In-progress: Yellow

**Typography**:
- Headings: Bold (24-32px)
- Body: Regular (14-16px)
- Captions: Regular (12px)

**Components**:
- Reusable UI components from shadcn/ui
- Cards, Buttons, Badges, Tables
- Form inputs and selects

---

## Mock Data

### Included Mock Data

- **Menu Items**: 20+ items across 6 categories
- **Orders**: Sample orders with different statuses
- **Ingredients**: 9 ingredients with different stock levels
- **Certifications**: SL Certification details
- **Sanitization Logs**: Sample session records

### Location

- Mobile: `apps/mobile/src/services/mockData.ts`
- Web: `lib/data/adminMockData.ts`

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI (for mobile development)

### Web Admin Dashboard

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Navigate to
http://localhost:3000
```

**Login at**: `http://localhost:3000/admin/login`

### Mobile App

```bash
cd apps/mobile

# Install dependencies
npm install

# Start Expo
npm start

# Scan QR code with Expo Go app
# Or use: npm run ios / npm run android
```

---

## Features Summary

### Customer App
✓ No login required - direct QR scan access
✓ Browse menu by categories
✓ Add items to cart with quantity control
✓ Review order with tax calculation
✓ Multiple payment options
✓ Real-time order tracking (4-step progress)
✓ Order history with reorder feature

### Admin Dashboard
✓ Secure admin login
✓ Real-time order status updates
✓ Kitchen display system (KDS) view
✓ Inventory tracking with status badges
✓ Hygiene compliance monitoring
✓ Food safety certifications display
✓ Expiry alerts with action suggestions
✓ Sanitization log records
✓ Restaurant settings management

---

## Technology Stack

### Mobile App
- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Navigation**: Expo Router
- **State**: Context API
- **Camera**: Expo Camera for QR scanning
- **UI**: Custom components matching design

### Web Admin Dashboard
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **UI Library**: shadcn/ui
- **Styling**: Tailwind CSS v4
- **State**: React Context
- **Icons**: Lucide React

---

## Design Consistency

Both apps maintain consistent design:

- **Primary Color**: #2B7C4F (Forest Green)
- **Typography**: Consistent font hierarchy
- **Spacing**: 8px base unit system
- **Border Radius**: 12px for cards, 8px for inputs
- **Status Indicators**: Matching badge colors

---

## API Integration (Future)

Currently using mock data. To integrate with backend:

1. **Replace mock data** in:
   - `apps/mobile/src/services/mockData.ts`
   - `lib/data/adminMockData.ts`

2. **Add API calls** in contexts:
   - `apps/mobile/src/contexts/`
   - Use fetch or axios

3. **Update authentication**:
   - Replace localStorage with secure token storage
   - Implement refresh tokens
   - Add logout API call

---

## Deployment

### Web Admin Dashboard
- Deploy to Vercel (Next.js native support)
- Environment variables in `.env.local`
- GitHub integration for CI/CD

### Mobile App
- Build: `npm run build`
- Publish to Expo: `eas build`
- Deploy to App Store / Play Store

---

## Security Notes

**Current Implementation** (Development):
- Mock authentication for demo
- localStorage for session (not secure for production)

**Production Requirements**:
- Implement JWT authentication
- Use secure HTTP-only cookies
- Add CORS security
- Validate all inputs
- Implement rate limiting
- Add admin authorization checks
- Use environment variables for secrets

---

## Support & Documentation

- Full TypeScript types for development
- Component prop documentation in code
- Mock data examples for testing
- Responsive design for all screen sizes

---

## Next Steps

1. Connect to backend API
2. Implement real authentication
3. Add database integration
4. Implement push notifications
5. Add analytics dashboard
6. Enhance UI with animations
7. Add test suite
8. Deploy to production

---

**Created**: March 2026
**Version**: 1.0.0
**Status**: Development Complete - Ready for Backend Integration
