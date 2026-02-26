import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Layouts
import MainLayout from "../layouts/MainLayout/MainLayout";
import AuthLayout from "../layouts/AuthLayout/AuthLayout";

// Pages
import LoginPage from "../pages/Login/LoginPage";
import RegisterPage from "../pages/Register/RegisterPage";
import DashboardPage from "../pages/Dashboard/DashboardPage";
import FoodPage from "../pages/Food/FoodPage";
import InventoryPage from "../pages/Inventory/InventoryPage";
import RolesPage from "../pages/Roles/RolesPage";
import StaffPage from "../pages/Staff/StaffPage";
import NotFoundPage from "../pages/NotFound/NotFoundPage";

// Route guard
import ProtectedRoute from "../routes/ProtectedRoute";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* ── Auth routes (use AuthLayout) ── */}
        <Route element={<AuthLayout />}>
          <Route path="/login"    element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* ── Protected routes (use MainLayout) ── */}
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index                element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard"    element={<DashboardPage />} />
          <Route path="/food"         element={<FoodPage />} />
          <Route path="/inventory"    element={<InventoryPage />} />
          <Route path="/roles"        element={<RolesPage />} />
          <Route path="/staff"        element={<StaffPage />} />
        </Route>

        {/* ── 404 ── */}
        <Route path="*" element={<NotFoundPage />} />

      </Routes>
    </BrowserRouter>
  );
};

export default App;
