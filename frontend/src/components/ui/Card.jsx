import React from 'react';

export const Card = ({ children, className = '', hover = false, onClick, ...props }) => {
  return (
    <div
      onClick={onClick}
      className={`glass-panel rounded-xl border border-surface-800/80 p-5 transition-all duration-200 ${
        hover ? 'hover:border-brand-500/40 hover:shadow-glow hover:-translate-y-0.5 cursor-pointer' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '' }) => {
  return <div className={`flex flex-col space-y-1.5 mb-4 ${className}`}>{children}</div>;
};

export const CardTitle = ({ children, className = '' }) => {
  return <h3 className={`text-lg font-semibold text-surface-50 tracking-tight ${className}`}>{children}</h3>;
};

export const CardDescription = ({ children, className = '' }) => {
  return <p className={`text-xs text-surface-400 ${className}`}>{children}</p>;
};

export const CardContent = ({ children, className = '' }) => {
  return <div className={`space-y-4 ${className}`}>{children}</div>;
};

export const CardFooter = ({ children, className = '' }) => {
  return <div className={`mt-5 pt-4 border-t border-surface-800/80 flex items-center justify-between ${className}`}>{children}</div>;
};

export default Card;
