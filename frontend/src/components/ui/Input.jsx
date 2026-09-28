import React from 'react';

export const Input = React.forwardRef(({
  label,
  error,
  helperText,
  icon: Icon,
  className = '',
  id,
  type = 'text',
  ...props
}, ref) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-medium text-surface-300">
          {label}
        </label>
      )}
      <div className="relative rounded-lg shadow-sm">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-surface-400">
            <Icon className="h-4 w-4" />
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          type={type}
          className={`block w-full rounded-lg bg-surface-900/90 border text-surface-100 placeholder-surface-500 text-sm transition-colors
            focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500
            ${Icon ? 'pl-9' : 'pl-3.5'} pr-3.5 py-2
            ${error ? 'border-rose-500/80 focus:ring-rose-500 focus:border-rose-500' : 'border-surface-700/80 hover:border-surface-600'}
            ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-rose-400 mt-1">{error}</p>}
      {!error && helperText && <p className="text-xs text-surface-400 mt-1">{helperText}</p>}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
