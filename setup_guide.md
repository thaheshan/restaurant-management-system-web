# DineSmart Complete Windows Installation Guide

This guide is written specifically for someone who is not a software developer. By following these steps exactly, you will download the necessary tools and get both the DineSmart **backend server** and **web application** running perfectly on a new Windows laptop.

---

## 🛠️ Phase 1: Download Required Software

Before you touch any project folders, you need to install three pieces of background software that power the system.

### 1. Node.js (The Engine)
1. Go to [https://nodejs.org/](https://nodejs.org/en/download/).
2. Download the **LTS (Long Term Support)** version for Windows.
3. Open the downloaded file and install it by clicking "Next" repeatedly until it's done. Leave all default checkboxes exactly as they are.

### 2. PostgreSQL (The Database)
1. Go to [https://www.enterprisedb.com/downloads/postgres-postgresql-downloads](https://www.enterprisedb.com/downloads/postgres-postgresql-downloads).
2. Download **version 16** (or the latest version) for Windows x86-64.
3. Open the installer. During the setup:
   - **Important:** It will ask you to create a "Superuser" password. Type `password` (all lowercase). Do not forget this!
   - Write down the port number it shows (usually `5432`). 
   - Leave the rest of the settings as default and finish the installation.

### 3. Memurai (The Temporary Storage / Windows equivalent to Redis)
The backend requires "Redis", which runs differently on Windows. We use a perfect equivalent called Memurai.
1. Go to [https://www.memurai.com/](https://www.memurai.com/).
2. Click **Download Memurai Developer** (it's free).
3. Run the installer and click "Next" through the prompts to finish. It will automatically start running in the background forever.

---

## 📁 Phase 2: Copy the Folders

Now, bring your two DineSmart folders onto the new laptop. 

For the easiest experience, copy both of these folders directly into your `Documents` folder:
1. `restaurant-management-system-api` (This is the Backend)
2. `restaurant-management-system-web` (This is the Frontend Interface)

---

## ⚙️ Phase 3: Setup the Backend (API)

### 1. Create the Database Link File
1. Open the `restaurant-management-system-api` folder.
2. Open the `backend` folder.
3. If there is a file named `.env.example`, right-click it, click **Rename**, and change it to exactly `.env` (make sure there's no visible file extension like `.env.txt`).
4. If there is no such file, right click an empty space > **New** > **Text Document**. Name it exactly `.env` (delete the `.txt` part).
5. Open this `.env` file in Notepad and paste exactly this inside:

```
DATABASE_URL=postgresql://postgres:password@localhost:5432/dinesmart
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_super_secret_jwt_key_here
```
*(Note: If you made a different password during the PostgreSQL install, replace the word `password` above with what you created).*

### 2. Install and Start the Backend
1. Inside the `backend` folder, click on the long white address bar at the very top of your folder window.
2. Delete the text in it, type `cmd`, and press **Enter**. A black text box (terminal) will pop up.
3. Type the following command and hit **Enter**:
   ```
   npm install
   ```
   *Wait 1-2 minutes for it to download all the coding packages. You'll know it's done when the text stops moving.*
4. After it finishes, type this to start the server:
   ```
   npm run start
   ```
5. You should see text saying `"Initializing database..."` and `"All services started successfully!"`. **Do not close this black window.** Minimize it. The backend is now alive.

---

## 💻 Phase 4: Setup the Frontend (Web App)

### 1. Create the Interface Link File
1. Open the second folder: `restaurant-management-system-web`.
2. Open the `resourt_management` folder.
3. Just like before, create a new text file named `.env` and open it in Notepad.
4. Paste exactly this inside:
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```
*(This tells the visual website where to talk to the backend you just turned on).*

### 2. Install and Start the Interface
1. Just like before, click the address bar inside the `resourt_management` folder, type `cmd`, and press **Enter** to open a second black terminal window.
2. Type and hit **Enter**:
   ```
   npm install --legacy-peer-deps
   ```
   *Wait a few minutes as it downloads the screen libraries.*
3. Once that finishes, type this to turn on the website:
   ```
   npm run dev
   ```
4. You will eventually see text saying `Ready in ...` or `Local: http://localhost:3000`. **Do not close this black window either.**

---

## 🚀 Phase 5: You're Done!

Everything is now fully connected and running exactly like it did on the old laptop.

1. Open **Google Chrome** (or any browser).
2. Type `http://localhost:3000` (or whatever address the last black box told you) into the search bar.
3. You will see the DineSmart login screen!

> **⚠️ Important Daily Check:** 
> Every time you turn this laptop off and back on again, you will need to open those two black `cmd` windows (one in the `backend` folder, one in the `resourt_management` folder) and type `npm run start` / `npm run dev` in both of them to "turn the kitchen back on". PostgreSQL and Memurai will start by themselves automatically.
