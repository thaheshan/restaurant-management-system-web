# DineSmart Mobile App - Authentication Flow

## Overview

The mobile app now includes a complete authentication system for customers. Users must log in or sign up before they can access the QR scanner and order food.

---

## Authentication Architecture

### Components

1. **CustomerAuthContext** - Manages customer login/signup state
   - Stores authenticated user information
   - Provides login and signup methods
   - Maintains isLoggedIn flag

2. **Root Layout (_layout.tsx)** - Conditional Navigation
   - Routes based on authentication state
   - Shows auth screens if not logged in
   - Shows customer/admin screens if logged in

3. **Auth Screens**
   - **login.tsx** - Phone-based login
   - **signup.tsx** - Phone-based signup with name

4. **Home Screen** - Main entry point after login
   - Displays welcome message with user name
   - Provides QR scanner access
   - Shows logout button
   - Lists available features

---

## User Flow

### New User (Sign Up)
```
App Start
    ↓
(Not authenticated)
    ↓
Login Screen
    ↓
Click "Sign Up" or navigate to signup
    ↓
Sign Up Screen
    ├─ Enter Name
    ├─ Enter Phone (10 digits)
    ├─ Optional: Enter Email
    └─ Click "Sign Up"
    ↓
Home Screen (authenticated)
    ↓
Scan QR Code or view menu
```

### Existing User (Login)
```
App Start
    ↓
(Not authenticated)
    ↓
Login Screen
    ├─ Enter Phone (10 digits)
    └─ Click "Login"
    ↓
Home Screen (authenticated)
    ↓
Scan QR Code or view menu
```

### Logout
```
Home Screen
    ↓
Click "Logout" button
    ↓
Confirm logout
    ↓
Login Screen (not authenticated)
```

---

## Authentication Details

### Login
- **Method**: Phone-based authentication
- **Requirement**: 10-digit phone number
- **Format**: Must be exactly 10 digits (123-456-7890 → 1234567890)
- **Response**: Redirects to Home Screen on success
- **Error Handling**: Shows alert for invalid credentials

### Sign Up
- **Name**: Full name (required)
- **Phone**: 10-digit phone number (required, must be unique)
- **Email**: Optional field for additional contact info
- **Validation**: 
  - Phone must be 10 digits
  - Phone number must be unique
  - All validations happen with 800ms simulated API delay

### Context State
```typescript
interface CustomerUser {
  id: string;           // Unique user ID
  phone: string;        // 10-digit phone number
  email?: string;       // Optional email
  name: string;         // User's full name
}
```

---

## Demo Credentials

You can test login with these pre-registered phone numbers:

| Phone Number | Name | Email |
|---|---|---|
| 9876543210 | John Doe | customer@example.com |
| 9123456789 | Jane Smith | customer2@example.com |

Or sign up with any new phone number not in the list above.

---

## Home Screen Features

After successful login, users see the Home Screen with:

1. **Header**
   - DineSmart branding
   - Welcome message with user's name
   - Logout button

2. **QR Scanner Section**
   - Camera permission request
   - Large scan button
   - Instructions for scanning

3. **Features List**
   - View Menu
   - Place Order
   - Track Status
   - View History

4. **Demo QR Code Info**
   - Shows sample QR code formats for testing

---

## QR Code Scanning

### How It Works

1. User clicks "Open Scanner" button
2. Camera opens with scanning overlay
3. Position QR code within the frame
4. Scanner automatically detects and processes QR

### QR Code Formats

The app supports multiple QR code formats:

#### Full Format (Restaurant + Table)
```
dinesmart://restaurant/{restaurantId}/table/{tableId}
```
Example: `dinesmart://restaurant/rest-1/table/101`

#### Simple Format (Table Only)
```
dinesmart://table/{tableId}
```
Example: `dinesmart://table/301`

### QR Code Processing

When a valid QR code is scanned:
1. Extract restaurant ID and table ID
2. Validate format
3. Navigate to Menu Categories screen with params:
   - `restaurantId`: Which restaurant
   - `tableId`: Which table

### Default Behavior
- If no restaurant ID in QR code, defaults to `rest-1`
- Table ID is required for valid QR code
- Invalid QR codes show error alert

---

## Navigation Structure

```
Entry Point (index.tsx)
    ↓
    ├─ Not Authenticated → Auth Stack
    │   ├─ Login Screen
    │   └─ Sign Up Screen
    │
    └─ Authenticated → Customer Stack
        ├─ Home Screen (with QR Scanner)
        ├─ Menu Categories
        ├─ Menu Items
        ├─ Product Detail
        ├─ Cart
        ├─ Order Summary
        ├─ Payment Method
        ├─ Order Confirmation
        ├─ Order Tracking
        └─ Order History
```

---

## Security Notes

### Current Implementation (Development)
- Credentials validated against mock users in-memory
- No actual server authentication
- Phone numbers are the unique identifier
- Passwords not implemented (simple phone-based auth)

### For Production
- Implement proper OTP/SMS verification
- Use secure API authentication
- Hash and salt password storage
- Implement token-based session management
- Add refresh token mechanism
- Implement rate limiting for failed attempts
- Add device fingerprinting

---

## Testing

### Test Login Flow
1. App launches → Shows loading screen
2. Redirects to Login screen
3. Enter phone: `9876543210`
4. Click Login
5. Navigates to Home Screen
6. Shows "Welcome, John Doe"

### Test Sign Up Flow
1. From Login screen, click "Sign Up"
2. Enter Name: `Test User`
3. Enter Phone: `9988776655` (any new number)
4. Email: `test@example.com` (optional)
5. Click "Sign Up"
6. Navigates to Home Screen with new user

### Test QR Scanning
1. From Home Screen, click "Open Scanner"
2. Scan any QR code
3. If valid DineSmart format → navigates to menu
4. If invalid format → shows error alert

### Test Logout
1. From Home Screen, click "Logout" button
2. Confirm logout in alert
3. Redirects back to Login Screen
4. All customer data cleared

---

## Implementation Files

- **Context**: `src/contexts/CustomerAuthContext.tsx`
- **Login Screen**: `app/(auth)/login.tsx`
- **Sign Up Screen**: `app/(auth)/signup.tsx`
- **Auth Layout**: `app/(auth)/_layout.tsx`
- **Home Screen**: `app/(customer)/home.tsx`
- **Root Layout**: `app/_layout.tsx`
- **Entry Point**: `app/index.tsx`

---

## Troubleshooting

### Problem: App shows blank screen
**Solution**: Check if fonts are loaded. App shows loading spinner while initializing.

### Problem: Login fails with valid credentials
**Solution**: Ensure phone number is exactly 10 digits with no spaces or special characters.

### Problem: Camera permission denied
**Solution**: Grant camera permission in app settings. Prompt asks for permission when opening scanner.

### Problem: QR code not scanning
**Solution**: 
- Ensure lighting is adequate
- Position QR code clearly within frame
- Make sure QR code matches DineSmart format

### Problem: Logout button not visible
**Solution**: Scroll up in Home Screen header to see logout button.

---

## Future Enhancements

- Biometric authentication (Face ID / Touch ID)
- Social login (Google, Apple)
- Email-based authentication
- Password-based authentication
- Two-factor authentication
- Remember me functionality
- Account recovery
- Profile management
- Payment methods storage
