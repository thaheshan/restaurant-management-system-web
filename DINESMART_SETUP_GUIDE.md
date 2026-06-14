# 🚀 DineSmart Full-Stack Setup Guide

This guide will walk you through setting up and running the **Backend API**, **Web Admin Dashboard**, and **Mobile Customer App** simultaneously using **Ngrok** for external connectivity (required for Mobile/Physical devices).

---

## 🛠 Prerequisites

- **Node.js** (v18 or higher)
- **npm** (v9 or higher)
- **Ngrok** installed on your system ([Download here](https://ngrok.com/download))
- **Expo Go** app installed on your physical mobile device (Android/iOS)

---

## 📂 Repository Structure

1. **Backend**: `restaurant-management-system-api/backend`
2. **Web Admin**: `restaurant-management-system-web/resourt_management`
3. **Mobile App**: `restaurant-management-system-web/resourt_management/apps/mobile`

---

## 1️⃣ Step 1: Start the Backend API

1.  Open a terminal in the backend directory:
    ```powershell
    cd C:\Users\Thahe\Documents\GitHub\restaurant-management-system-api\backend
    ```
2.  Install dependencies:
    ```powershell
    npm install
    ```
3.  Ensure your `.env` file is configured (it should already have the Supabase details).
4.  Start the server:
    ```powershell
    npm run dev
    ```
    *The server will start on **http://localhost:8000**.*

---

## 2️⃣ Step 2: Start Ngrok Tunnel

To make the backend accessible to your Mobile phone and the Web app, you must expose it via Ngrok.

1.  Open a **NEW** terminal.
2.  Run the following command:
    ```powershell
    ngrok http 8000
    ```
3.  Look for the **Forwarding** URL in the terminal (e.g., `https://a1b2-c3d4.ngrok-free.dev`).
4.  **COPY THIS URL.** You will need it for the next steps.

---

## 3️⃣ Step 3: Setup Web Admin Dashboard

1.  Open a terminal in the web directory:
    ```powershell
    cd C:\Users\Thahe\Documents\GitHub\restaurant-management-system-web\resourt_management
    ```
2.  Install dependencies:
    ```powershell
    npm install
    ```
3.  Update the `.env.local` file:
    - Open `C:\Users\Thahe\Documents\GitHub\restaurant-management-system-web\resourt_management\.env.local`
    - Replace the `NEXT_PUBLIC_API_URL` with your Ngrok URL:
      ```env
      NEXT_PUBLIC_API_URL=https://YOUR_NGROK_URL.ngrok-free.dev/api
      ```
4.  Start the web app:
    ```powershell
    npm run dev
    ```
    *Access it at **http://localhost:3000**.*

---

## 4️⃣ Step 4: Setup Mobile Customer App

1.  Open a terminal in the mobile directory:
    ```powershell
    cd C:\Users\Thahe\Documents\GitHub\restaurant-management-system-web\resourt_management\apps\mobile
    ```
2.  Install dependencies:
    ```powershell
    npm install
    ```
3.  Update the API Configuration:
    - Open `C:\Users\Thahe\Documents\GitHub\restaurant-management-system-web\resourt_management\apps\mobile\src\services\api.ts`
    - Update the constants at the top:
      ```typescript
      const BASE_URL = "https://YOUR_NGROK_URL.ngrok-free.dev/api";
      const RESTAURANT_URL = "https://YOUR_NGROK_URL.ngrok-free.dev/api/restaurant/public";
      ```
4.  Start the Expo server:
    ```powershell
    npx expo start
    ```
5.  **Run on Device**: Scan the QR code shown in the terminal using your phone's camera (iOS) or the Expo Go app (Android).

---

## ⚠️ Important Notes & Troubleshooting

### 1. Ngrok URL Expiry
Every time you restart Ngrok, it generates a **NEW** URL. You must update:
- `.env.local` in the Web project.
- `src/services/api.ts` in the Mobile project.

### 2. Ngrok Browser Warning
When you first open the Ngrok URL on a device, you might see a "Warning" page. The mobile app handles this automatically with the `ngrok-skip-browser-warning` header, but if you open it in a browser, just click **"Visit Site"**.

### 3. Port Conflicts
- **Backend**: Uses port 8000.
- **Web**: Uses port 3000.
- **Expo**: Uses port 8081.
Make sure no other apps are using these ports.

### 4. Supabase Connection
Ensure your internet connection is active, as the backend connects to a remote Supabase database.
