import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthLayout } from '../layouts/AuthLayout';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { ProtectedRoute } from './ProtectedRoute';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import Dashboard from '../pages/Dashboard';
import Products from '../pages/Products';
import Analytics from '../pages/Analytics';
import AIInsights from '../pages/AIInsights';
import Settings from '../pages/Settings';
import CustomerStore from '../pages/CustomerStore';
import CustomerOrders from '../pages/CustomerOrders';

export const AppRoutes = () => (
  <Routes>
    <Route element={<AuthLayout />}>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Route>
    <Route element={<DashboardLayout />}>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/products" element={<Products />} />
      <Route path="/analytics" element={<Analytics />} />
      <Route path="/ai-insights" element={<AIInsights />} />
      <Route path="/settings" element={<Settings />} />
    </Route>
    <Route
      path="/"
      element={
        <ProtectedRoute>
          <CustomerStore />
        </ProtectedRoute>
      }
    />
    <Route
      path="/orders"
      element={
        <ProtectedRoute>
          <CustomerOrders />
        </ProtectedRoute>
      }
    />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);
