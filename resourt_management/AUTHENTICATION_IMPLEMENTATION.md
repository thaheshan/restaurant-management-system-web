# Authentication Implementation - Mobile App Update

## What Was Added

### 1. Customer Authentication System
A complete phone-based authentication system for mobile app customers.

**Files Created:**
- `apps/mobile/src/contexts/CustomerAuthContext.tsx` - Auth context provider
- `apps/mobile/app/(auth)/login.tsx` - Login screen
- `apps/mobile/app/(auth)/signup.tsx` - Sign up screen
- `apps/mobile/app/(auth)/_layout.tsx` - Auth navigation layout
- `apps/mobile/app/(customer)/home.tsx` - Home screen with QR scanner
- `apps/mobile/AUTH_FLOW.md` - Authentication flow documentation

**Files Updated:**
- `apps/mobile/app/_layout.tsx` - Root layout with conditional auth routing
- `apps/mobile/app/index.tsx` - Entry point with auth-based redirection

---

## Authentication Flow

### Architecture
```
┌─────────────────┐
│   App Launch    │
│   (index.tsx)   │
└────────┬────────┘
         │
         ▼
┌─────────────────────────┐
│ Check Auth State        │
│ (useCustomerAuth)       │
└────────┬────────────────┘
         │
         ├─ No Auth ──────────→ Login/Signup Screens
         │                      ├─ Login
         │                      └─ Sign Up
         │
         └─ Authenticated ────→ Home Screen
                               ├─ QR Scanner
                               ├─ Menu Categories
                               ├─ Ordering Flow
                               └─ Logout
```

### User Flows

#### Sign Up
```
1. App Launch → Not Authenticated
2. Redirect to Login Screen
3. Click "Sign Up"
4. Enter: Name, Phone, Email (optional)
5. Validate: Phone must be 10 digits
6. Create: New user account
7. Auto-login & Redirect to Home Screen
```

#### Login
```
1. App Launch → Not Authenticated
2. Redirect to Login Screen
3. Enter: Phone Number (10 digits)
4. Validate: Phone exists in system
5. Login & Redirect to Home Screen
```

#### QR Scanning
```
1. Home Screen → Click "Open Scanner"
2. Request Camera Permission
3. Camera Opens with Overlay
4. Position QR Code in Frame
5. Auto-detect & Process QR
6. Parse: restaurantId & tableId
7. Navigate: Menu Categories with params
```

#### Logout
```
1. Home Screen → Click "Logout"
2. Confirm: "Are you sure?"
3. Clear: User session
4. Redirect: Back to Login Screen
```

---

## Screen Details

### 1. Login Screen (`app/(auth)/login.tsx`)
**Purpose**: Authenticate existing customers

**Components:**
- Header with DineSmart branding
- Welcome message
- Phone number input field
- Login button
- Sign up link
- Demo credentials info box

**Input:**
- Phone number (10 digits)

**Actions:**
- Login with valid phone
- Navigate to signup screen
- Show errors for invalid phone

**Design:**
- Green header (#2B7C4F)
- White background
- Consistent typography
- Keyboard-aware layout

---

### 2. Sign Up Screen (`app/(auth)/signup.tsx`)
**Purpose**: Create new customer account

**Components:**
- Header with DineSmart branding
- "Create Account" message
- Name input field
- Phone number input field
- Email input field (optional)
- Sign up button
- Login link

**Inputs:**
- Full Name (required)
- Phone Number (required, 10 digits, unique)
- Email (optional)

**Validations:**
- Name not empty
- Phone is 10 digits
- Phone not already registered
- Email format (if provided)

**Design:**
- Green header (#2B7C4F)
- Multiple input fields with labels
- Clear validation messages
- Loading state during signup

---

### 3. Home Screen (`app/(customer)/home.tsx`)
**Purpose**: Main hub after login with QR scanning

**Components:**
- Header with branding and logout button
- Welcome card with user's name
- QR scanner section with:
  - Dashed border box
  - Scanner icon
  - Scan button
  - Instructions
- Features list (4 items)
- Demo QR code formats

**Features:**
1. **Header Section**
   - DineSmart branding
   - "Welcome, {name}"
   - Logout button

2. **QR Scanner**
   - Camera permission handling
   - Full-screen scanner overlay
   - Frame indicator
   - Scanning instructions
   - Close button
   - Loading state during processing

3. **Features Display**
   - View Menu
   - Place Order
   - Track Status
   - View History

4. **Demo Info**
   - Sample QR code formats
   - Testing instructions

**QR Code Support:**
```
Full Format:
dinesmart://restaurant/{restaurantId}/table/{tableId}

Simple Format:
dinesmart://table/{tableId}
```

**Navigation:**
- Successful scan → Menu Categories with restaurantId & tableId
- Invalid QR → Error alert

---

## Context: CustomerAuthContext

```typescript
interface CustomerUser {
  id: string;           // Unique identifier
  phone: string;        // 10-digit phone number
  email?: string;       // Optional email
  name: string;         // Full name
}

interface CustomerAuthContextType {
  user: CustomerUser | null;
  isLoggedIn: boolean;
  signup: (phone, name, email?) => Promise<void>;
  login: (phone) => Promise<void>;
  logout: () => void;
}
```

### Methods

#### `signup(phone: string, name: string, email?: string)`
- Validates 10-digit phone
- Checks if phone already registered
- Creates new user account
- Auto-logs in new user
- Redirects to home screen

#### `login(phone: string)`
- Validates 10-digit phone
- Checks if phone registered
- Authenticates user
- Sets isLoggedIn to true
- Redirects to home screen

#### `logout()`
- Clears user session
- Sets user to null
- Sets isLoggedIn to false
- Redirects to login screen

---

## Root Layout Conditional Routing

```typescript
function RootLayoutContent() {
  const { isLoggedIn } = useCustomerAuth();

  return (
    <Stack>
      {!isLoggedIn ? (
        // Show auth screens
        <Stack.Group>
          <Stack.Screen name="(auth)" />
        </Stack.Group>
      ) : (
        // Show app screens
        <>
          <Stack.Group>
            <Stack.Screen name="(customer)" />
          </Stack.Group>
          <Stack.Group>
            <Stack.Screen name="(admin)" />
          </Stack.Group>
        </>
      )}
    </Stack>
  );
}
```

---

## Demo Credentials

### Pre-registered Users (for login)
```
Phone: 9876543210
Name: John Doe
Email: customer@example.com

Phone: 9123456789
Name: Jane Smith
Email: customer2@example.com
```

### Sign Up
- Create account with any 10-digit phone number not in the system
- Example: 9988776655 (if not used)

### QR Code Examples (for testing)
```
dinesmart://restaurant/rest-1/table/101
dinesmart://restaurant/rest-2/table/205
dinesmart://table/301
```

---

## Security Implementation (Development)

### Current
- Phone-based authentication
- 10-digit phone validation
- Unique phone enforcement
- In-memory user storage
- Mock user database

### Validation
- Phone must be exactly 10 digits
- Phone must be unique
- Name required on signup
- Email optional but validated if provided

### For Production
- Implement OTP/SMS verification
- Use secure API endpoints
- Implement proper backend authentication
- Hash and salt password storage
- Use JWT tokens for sessions
- Implement refresh token mechanism
- Add rate limiting for failed attempts
- Use HTTPS for all communications
- Implement device fingerprinting
- Add suspicious activity detection

---

## Testing Scenarios

### Scenario 1: Fresh Install (New User)
1. App launches
2. Shows splash screen then redirects to Login
3. Click "Sign Up"
4. Enter: Name, Phone (9988776655), Email
5. Click "Sign Up"
6. App creates account and logs in
7. Shows Home Screen with "Welcome, [Name]"

### Scenario 2: Returning User (Login)
1. App launches
2. Shows Login Screen
3. Enter: Phone (9876543210)
4. Click "Login"
5. Shows Home Screen with "Welcome, John Doe"

### Scenario 3: QR Scanning
1. From Home Screen
2. Click "Open Scanner"
3. Allow camera permission
4. Scan QR code: `dinesmart://restaurant/rest-1/table/101`
5. Auto-processes and navigates to Menu Categories
6. Shows "Table 101" in header

### Scenario 4: Invalid QR Code
1. From Home Scanner
2. Scan any non-DineSmart QR code
3. Shows alert: "Invalid QR Code"
4. Scanner stays open for retry

### Scenario 5: Logout
1. From Home Screen
2. Click "Logout" button (top right)
3. Confirm logout
4. Redirects to Login Screen
5. All session data cleared

---

## Navigation Structure

```
Entry Point
    ↓
[Not Authenticated]
    ↓
(auth) Group
    ├─ login
    │  └─ Click "Sign Up" → signup
    │  └─ Enter phone → success → (customer)
    └─ signup
       └─ Fill form → success → (customer)

[Authenticated]
    ↓
(customer) Group
    ├─ home ← Main entry after login
    │  ├─ Logout → (auth)
    │  ├─ Scan QR → menu-categories
    │  ├─ Click item → product-detail
    │  └─ Add to cart → cart
    ├─ menu-categories
    ├─ menu-items/[category]
    ├─ product-detail/[id]
    ├─ cart
    ├─ order-summary
    ├─ payment-method
    ├─ order-confirmation
    ├─ order-tracking
    └─ order-history

(admin) Group
    ├─ admin-login
    ├─ dashboard
    ├─ orders-management
    ├─ inventory
    ├─ hygiene-compliance
    ├─ expiry-alerts
    └─ staff-profile
```

---

## Key Changes Summary

| Component | Change | Impact |
|-----------|--------|--------|
| Root Layout | Added auth conditional routing | Users now routed based on login status |
| Index Screen | Changed to auth redirect | Entry point checks auth and redirects |
| Home Screen | NEW screen with QR scanner | Central hub after login |
| Login Screen | NEW authentication | Customers can log in |
| Sign Up Screen | NEW registration | New customers can create accounts |
| Menu Categories | Updated with params | Now receives restaurantId & tableId from QR |
| Contexts | Added CustomerAuthContext | Manages customer auth state |

---

## Files Modified vs. Created

### New Files (9)
1. `CustomerAuthContext.tsx`
2. `login.tsx`
3. `signup.tsx`
4. `(auth)/_layout.tsx`
5. `home.tsx`
6. `AUTH_FLOW.md`
7. `SYSTEM_OVERVIEW_UPDATED.md`
8. `AUTHENTICATION_IMPLEMENTATION.md`
9. `(auth)/_layout.tsx`

### Modified Files (2)
1. `app/_layout.tsx` - Added CustomerAuthProvider and conditional routing
2. `app/index.tsx` - Changed to auth-based redirect

---

## Dependencies

No new npm packages required. Uses existing:
- `expo-router` - Navigation
- `expo-camera` - QR scanning
- React Context API - State management
- React Native - UI

---

## Environment Setup

No special environment variables needed for development. For production:
- `API_BASE_URL` - Backend API endpoint
- `AUTH_TOKEN_SECRET` - For JWT signing
- `SMS_PROVIDER_KEY` - For OTP delivery
- `ENVIRONMENT` - Development/Production flag

---

## Next Steps

### Immediate
1. Test login/signup with provided credentials
2. Test QR scanning with demo QR codes
3. Verify navigation between screens
4. Test logout functionality

### Short Term
1. Integrate with backend API
2. Implement real OTP/SMS verification
3. Add password-based authentication option
4. Store user preferences

### Medium Term
1. Add biometric authentication
2. Implement social login
3. Add user profile management
4. Implement secure token storage

### Long Term
1. Two-factor authentication
2. Advanced fraud detection
3. Loyalty program integration
4. Advanced analytics

---

## Troubleshooting

### "Invalid Credentials" when Login
- Ensure phone is exactly 10 digits
- No spaces or special characters
- Check if phone is registered (sign up if not)

### QR Scanner Not Opening
- Grant camera permissions in settings
- Check app permissions in device settings
- Ensure good lighting for QR detection

### Logout Not Working
- Try again - may need confirmation
- Check if logout button is visible
- Scroll up if button is off-screen

### Sign Up Failing
- Phone number already in use - use different number
- Phone must be 10 digits
- Name cannot be empty

---

## Documentation
- **AUTH_FLOW.md** - Complete authentication documentation
- **SYSTEM_OVERVIEW_UPDATED.md** - Full system with auth
- **AUTHENTICATION_IMPLEMENTATION.md** - This file

---

## Status: ✅ Complete

The authentication system is fully implemented and ready for use!
