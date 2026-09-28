import React from 'react';
import PageHeader from '../../components/common/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useNotification } from '../../hooks/useNotification';
import { Settings, ShieldCheck, Database, Key, CheckCircle2, Lock } from 'lucide-react';

export const SuperAdminSystemConfigPage = () => {
  const { success } = useNotification();

  const configs = [
    {
      title: 'Database Engine & Relational Integrity',
      icon: Database,
      items: [
        { key: 'Database Driver', value: 'SQLite 3 (WAL Mode)', status: 'ACTIVE' },
        { key: 'Foreign Key Enforcement', value: 'PRAGMA foreign_keys = ON', status: 'ENFORCED' },
        { key: 'Synchronous Commit Mode', value: 'NORMAL', status: 'OPTIMAL' },
      ],
    },
    {
      title: 'Security, JWT & Authentication',
      icon: Key,
      items: [
        { key: 'JWT Signature Algorithm', value: 'HS256', status: 'SECURED' },
        { key: 'Token Expiry Window', value: '24 Hours', status: 'CONFIGURED' },
        { key: 'Server-Side RBAC Enforcement', value: 'FastAPI Dependency Guards', status: 'STRICT' },
      ],
    },
    {
      title: 'Domain Rules & Validation Invariants',
      icon: ShieldCheck,
      items: [
        { key: 'Student RA Number Format', value: 'Exactly 15 Alphanumeric (Regex/CHECK)', status: 'VALIDATED' },
        { key: 'Event Registration Cap', value: 'Atomic DB Capacity Constraint', status: 'LOCKED' },
        { key: 'OD Clearance Target', value: 'Assigned Class Mentor (Dual-Scope Faculty)', status: 'BOUND' },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="System Architecture Configurations"
        subtitle="Global platform rules, database pragma settings, and security parameter status."
        breadcrumbs={['YUVA', 'Super Admin', 'Config']}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {configs.map((cfg, idx) => {
          const Icon = cfg.icon;
          return (
            <Card key={idx} className="border-surface-800 space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-surface-800">
                <div className="p-2 rounded-xl bg-brand-500/10 text-brand-400 border border-brand-500/20">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-surface-50">{cfg.title}</h3>
              </div>

              <div className="space-y-3 text-xs">
                {cfg.items.map((item, itemIdx) => (
                  <div key={itemIdx} className="p-2.5 rounded-lg bg-surface-900 border border-surface-800/80 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-surface-400">{item.key}</span>
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">
                        {item.status}
                      </span>
                    </div>
                    <div className="text-surface-200 font-mono text-[11px] font-semibold">{item.value}</div>
                  </div>
                ))}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default SuperAdminSystemConfigPage;
