import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingSpinner = ({ text = 'Loading...', fullScreen = false, size = 'md' }) => {
  const sizes = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const content = (
    <div className="flex flex-col items-center justify-center gap-3 p-6">
      <div className="relative">
        <Loader2 className={`${sizes[size] || sizes.md} animate-spin text-brand-500`} />
        <div className="absolute inset-0 blur-sm bg-brand-500/20 rounded-full animate-pulse" />
      </div>
      {text && <p className="text-xs font-medium text-surface-400 tracking-wide animate-pulse">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-surface-950/80 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return content;
};

export default LoadingSpinner;
