import React from 'react';
import { Card } from '../ui/Card';
import { TrendingUp, TrendingDown } from 'lucide-react';

export const StatCard = ({
  title,
  value,
  icon: Icon,
  trend,
  trendLabel,
  description,
  variant = 'brand',
  className = '',
}) => {
  const iconVariants = {
    brand: 'bg-brand-500/10 text-brand-400 border-brand-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    rose: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  };

  return (
    <Card className={`relative overflow-hidden ${className}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-surface-400 uppercase tracking-wider">{title}</p>
          <h3 className="text-2xl font-bold text-surface-50 mt-1 tracking-tight">{value}</h3>
        </div>
        {Icon && (
          <div className={`p-2.5 rounded-xl border ${iconVariants[variant] || iconVariants.brand}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {(trend !== undefined || description) && (
        <div className="mt-4 flex items-center gap-2 text-xs text-surface-400 border-t border-surface-800/80 pt-3">
          {trend !== undefined && (
            <span
              className={`inline-flex items-center gap-1 font-semibold ${
                trend >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {trend >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
              {trend > 0 ? `+${trend}%` : `${trend}%`}
            </span>
          )}
          <span>{trendLabel || description}</span>
        </div>
      )}
    </Card>
  );
};

export default StatCard;
