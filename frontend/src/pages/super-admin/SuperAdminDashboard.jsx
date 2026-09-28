import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import StatCard from '../../components/common/StatCard';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import {
  ShieldAlert,
  Clock,
  Settings,
  History,
  CheckCircle2,
  Lock,
  ArrowRight,
  Database,
} from 'lucide-react';

export const SuperAdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Super Admin Master Control"
        subtitle="Full System Configuration, College-Wide Timetable Authority & Security Audit Logs"
        breadcrumbs={['YUVA', 'Super Admin', 'Master Control']}
      />

      {/* Security Privilege Callout */}
      <div className="p-4 rounded-2xl glass-panel border border-rose-500/30 bg-rose-950/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/30">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-rose-400 uppercase tracking-wider">
              Exclusive Privilege Zone
            </div>
            <h3 className="text-base font-bold text-surface-50">
              Timetable Structure & Master Configuration Lock
            </h3>
            <p className="text-xs text-surface-400 mt-0.5">
              Only Super Admin accounts possess authorization to modify college timetable periods and master system parameters.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-emerald-400 bg-surface-900 px-3 py-1.5 rounded-lg border border-surface-800 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            RBAC Enforcement: HARD LOCK
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Timetable"
          value="AY 2026 (Odd)"
          icon={Clock}
          variant="brand"
          description="8 Periods • 2 Breaks Configured"
        />
        <StatCard
          title="Database Status"
          value="SQLite3 WAL"
          icon={Database}
          variant="emerald"
          description="Foreign Keys Enforced"
        />
        <StatCard
          title="Audit Log Entries"
          value="1,480"
          icon={History}
          variant="purple"
          description="Tamper-proof record"
        />
        <StatCard
          title="Security Alerts"
          value="0"
          icon={ShieldAlert}
          variant="amber"
          description="No unauthorized privilege attempts"
        />
      </div>

      {/* Primary Action Modules */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-surface-800">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand-400" />
              <span>College Timetable Manager</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xs text-surface-400">
              Configure academic periods, break durations, start/end times, and active semester schedules. Powers automatic OD period calculations.
            </p>
            <Button
              variant="primary"
              size="sm"
              className="w-full"
              onClick={() => navigate('/super-admin/timetable')}
              iconRight={ArrowRight}
            >
              Open Timetable Editor
            </Button>
          </CardContent>
        </Card>

        <Card className="border-surface-800">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <History className="w-4 h-4 text-purple-400" />
              <span>Security & Audit Trails</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xs text-surface-400">
              Inspect historical records for event state transitions, timetable revisions, mentor OD clearances, and administrative delegations.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => navigate('/super-admin/audit-logs')}
              iconRight={ArrowRight}
            >
              View Audit Logs
            </Button>
          </CardContent>
        </Card>

        <Card className="border-surface-800">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Settings className="w-4 h-4 text-amber-400" />
              <span>System Configurations</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xs text-surface-400">
              Verify SQLite connection hooks, JWT security parameters, RA number 15-char constraints, and platform metadata.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => navigate('/super-admin/config')}
              iconRight={ArrowRight}
            >
              Configure Settings
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
