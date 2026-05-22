import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { authService } from '../services/authService';
import { useToast } from '../context/ToastContext';

export default function Settings() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const toast = useToast();
  const [threshold, setThreshold] = useState(10);
  const [notifications, setNotifications] = useState(true);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await authService.updateSettings({
        theme,
        notifications,
        lowStockThreshold: threshold,
      });
      toast.success('Settings saved');
    } catch {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Settings</h2>
        <p className="text-sm text-slate-500">Manage your account and preferences</p>
      </div>

      <div className="glass-card-light space-y-6 p-6 dark:glass-card">
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-white">Profile</h3>
          <div className="mt-4 space-y-3">
            <div>
              <label className="text-sm text-slate-500">Name</label>
              <p className="font-medium text-slate-900 dark:text-white">{user?.name}</p>
            </div>
            <div>
              <label className="text-sm text-slate-500">Email</label>
              <p className="font-medium text-slate-900 dark:text-white">{user?.email}</p>
            </div>
            <div>
              <label className="text-sm text-slate-500">Role</label>
              <p className="font-medium capitalize text-slate-900 dark:text-white">{user?.role}</p>
            </div>
          </div>
        </div>

        <hr className="border-slate-200 dark:border-slate-700" />

        <div>
          <h3 className="font-semibold text-slate-900 dark:text-white">Appearance</h3>
          <div className="mt-4 flex gap-3">
            {['light', 'dark'].map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={`rounded-xl px-4 py-2 text-sm font-medium capitalize transition ${
                  theme === t
                    ? 'bg-brand-600 text-white'
                    : 'border border-slate-300 text-slate-600 dark:border-slate-600 dark:text-slate-400'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <hr className="border-slate-200 dark:border-slate-700" />

        <div>
          <h3 className="font-semibold text-slate-900 dark:text-white">Inventory Alerts</h3>
          <div className="mt-4">
            <label className="mb-1 block text-sm text-slate-500">Low stock threshold</label>
            <input
              type="number"
              className="input-field max-w-xs"
              value={threshold}
              onChange={(e) => setThreshold(parseInt(e.target.value, 10))}
              min={1}
            />
          </div>
          <label className="mt-4 flex items-center gap-2">
            <input
              type="checkbox"
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
            />
            <span className="text-sm text-slate-600 dark:text-slate-400">Enable notifications</span>
          </label>
        </div>

        <button onClick={handleSave} disabled={saving} className="btn-primary">
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}
