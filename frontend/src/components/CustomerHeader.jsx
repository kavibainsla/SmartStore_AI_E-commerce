import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiOutlineSun, HiOutlineMoon, HiOutlineShoppingCart, HiOutlineUser, HiOutlineSparkles, HiOutlineMagnifyingGlass, HiOutlineArrowRightOnRectangle } from 'react-icons/hi2';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export const CustomerHeader = ({ cartCount, onCartClick, searchVal, onSearchChange }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/70 px-4 backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/70 sm:px-8">
      {/* Brand Logo */}
      <Link to="/" className="flex items-center gap-2 transition hover:scale-105">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 shadow-md shadow-brand-500/25">
          <HiOutlineSparkles className="h-5 w-5 text-white" />
        </div>
        <div className="hidden sm:block">
          <h1 className="text-md font-bold bg-gradient-to-r from-brand-600 to-indigo-500 bg-clip-text text-transparent dark:from-brand-400 dark:to-indigo-300">
            SmartStore AI
          </h1>
          <p className="text-[10px] font-medium text-slate-500">Storefront</p>
        </div>
      </Link>

      {/* Dynamic Search Bar (Only shown on shop page) */}
      <div className="mx-4 flex max-w-md flex-1 items-center gap-2">
        <div className="relative w-full">
          <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search premium products..."
            value={searchVal}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-4 text-xs text-slate-900 outline-none transition focus:border-brand-500 focus:bg-white dark:border-slate-800 dark:bg-slate-900/50 dark:text-white dark:focus:border-brand-500 dark:focus:bg-slate-900"
          />
        </div>
      </div>

      {/* Action Navigation Items */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Toggle Theme */}
        <button
          onClick={toggleTheme}
          className="rounded-xl p-2 text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900"
          title="Toggle Theme"
        >
          {theme === 'dark' ? <HiOutlineSun className="h-5 w-5" /> : <HiOutlineMoon className="h-5 w-5" />}
        </button>

        {/* Shopping Cart Button */}
        <button
          onClick={onCartClick}
          className="relative rounded-xl p-2 text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900"
          title="Open Cart"
        >
          <HiOutlineShoppingCart className="h-5 w-5" />
          {cartCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white animate-pulse">
              {cartCount}
            </span>
          )}
        </button>

        {/* User Dropdown Toggle */}
        <div className="relative">
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-2 rounded-xl p-1.5 transition hover:bg-slate-100 dark:hover:bg-slate-900"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white">
              {user?.name?.charAt(0)?.toUpperCase() || <HiOutlineUser className="h-4 w-4" />}
            </div>
            <span className="hidden text-xs font-medium text-slate-700 dark:text-slate-300 sm:block max-w-[80px] truncate">
              {user?.name}
            </span>
          </button>

          {profileDropdownOpen && (
            <>
              {/* Overlay Backdrop to Close Dropdown */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setProfileDropdownOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-52 origin-top-right rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl dark:border-slate-800 dark:bg-slate-900 z-50 animate-fade-in">
                <div className="border-b border-slate-100 px-3 py-2.5 dark:border-slate-800">
                  <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                    {user?.name}
                  </p>
                  <p className="text-[10px] text-slate-500 truncate">{user?.email}</p>
                  <span className="mt-1 inline-block rounded-full bg-brand-100 px-2 py-0.5 text-[9px] font-bold text-brand-700 dark:bg-brand-900/30 dark:text-brand-400">
                    ✨ Customer
                  </span>
                </div>
                <div className="mt-1 space-y-1">
                  <Link
                    to="/orders"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    📦 My Purchase Orders
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/20"
                  >
                    <HiOutlineArrowRightOnRectangle className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
