import React from 'react';
import { getStatusColorClass, getStatusLabel } from '../../utils/formatters';

export const StatusBadge = ({ status, className = '' }) => {
  const colorClass = getStatusColorClass(status);
  const label = getStatusLabel(status);

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full border shadow-sm ${colorClass} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      <span>{label}</span>
    </span>
  );
};

export default StatusBadge;
