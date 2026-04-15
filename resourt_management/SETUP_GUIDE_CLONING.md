# 🚀 DineSmart: Complete Cloning & Setup Guide

This guide is for a new developer or team member who has cloned the DineSmart repositories and needs to get both the **Backend** and **Frontend** running on their local machine using **Supabase** and **Text.lk**.

---

## 🛠️ Phase 1: Prerequisites

Before you start, ensure you have the following installed on your Windows machine:

1.  **Node.js (LTS Version):** [Download here](https://nodejs.org/).
2.  **Memurai (Developer Edition):** [Download here](https://www.memurai.com/). (This is the Windows equivalent of Redis, required for OTP and caching).
3.  **Git:** To clone the repositories.

---

## ☁️ Phase 2: Supabase (Cloud Database) Setup

You need your own Supabase project.

1.  **Create a Project:** Go to [Supabase](https://supabase.com/) and create a new project.
2.  **Import Schema:**
    *   Open your project's **SQL Editor**.
    *   Copy the contents of `backend/src/db/schema.sql` and run it in the SQL Editor to create all tables and indexes.
3.  **Setup Storage:**
    *   Go to **Storage** in Supabase.
    *   Create a **New Bucket** named `menu-images`.
    *   Set it to **Public** so the app can display the images.
4.  **Get Credentials:**
    *   Go to **Project Settings** > **API**.
    *   Note down your **Project URL**, **anon public Key**, and **service_role Key**.
    *   Go to **Project Settings** > **Database**.
    *   Note down your **Connection String** (Transaction Pooler is recommended).

---

## ⚙️ Phase 3: Backend Setup (`restaurant-management-system-api`)

1.  **Clone the Repository:**
    ```bash
    git clone https://github.com/Thaheshan/restaurant-management-system-api.git
    cd restaurant-management-system-api/backend
    ```
2.  **Create `.env` File:**
    Create a file named `.env` in the `backend/` folder and paste the following, replacing the values with your Supabase and Text.lk details:

    ```env
    # --- Database (Supabase)
    DATABASE_URL=your_supabase_connection_string
    DB_HOST=your_supabase_host
    DB_PORT=5432
    DB_NAME=postgres
    DB_USER=postgres.[your-project-ref]
    DB_PASSWORD=your_database_password

    # --- Supabase Storage & API
    SUPABASE_URL=your_supabase_url
    SUPABASE_SERVICE_KEY=your_supabase_service_role_key
    SUPABASE_ANON_KEY=your_supabase_anon_key

    # --- Auth & Gateway
    JWT_SECRET=choose_a_random_secret_string
    PORT=8000
    API_GATEWAY_PORT=8000

    # --- Redis (Memurai)
    REDIS_URL=redis://localhost:6379

    # --- SMS (Text.lk)
    TEXT_LK_TOKEN=your_text_lk_api_token
    TEXT_LK_SENDER_ID=your_sender_id
    ```
3.  **Install & Start:**
    ```bash
    npm install
    npm run start
    ```
    *You should see "All services started successfully!"*

---

## 💻 Phase 4: Frontend Setup (`restaurant-management-system-web`)

1.  **Clone the Repository:**
    ```bash
    git clone https://github.com/Thaheshan/restaurant-management-system-web.git
    cd restaurant-management-system-web/resourt_management/app
    ```
2.  **Create `.env.local` File:**
    Inside the `resourt_management/app` folder, create a file named `.env.local`:

    ```env
    NEXT_PUBLIC_API_URL=http://localhost:8000/api
    ```
3.  **Install & Start:**
    ```bash
    npm install --legacy-peer-deps
    npm run dev
    ```
    *The website will be available at `http://localhost:3000`.*

---

## 🔑 Phase 5: Creating Your Admin Account

Once both are running:
1.  Go to `http://localhost:3000/admin/login`.
2.  Since the database is new, you need to register a new admin.
3.  You can use a tool like **Postman** or **PowerShell** to create the first admin:

    **PowerShell Command:**
    ```powershell
    Invoke-RestMethod -Uri "http://localhost:3001/register" -Method Post -ContentType "application/json" -Body '{"name":"System Admin", "email":"admin@example.com", "password":"password123", "mobile":"1234567890", "role":"admin"}'
    ```

---

## ⚠️ Common Issues & Fixes

*   **"npm not recognized":** Ensure Node.js is installed and you have restarted your terminal.
*   **"Login Failed":** Ensure the backend is running and the `.env` values (especially `JWT_SECRET`) are consistent.
*   **"Redis Error":** Ensure Memurai is running in the background.
*   **"Supabase error":** Double-check your database passwords and connection string.
