# DineSmart - Quick Start Guide

## 🚀 Start Here

### Option 1: Web Admin Dashboard (Easiest to Test)

```bash
# From root directory
npm install
npm run dev

# Open browser
http://localhost:3000
```

**Login Credentials**:
- Email: `admin@dinesmart.com`
- Password: `admin123`

---

## 📱 Mobile App (React Native)

```bash
cd apps/mobile
npm install
npm start

# Scan QR code with Expo Go app
# OR run on iOS: npm run ios
# OR run on Android: npm run android
```

---

## 📁 File Structure Quick Reference

### Web Admin Dashboard
```
app/admin/
├── login/                # Admin authentication
├── dashboard/            # Main dashboard (stats, certifications)
├── orders/              # Order management with status updates
├── inventory/           # Stock tracking and management
├── hygiene/             # Hygiene & compliance dashboard
├── expiry-alerts/       # Expiring ingredients management
├── settings/            # Restaurant settings
└── layout.tsx           # Sidebar navigation

lib/
├── types/admin.ts       # TypeScript interfaces
└── data/adminMockData.ts # Mock restaurant data
```

### Mobile App
```
apps/mobile/app/
├── (customer)/
│   ├── menu-categories.tsx     # Browse menu categories
│   ├── menu-items/[category]   # Items in category
│   ├── product-detail/[id]     # Product details
│   ├── cart.tsx                # Shopping cart
│   ├── order-summary.tsx       # Order review
│   ├── payment-method.tsx      # Payment options
│   ├── order-confirmation.tsx  # Confirmation
│   ├── order-tracking.tsx      # Real-time tracking
│   └── order-history.tsx       # Past orders
│
├── (admin)/
│   ├── admin-login.tsx         # Admin authentication
│   ├── dashboard.tsx           # Admin overview
│   ├── orders-management.tsx   # Order updates
│   ├── inventory.tsx           # Stock management
│   ├── hygiene-compliance.tsx  # Compliance
│   ├── expiry-alerts.tsx       # Expiry management
│   └── staff-profile.tsx       # Admin profile
│
└── index.tsx                   # QR Scanner (Entry Point)
```

---

## 🎯 Key URLs

| Feature | URL | Demo Access |
|---------|-----|-------------|
| Landing Page | `http://localhost:3000` | ✓ Public |
| Admin Login | `http://localhost:3000/admin/login` | ✓ Public |
| Admin Dashboard | `http://localhost:3000/admin/dashboard` | admin@dinesmart.com / admin123 |
| Orders | `http://localhost:3000/admin/orders` | ✓ Login Required |
| Inventory | `http://localhost:3000/admin/inventory` | ✓ Login Required |
| Hygiene | `http://localhost:3000/admin/hygiene` | ✓ Login Required |
| Expiry Alerts | `http://localhost:3000/admin/expiry-alerts` | ✓ Login Required |
| Settings | `http://localhost:3000/admin/settings` | ✓ Login Required |

---

## 🔑 Demo Credentials

```
Email:    admin@dinesmart.com
Password: admin123
```

---

## 🎨 Design System

### Colors
- **Primary Green**: `#2B7C4F`
- **Success**: Green
- **Warning**: Orange
- **Error**: Red
- **Info**: Blue

### Spacing
- Base unit: `8px`
- Card padding: `16-24px`
- Gap between items: `12-16px`

### Typography
- H1: `32px Bold`
- H2: `24px Bold`
- H3: `20px Bold`
- Body: `16px Regular`
- Small: `14px Regular`
- Caption: `12px Regular`

---

## 🔧 Common Tasks

### Add a New Menu Item

Edit: `apps/mobile/src/services/mockData.ts`

```typescript
{
  id: 'item-10',
  name: 'New Dish',
  category: 'RICE',
  price: 2500,
  description: 'Delicious dish',
  image: 'https://...',
  ingredients: ['ingredient1', 'ingredient2']
}
```

### Update Admin Stats

Edit: `lib/data/adminMockData.ts`

```typescript
export const mockRestaurantStats: RestaurantStats = {
  totalOrders: 30,        // Update this
  pendingOrders: 5,       // Update this
  ingredientsInStock: 12,
  expiringItems: 2,
  certifications: []
}
```

### Add New Ingredient

Edit: `lib/data/adminMockData.ts`

```typescript
{
  id: 'ing-010',
  name: 'New Ingredient',
  category: 'VEGETABLE',
  quantity: 25,
  unit: 'kg',
  status: 'FRESH',
  expiryDate: '2026-04-15'
}
```

---

## 🧪 Testing Flows

### Customer App Flow
1. Start app
2. QR Scanner appears
3. Scan QR code (or manually enter `dinesmart://table/101`)
4. Menu categories load
5. Click category → Browse items
6. Click item → View details → Add to cart
7. Go to cart → Review items → Proceed
8. Order Summary → Select payment → Confirm
9. Order Tracking → View 4-step progress
10. Order History → View past orders

### Admin App Flow (Mobile)
1. Start app
2. Go to admin login
3. Enter credentials
4. Dashboard with stats
5. Orders - Update status
6. Inventory - View stock
7. Hygiene - View certifications
8. Expiry Alerts - Manage expiring items
9. Profile - Logout

### Admin Web Flow
1. Visit `http://localhost:3000/admin/login`
2. Login with credentials
3. Redirects to dashboard
4. Navigate using sidebar
5. Manage orders, inventory, hygiene, expiry
6. Update settings
7. Logout

---

## 📱 Mobile Preview

To see mobile app in browser:
```bash
cd apps/mobile
npm start
# Press 'w' to open in web browser
```

---

## 🐛 Troubleshooting

### Web App Won't Start
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Mobile App Issues
```bash
# Clear Expo cache
expo start --clear

# Or reset everything
cd apps/mobile
rm -rf node_modules
npm install
npm start
```

### Port Already in Use (3000)
```bash
# Use different port
npm run dev -- -p 3001
```

---

## 📊 Current Implementation

### What's Built ✓
- ✓ Complete customer mobile app (React Native)
- ✓ Complete admin dashboard (Next.js)
- ✓ 10 customer screens
- ✓ 7 admin mobile screens
- ✓ 7 web admin sections
- ✓ Mock data for all features
- ✓ TypeScript throughout
- ✓ Design system consistency
- ✓ Responsive layouts

### What's Not Built (Future)
- ☐ Backend API integration
- ☐ Real database
- ☐ Payment processing
- ☐ Push notifications
- ☐ Advanced analytics
- ☐ Multi-language support

---

## 🚀 Next Steps

1. **Connect to Backend**
   - Replace mock data with API calls
   - Update contexts with real data fetching

2. **Database**
   - Set up PostgreSQL/MongoDB
   - Create tables for orders, items, inventory
   - Implement relationships

3. **Authentication**
   - Replace localStorage with JWT tokens
   - Add refresh tokens
   - Implement secure password reset

4. **Deployment**
   - Deploy web to Vercel
   - Deploy mobile to App Store/Play Store

---

## 📞 Support

For issues or questions:
1. Check the code comments
2. Review DINESMART_COMPLETE_SYSTEM.md
3. Check mock data examples
4. Review TypeScript types

---

## 📄 Documentation

- `DINESMART_COMPLETE_SYSTEM.md` - Complete system documentation
- `apps/mobile/README.md` - Mobile app details
- `IMPLEMENTATION_SUMMARY.md` - Implementation details

---

**Ready to get started?**

```bash
# Option 1: Web Admin (Easy)
npm install && npm run dev

# Option 2: Mobile App
cd apps/mobile && npm install && npm start
```

Enjoy! 🎉
