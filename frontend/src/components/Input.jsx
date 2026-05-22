export const Input = ({ label, error, className = '', ...props }) => (
  <div className={className}>
    {label && (
      <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>
    )}
    <input className={`input-field ${error ? 'border-rose-500' : ''}`} {...props} />
    {error && <p className="mt-1 text-xs text-rose-600">{error}</p>}
  </div>
);

export const TextArea = ({ label, error, className = '', rows = 4, ...props }) => (
  <div className={className}>
    {label && (
      <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>
    )}
    <textarea className={`input-field min-h-[${rows * 24}px]`} rows={rows} {...props} />
    {error && <p className="mt-1 text-xs text-rose-600">{error}</p>}
  </div>
);

export const Select = ({ label, options = [], className = '', ...props }) => (
  <div className={className}>
    {label && (
      <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>
    )}
    <select className="input-field" {...props}>
      {options.map((opt) =>
        typeof opt === 'string' ? (
          <option key={opt} value={opt}>{opt}</option>
        ) : (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        )
      )}
    </select>
  </div>
);
