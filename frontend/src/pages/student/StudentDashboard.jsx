import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import PageHeader from '../../components/common/PageHeader';
import StatCard from '../../components/common/StatCard';
import StatusBadge from '../../components/common/StatusBadge';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import {
  CalendarDays,
  FileCheck2,
  Award,
  Sparkles,
  ArrowRight,
  Clock,
  MapPin,
  Building2,
  CheckCircle2,
} from 'lucide-react';
import { formatDate } from '../../utils/formatters';

export const StudentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Mock domain-accurate placeholder data
  const upcomingEvents = [
    {
      id: 1,
      title: 'YUVA MegaThon 2026: 36-Hour Hackathon',
      clubName: 'CodeCraft Club',
      date: '2026-10-15T09:00:00',
      venue: 'Main Tech Auditorium & Lab 4',
      status: 'APPROVED',
      isRegistered: true,
      hasOD: true,
      odStatus: 'APPROVED',
    },
    {
      id: 2,
      title: 'Generative AI & LLM Systems Workshop',
      clubName: 'AI & Robotics Club',
      date: '2026-10-18T14:00:00',
      venue: 'Seminar Hall B',
      status: 'APPROVED',
      isRegistered: true,
      hasOD: false,
    },
    {
      id: 3,
      title: 'Cloud Architecture Hands-on Bootcamp',
      clubName: 'Cloud & DevOps Club',
      date: '2026-10-22T10:00:00',
      venue: 'Virtual / Hall 2',
      status: 'APPROVED',
      isRegistered: false,
      hasOD: false,
    },
  ];

  const recentODs = [
    {
      id: 101,
      eventName: 'YUVA MegaThon 2026',
      mentorName: 'Dr. Meera Krishnan',
      date: '2026-10-15',
      periods: 'Period 1, 2, 3, 4 (Full Day)',
      status: 'APPROVED',
    },
    {
      id: 102,
      eventName: 'State Level Coding Championship',
      mentorName: 'Dr. Meera Krishnan',
      date: '2026-09-20',
      periods: 'Period 3, 4, 5',
      status: 'APPROVED',
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome back, ${user?.fullName?.split(' ')[0] || 'Student'}!`}
        subtitle={`Student Profile: ${user?.raNumber || 'RA2311003010001'} • ${user?.department || 'CSE'} (${user?.section || 'Sec-A'})`}
        breadcrumbs={['YUVA', 'Student', 'Dashboard']}
        actions={
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/student/events')}
            iconLeft={CalendarDays}
          >
            Explore Events
          </Button>
        }
      />

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Registered Events"
          value="4"
          icon={CalendarDays}
          variant="brand"
          description="2 upcoming this month"
        />
        <StatCard
          title="Approved ODs"
          value="3"
          icon={FileCheck2}
          variant="emerald"
          description="100% mentor clearance"
        />
        <StatCard
          title="Certificates"
          value="6"
          icon={Award}
          variant="purple"
          description="Cryptographically verified"
        />
        <StatCard
          title="Skill Badges"
          value="5"
          icon={Sparkles}
          variant="amber"
          description="Level 2 Club Contributor"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: My Upcoming Events */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-surface-100 flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-brand-400" />
              <span>Upcoming Registered & Recommended Events</span>
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/student/events')}
              iconRight={ArrowRight}
            >
              View All
            </Button>
          </div>

          <div className="space-y-3">
            {upcomingEvents.map((evt) => (
              <Card key={evt.id} hover className="border-surface-800">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded border border-brand-500/20">
                        {evt.clubName}
                      </span>
                      <StatusBadge status={evt.status} />
                    </div>
                    <h3 className="text-base font-semibold text-surface-50">{evt.title}</h3>
                    <div className="flex items-center gap-4 text-xs text-surface-400">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {formatDate(evt.date, { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" />
                        {evt.venue}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {evt.isRegistered ? (
                      evt.hasOD ? (
                        <span className="inline-flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          OD Approved
                        </span>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate('/student/od')}
                        >
                          Apply OD
                        </Button>
                      )
                    ) : (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => navigate('/student/events')}
                      >
                        Register
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Recent OD Status & Mentor info */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center justify-between">
                <span>Class Mentor & OD Summary</span>
                <span className="text-[10px] text-brand-400 font-mono">Sec-A</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-3 rounded-xl bg-surface-900 border border-surface-800 space-y-1 mb-4">
                <div className="text-xs font-semibold text-surface-200">Dr. Meera Krishnan</div>
                <div className="text-[11px] text-surface-400">Assigned Class Mentor (OD Approver)</div>
                <div className="text-[10px] text-emerald-400 flex items-center gap-1 mt-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Synced with Timetable Periods
                </div>
              </div>

              <div className="space-y-3">
                <div className="text-xs font-semibold text-surface-300">Recent OD Approvals</div>
                {recentODs.map((od) => (
                  <div key={od.id} className="p-2.5 rounded-lg bg-surface-900/60 border border-surface-800/80 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-surface-200 truncate">{od.eventName}</span>
                      <StatusBadge status={od.status} />
                    </div>
                    <div className="text-[11px] text-surface-400 mt-1 font-mono">{od.periods}</div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-3 border-t border-surface-800">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-xs"
                  onClick={() => navigate('/student/od')}
                  iconRight={ArrowRight}
                >
                  Manage All OD Applications
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
