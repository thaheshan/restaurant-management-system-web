# DineSmart Mobile App - Quick Start Guide

Get the app running in minutes!

## Prerequisites

- Node.js 16+ installed
- npm/pnpm/yarn package manager
- Expo CLI: `npm install -g expo-cli`

## Installation (3 Steps)

### Step 1: Install Dependencies
```bash
cd apps/mobile
npm install
```

### Step 2: Start Development Server
```bash
npm start
```

### Step 3: Run on Device/Simulator
```bash
# iOS Simulator
npm run ios

# Android Emulator  
npm run android

# Web Browser
npm run web
```

## Using the App

### Customer Flow

1. **Open App** → See QR Scanner screen
2. **Scan QR Code** → Use demo code: `dinesmart://table/101`
3. **Browse Menu** → Tap any category (Pasta, Rice, Burger, etc.)
4. **Add Items** → Tap items to view details and add quantities
5. **Checkout** → Cart → Order Summary → Payment → Confirmation
6. **Track Order** → Watch status update in real-time
7. **View History** → See past orders

### Admin Flow

1. **Tap Admin Login** → Bottom of initial screen
2. **Login Credentials**:
   - Email: `admin@dinesmart.com`
   - Password: `admin123`
3. **Dashboard** → See overview and navigation options
4. **Manage** → Orders, Inventory, Hygiene, Expiry, Profile

## Key Features

### Customer App
- ✅ QR code scanning for table entry
- ✅ 6 menu categories with multiple items
- ✅ Add/remove items from cart
- ✅ See real-time order status
- ✅ Multiple payment options
- ✅ View order history

### Admin Dashboard
- ✅ Manage active orders
- ✅ Track inventory stock levels
- ✅ View hygiene certifications
- ✅ Monitor expiry alerts
- ✅ Manage staff profile

## File Organization

```
Key Files to Modify:

Menu Items → src/services/mockData.ts
Colors     → src/constants/colors.ts
Screens    → app/(customer)/ and app/(admin)/
Components → src/components/
```

## Common Tasks

### Add Menu Item
Edit `src/services/mockData.ts`:
```typescript
MENU_ITEMS: {
  rice: [
    {
      id: 'new-item',
      name: 'Your Item',
      description: 'Description',
      price: 2000,
      category: 'rice',
      image: 'image-url',
    }
  ]
}
```

### Change Primary Color
Edit `src/constants/colors.ts`:
```typescript
primary: '#YOUR_COLOR_CODE'
```

### Adjust Tax Rate
Edit `src/contexts/CartContext.tsx`:
```typescript
const TAX_RATE = 0.15; // Change from 0.1 (10%) to desired rate
```

### Modify Order Status Steps
Edit `src/components/cards/StatusTracker.tsx`:
```typescript
const STATUS_STEPS: OrderStatus[] = ['placed', 'prep', 'in-progress', 'served'];
```

## Testing Tips

### Test QR Scanner
- Use any QR code generator
- Format: `dinesmart://table/TABLE_NUMBER`
- Example: `dinesmart://table/5`

### Test Payment Flow
- Go to Payment screen
- Select any payment method
- Confirm to see order confirmation

### Test Admin Functions
- Login with demo credentials
- Navigate between sections
- View mock data (orders, inventory, etc.)

## Troubleshooting

### App Won't Start
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm start
```

### Camera Not Working
- Allow camera permissions when prompted
- Check device camera settings
- Try on physical device if simulator fails

### Screen Not Rendering
- Clear Expo cache: `npm start -- --clear`
- Close and restart dev server
- Check for TypeScript errors in terminal

### Navigation Issues
- Ensure you're navigating with correct routes
- Check route file names match navigation paths

## Structure Overview

```
app/
├── index.tsx                  ← QR Scanner (entry point)
├── (customer)/                ← Customer screens
│   ├── menu-categories.tsx    ← Menu grid
│   ├── menu-items/[category].tsx ← Items list
│   ├── product-detail/[id].tsx ← Product details
│   ├── cart.tsx               ← Shopping cart
│   ├── order-summary.tsx      ← Order review
│   ├── payment-method.tsx     ← Payment options
│   ├── order-confirmation.tsx ← Success screen
│   ├── order-tracking.tsx     ← Status tracker
│   └── order-history.tsx      ← Past orders
└── (admin)/                   ← Admin screens
    ├── admin-login.tsx        ← Staff login
    ├── dashboard.tsx          ← Admin home
    ├── orders-management.tsx  ← Order management
    ├── inventory.tsx          ← Stock tracking
    ├── hygiene-compliance.tsx ← Certifications
    ├── expiry-alerts.tsx      ← Expiry tracking
    └── staff-profile.tsx      ← Staff info
```

## Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@dinesmart.com | admin123 |

| QR Code Format |
|---|
| dinesmart://table/{NUMBER} |
| Example: dinesmart://table/101 |

## Performance Optimizations

- FlatList for large item lists
- Image caching
- Minimal re-renders with memoization
- Efficient state management

## Next Steps

1. **Backend Integration**: Replace mock data with real API
2. **Authentication**: Connect to real auth system
3. **Payment Gateway**: Integrate Stripe/PayPal
4. **Database**: Store orders and inventory in real database
5. **Push Notifications**: Send order updates to customers
6. **Analytics**: Track user behavior and orders

## Resources

- [Expo Documentation](https://docs.expo.dev)
- [React Native Docs](https://reactnative.dev)
- [Expo Router](https://docs.expo.dev/routing/introduction/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## Support

For issues or questions:
1. Check console logs: `npm start` shows errors
2. Review README.md for detailed documentation
3. Check TypeScript errors in your IDE
4. Restart dev server if needed

## Production Build

When ready to deploy:

```bash
# iOS Build
expo build:ios

# Android Build
expo build:android

# Submit to app stores
# Follow: https://docs.expo.dev/deploy/submit-to-app-stores/
```

---

**Ready to launch? Start with: `npm install && npm start`** 🚀
