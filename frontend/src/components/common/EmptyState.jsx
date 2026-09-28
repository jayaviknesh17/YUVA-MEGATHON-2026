import React from 'react';
import { Inbox } from 'lucide-react';
import { Button } from '../ui/Button';

export const EmptyState = ({
  icon: Icon = Inbox,
  title = 'No records found',
  description = 'There are currently no items to display.',
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl glass-card border border-surface-800/60 ${className}`}>
      <div className="w-14 h-14 rounded-2xl bg-surface-900 border border-surface-700/60 flex items-center justify-center mb-4 text-surface-400 shadow-inner">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-base font-semibold text-surface-200 mb-1">{title}</h3>
      <p className="text-xs text-surface-400 max-w-sm mb-6 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
