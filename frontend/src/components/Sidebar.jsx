import { NavLink } from 'react-router-dom';
import {
  HiOutlineHome,
  HiOutlineCube,
  HiOutlineChartBar,
  HiOutlineUsers,
  HiOutlineSparkles,
  HiOutlineCog6Tooth,
  HiOutlineXMark,
} from 'react-icons/hi2';
import { HiOutlineShoppingBag } from 'react-icons/hi';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: HiOutlineHome },
  { to: '/products', label: 'Products', icon: HiOutlineCube },
  { to: '/analytics', label: 'Analytics', icon: HiOutlineChartBar },
  { to: '/customers', label: 'Customers', icon: HiOutlineUsers },
  { to: '/ai-insights', label: 'AI Insights', icon: HiOutlineSparkles },
  { to: '/settings', label: 'Settings', icon: HiOutlineCog6Tooth },
];

export const Sidebar = ({ isOpen, onClose }) => (
  <>
    {isOpen && (
      <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={onClose} />
    )}
    <aside
      className={`fixed left-0 top-0 z-50 flex h-full w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-300 dark:border-slate-800 dark:bg-slate-900 lg:static lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-white shadow-lg shadow-brand-600/30">
            <HiOutlineShoppingBag className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-900 dark:text-white">SmartStore AI</h1>
            <p className="text-xs text-slate-500">Admin Dashboard</p>
          </div>
        </div>
        <button onClick={onClose} className="rounded-lg p-2 lg:hidden dark:hover:bg-slate-800">
          <HiOutlineXMark className="h-5 w-5" />
        </button>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
            }
          >
            <Icon className="h-5 w-5" />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-slate-200 p-4 dark:border-slate-800">
        <p className="text-xs text-slate-400">Powered by OpenAI</p>
      </div>
    </aside>
  </>
);
