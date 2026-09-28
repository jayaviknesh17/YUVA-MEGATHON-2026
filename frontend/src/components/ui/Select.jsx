import React from 'react';

export const Select = React.forwardRef(({
  label,
  options = [],
  error,
  helperText,
  className = '',
  id,
  placeholder = 'Select an option',
  ...props
}, ref) => {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label htmlFor={selectId} className="block text-xs font-medium text-surface-300">
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={selectId}
        className={`block w-full rounded-lg bg-surface-900/90 border text-surface-100 text-sm transition-colors
          focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500
          px-3.5 py-2
          ${error ? 'border-rose-500/80 focus:ring-rose-500' : 'border-surface-700/80 hover:border-surface-600'}
          ${className}`}
        {...props}
      >
        {placeholder && (
          <option value="" disabled className="bg-surface-900 text-surface-500">
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option
            key={typeof opt === 'object' ? opt.value : opt}
            value={typeof opt === 'object' ? opt.value : opt}
            className="bg-surface-900 text-surface-100"
          >
            {typeof opt === 'object' ? opt.label : opt}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-rose-400 mt-1">{error}</p>}
      {!error && helperText && <p className="text-xs text-surface-400 mt-1">{helperText}</p>}
    </div>
  );
});

Select.displayName = 'Select';
export default Select;
