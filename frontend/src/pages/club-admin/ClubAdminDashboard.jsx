import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import StatCard from '../../components/common/StatCard';
import StatusBadge from '../../components/common/StatusBadge';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import {
  Users,
  CalendarDays,
  PlusCircle,
  Clock,
  Layers,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  QrCode,
} from 'lucide-react';
import { formatDate } from '../../utils/formatters';

export const ClubAdminDashboard = () => {
  const navigate = useNavigate();

  const events = [
    {
      id: 1,
      title: 'YUVA MegaThon 2026: 36-Hour Hackathon',
      date: '2026-10-15',
      registrations: 184,
      capacity: 250,
      status: 'APPROVED',
    },
    {
      id: 2,
      title: 'Web3 & Decentralized Finance Bootcamp',
      date: '2026-10-28',
      registrations: 0,
      capacity: 100,
      status: 'PENDING_FACULTY_APPROVAL',
    },
    {
      id: 3,
      title: 'Autonomous Drone Systems Workshop',
      date: '2026-11-04',
      registrations: 0,
      capacity: 80,
      status: 'DRAFT',
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Club Admin Workspace"
        subtitle="CodeCraft Club • Lead: Kavya S. • Faculty Coordinator: Dr. Meera Krishnan"
        breadcrumbs={['YUVA', 'Club Admin', 'Dashboard']}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/club-admin/attendance')}
              iconLeft={QrCode}
            >
              Check-In
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/club-admin/events')}
              iconLeft={PlusCircle}
            >
              New Event
            </Button>
          </div>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Club Members"
          value="142"
          icon={Users}
          variant="brand"
          trend={12}
          trendLabel="vs last month"
        />
        <StatCard
          title="Active Events"
          value="3"
          icon={CalendarDays}
          variant="emerald"
          description="1 Live • 1 Pending Approval"
        />
        <StatCard
          title="Total Registrations"
          value="184"
          icon={CheckCircle}
          variant="purple"
          description="Across approved events"
        />
        <StatCard
          title="Dynamic Club Roles"
          value="4"
          icon={Layers}
          variant="amber"
          description="Tech Lead, Media, Event"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Events Lifecycle Manager */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-surface-100 flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-brand-400" />
              <span>Event Lifecycle & Proposals</span>
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/club-admin/events')}
              iconRight={ArrowRight}
            >
              Manage Lifecycle
            </Button>
          </div>

          <div className="space-y-3">
            {events.map((evt) => (
              <Card key={evt.id} hover className="border-surface-800">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-surface-100">{evt.title}</h3>
                      <StatusBadge status={evt.status} />
                    </div>
                    <div className="flex items-center gap-4 text-xs text-surface-400">
                      <span>Schedule: {formatDate(evt.date)}</span>
                      <span>•</span>
                      <span>{evt.registrations}/{evt.capacity} Registered</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate('/club-admin/events')}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Dynamic Roles Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center justify-between">
                <span>Dynamic Club Hierarchy</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/club-admin/roles')}
                >
                  Edit
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2.5 text-xs">
                <div className="p-2.5 rounded-lg bg-surface-900 border border-surface-800 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-surface-200">President / Lead Admin</div>
                    <div className="text-[11px] text-surface-400">Kavya S. (Club Admin)</div>
                  </div>
                  <span className="text-[10px] bg-brand-500/20 text-brand-300 px-2 py-0.5 rounded font-mono">Lead</span>
                </div>

                <div className="p-2.5 rounded-lg bg-surface-900 border border-surface-800 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-surface-200">Technical Lead (Dynamic)</div>
                    <div className="text-[11px] text-surface-400">Diya Menon (RA2311003010002)</div>
                  </div>
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-mono">Dynamic</span>
                </div>

                <div className="p-2.5 rounded-lg bg-surface-900 border border-surface-800 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-surface-200">Event Coordinator</div>
                    <div className="text-[11px] text-surface-400">Siddharth V. (Sec-A)</div>
                  </div>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono">Dynamic</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ClubAdminDashboard;
