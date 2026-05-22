import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiOutlineShoppingBag } from 'react-icons/hi';
import { LoadingSpinner } from '../components/LoadingSpinner';

export const AuthLayout = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  return (
    <div className="flex min-h-screen">
      <div className="hidden w-1/2 flex-col justify-between bg-gradient-to-br from-brand-700 via-brand-800 to-slate-900 p-12 lg:flex">
        <div className="flex items-center gap-3 text-white">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur">
            <HiOutlineShoppingBag className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold">SmartStore AI</h1>
            <p className="text-sm text-brand-200">Intelligent E-commerce Admin</p>
          </div>
        </div>
        <div>
          <h2 className="text-4xl font-bold leading-tight text-white">
            Manage your store with AI-powered insights
          </h2>
          <p className="mt-4 text-lg text-brand-200">
            Product management, analytics, and OpenAI content generation — all in one dashboard.
          </p>
        </div>
        <p className="text-sm text-brand-300">© 2026 SmartStore AI</p>
      </div>
      <div className="flex flex-1 items-center justify-center bg-slate-50 p-8 dark:bg-slate-950">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
