# DineSmart Mobile App - React Native Expo

A comprehensive restaurant ordering system with customer-facing order placement and restaurant admin management, built with React Native and Expo.

## Features

### Customer Side
- **QR Code Scanning**: Customers scan table QR codes to access the menu
- **Menu Browsing**: Browse items by category (Pasta, Rice, Burger, Sushi, Dessert, Beverages)
- **Product Details**: View detailed product information with ingredients
- **Shopping Cart**: Add/remove items, adjust quantities
- **Order Checkout**: Order summary with tax calculation
- **Payment Methods**: Support for Cash, Debit Card, and Credit Card
- **Order Tracking**: Real-time order status tracking (Placed → Prep → In-Progress → Served)
- **Order History**: View past orders and reorder options

### Admin Side
- **Admin Login**: Secure login for restaurant staff
- **Dashboard**: Quick overview of certifications and recent sanitization logs
- **Orders Management**: View and update order status in real-time
- **Inventory Management**: Track ingredient stock levels with status indicators (Fresh, Warning, Expired)
- **Hygiene & Compliance**: Display food safety certifications and sanitization logs
- **Expiry Alerts**: Monitor ingredients nearing expiration
- **Staff Profile**: Manage admin account information

## Design System

- **Primary Color**: #2B7C4F (Forest Green)
- **Typography**: Clean hierarchy with consistent font weights
- **Spacing**: 8px base unit for consistent layouts
- **Border Radius**: 12px for cards, 8px for buttons
- **Component Library**: Custom reusable UI components

## Tech Stack

- **Framework**: React Native 0.74
- **Expo**: Latest version with Expo Router
- **State Management**: React Context API
- **Camera**: Expo Camera + Barcode Scanner for QR code detection
- **TypeScript**: Full type safety
- **Navigation**: Expo Router (file-based routing)

## Project Structure

```
apps/mobile/
├── app/
│   ├── _layout.tsx          # Root layout with context providers
│   ├── index.tsx            # QR scanner entry point
│   ├── (customer)/          # Customer flow screens
│   │   ├── menu-categories.tsx
│   │   ├── menu-items/[category].tsx
│   │   ├── product-detail/[id].tsx
│   │   ├── cart.tsx
│   │   ├── order-summary.tsx
│   │   ├── payment-method.tsx
│   │   ├── order-confirmation.tsx
│   │   ├── order-tracking.tsx
│   │   └── order-history.tsx
│   └── (admin)/             # Admin flow screens
│       ├── admin-login.tsx
│       ├── dashboard.tsx
│       ├── orders-management.tsx
│       ├── inventory.tsx
│       ├── hygiene-compliance.tsx
│       ├── expiry-alerts.tsx
│       └── staff-profile.tsx
├── src/
│   ├── components/
│   │   ├── ui/              # Reusable UI components
│   │   ├── cards/           # Card components
│   │   └── layout/          # Layout components
│   ├── contexts/            # React Context providers
│   ├── services/            # Mock data services
│   ├── constants/           # Design tokens and constants
│   └── types/               # TypeScript type definitions
├── app.json                 # Expo configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # Dependencies
```

## Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn or pnpm
- Expo CLI (`npm install -g expo-cli`)

### Installation

1. **Install dependencies**
   ```bash
   cd apps/mobile
   npm install
   # or
   pnpm install
   ```

2. **Start the development server**
   ```bash
   npm start
   # or
   pnpm start
   ```

3. **Run on different platforms**
   ```bash
   # iOS
   npm run ios

   # Android
   npm run android

   # Web
   npm run web
   ```

## Demo Credentials

### Admin Login
- **Email**: admin@dinesmart.com
- **Password**: admin123

### QR Code Format
QR codes should contain:
```
dinesmart://table/{tableId}
```

Example: `dinesmart://table/101`

## Mock Data

The app comes with mock data for:
- 6 menu categories with 2+ items each
- 9 inventory items with stock tracking
- Certifications and sanitization logs
- Multiple orders with status tracking

All data is loaded from `/src/services/mockData.ts`

## State Management

### Contexts

1. **CartContext**
   - Manages shopping cart items
   - Handles quantity updates
   - Calculates subtotal, tax, and total
   - Stores table ID

2. **AdminAuthContext**
   - Manages admin authentication
   - Handles login/logout
   - Stores admin user information

3. **OrderContext**
   - Manages current order and history
   - Updates order status
   - Generates order IDs
   - Simulates estimated wait times

## Key Features Implementation

### QR Code Scanning
Uses `expo-camera` with barcode scanning to detect QR codes. Scanned codes must follow the format `dinesmart://table/{tableId}`.

### Real-time Order Tracking
Order status automatically progresses through states: placed → prep → in-progress → served (with 5-second intervals for demo).

### Tax Calculation
10% tax automatically calculated on all orders. Can be configured in `CartContext.tsx`.

### Responsive Design
All screens are optimized for mobile devices with proper spacing and typography hierarchy.

## Customization

### Change Primary Color
Edit `/src/constants/colors.ts`:
```typescript
primary: '#YOUR_COLOR'
```

### Add Menu Items
Edit `/src/services/mockData.ts` and add items to `MENU_ITEMS`.

### Adjust Tax Rate
In `/src/contexts/CartContext.tsx`:
```typescript
const TAX_RATE = 0.10; // Change to desired rate
```

### Configure Estimated Wait Time
In `/src/contexts/OrderContext.tsx`:
```typescript
const generateEstimatedTime = () => Math.floor(Math.random() * 45) + 15;
```

## API Integration (Future)

The app is structured to easily connect to a backend API:

1. Create API service files in `/src/services/`
2. Replace mock data calls with API calls
3. Update context providers with real data
4. Implement proper error handling

## Deployment

### Build for Production

**iOS**
```bash
expo build:ios
```

**Android**
```bash
expo build:android
```

### Submit to App Stores

- **Apple App Store**: Follow [Expo iOS deployment guide](https://docs.expo.dev/deploy/submit-to-app-stores/)
- **Google Play Store**: Follow [Expo Android deployment guide](https://docs.expo.dev/deploy/submit-to-app-stores/)

## Troubleshooting

### Camera Permission Issues
Ensure your device/simulator has camera permissions. On Android, check Settings > Apps > DineSmart > Permissions.

### QR Code Not Scanning
- Ensure good lighting
- Hold the QR code steady in frame
- Check that the QR code is valid format

### Navigation Issues
Clear cache and restart the dev server:
```bash
npm start -- --clear
```

## Support & Contribution

For issues or feature requests, please contact the development team.

## License

Copyright © 2026 DineSmart. All rights reserved.
