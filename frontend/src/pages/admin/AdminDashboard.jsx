import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import StatCard from '../../components/common/StatCard';
import StatusBadge from '../../components/common/StatusBadge';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Building2, Users, CalendarDays, FileCheck2, ArrowRight, ShieldCheck, Download } from 'lucide-react';

export const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dean / Admin Governance Hub"
        subtitle="Platform-Wide Analytics, Club Oversight, User Management, and Reporting"
        breadcrumbs={['YUVA', 'Admin', 'Dashboard']}
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/admin/reports')}
            iconLeft={Download}
          >
            Export Reports
          </Button>
        }
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Recognized Clubs"
          value="12"
          icon={Building2}
          variant="brand"
          description="Across 6 departments"
        />
        <StatCard
          title="Active Students"
          value="1,240"
          icon={Users}
          variant="emerald"
          trend={8}
          trendLabel="enrollment increase"
        />
        <StatCard
          title="Total Events Held"
          value="38"
          icon={CalendarDays}
          variant="purple"
          description="Academic Year 2026"
        />
        <StatCard
          title="OD Clearances"
          value="412"
          icon={FileCheck2}
          variant="amber"
          description="94% mentor approved"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-surface-800">
          <CardHeader>
            <CardTitle className="text-sm">Campus Clubs Oversight</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xs text-surface-400">
              Audit registered campus clubs, verify faculty coordinator appointments, and manage club lifecycle states.
            </p>
            <Button
              variant="primary"
              size="sm"
              className="w-full"
              onClick={() => navigate('/admin/clubs')}
              iconRight={ArrowRight}
            >
              Manage Clubs Directory
            </Button>
          </CardContent>
        </Card>

        <Card className="border-surface-800">
          <CardHeader>
            <CardTitle className="text-sm">Institutional Users</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xs text-surface-400">
              View registered students with 15-char RA numbers, faculty rosters, and club admin delegations.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => navigate('/admin/users')}
              iconRight={ArrowRight}
            >
              Browse User Directory
            </Button>
          </CardContent>
        </Card>

        <Card className="border-surface-800">
          <CardHeader>
            <CardTitle className="text-sm">Platform Reports</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xs text-surface-400">
              Generate participation data, attendance summaries, OD records, and event impact metrics.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => navigate('/admin/reports')}
              iconRight={ArrowRight}
            >
              View Analytics Reports
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
