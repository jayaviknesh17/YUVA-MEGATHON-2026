import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import PageHeader from '../../components/common/PageHeader';
import StatCard from '../../components/common/StatCard';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { FACULTY_SCOPES } from '../../utils/constants';
import {
  FileCheck2,
  CalendarCheck2,
  Users,
  Building2,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Clock,
} from 'lucide-react';

export const FacultyDashboard = () => {
  const { user, activeFacultyScope, switchFacultyScope } = useAuth();
  const navigate = useNavigate();

  const isMentorScope = activeFacultyScope === FACULTY_SCOPES.CLASS_MENTOR;

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Faculty Workspace: ${user?.fullName || 'Dr. Meera Krishnan'}`}
        subtitle="Department of Computer Science • Assigned Dual Scopes: CodeCraft Club Coordinator & Section-A Class Mentor"
        breadcrumbs={['YUVA', 'Faculty', 'Dashboard']}
      />

      {/* Scope Switcher Banner */}
      <div className="p-4 rounded-2xl glass-panel border border-brand-500/30 bg-gradient-to-r from-brand-950/40 via-surface-900 to-surface-900 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-brand-500/20 text-brand-300 border border-brand-500/30">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-brand-400 uppercase tracking-wider">
              Currently Operating As:
            </div>
            <h3 className="text-base font-bold text-surface-50">
              {isMentorScope
                ? 'Class Mentor (Student OD Clearances)'
                : 'Club Faculty Coordinator (Event Proposals Review)'}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-surface-950/80 p-1.5 rounded-xl border border-surface-800">
          <button
            onClick={() => switchFacultyScope(FACULTY_SCOPES.CLUB_COORDINATOR)}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              !isMentorScope
                ? 'bg-brand-600 text-white shadow-glow'
                : 'text-surface-400 hover:text-surface-200'
            }`}
          >
            Club Coordinator
          </button>
          <button
            onClick={() => switchFacultyScope(FACULTY_SCOPES.CLASS_MENTOR)}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              isMentorScope
                ? 'bg-brand-600 text-white shadow-glow'
                : 'text-surface-400 hover:text-surface-200'
            }`}
          >
            Class Mentor (ODs)
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Pending Event Proposals"
          value="1"
          icon={CalendarCheck2}
          variant="amber"
          description="Awaiting coordinator approval"
        />
        <StatCard
          title="Pending OD Applications"
          value="2"
          icon={FileCheck2}
          variant="brand"
          description="From Section-A mentees"
        />
        <StatCard
          title="Assigned Mentees"
          value="64"
          icon={Users}
          variant="emerald"
          description="CSE Semester 6 (Sec-A)"
        />
        <StatCard
          title="Coordinated Clubs"
          value="1"
          icon={Building2}
          variant="purple"
          description="CodeCraft Club"
        />
      </div>

      {/* Action Panels for the two scopes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Scope 1: Event Proposals */}
        <Card className="border-surface-800 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <CalendarCheck2 className="w-4 h-4" />
                Scope 1: Club Coordinator
              </span>
              <span className="text-[10px] bg-amber-500/10 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/20 font-semibold">
                1 Pending
              </span>
            </div>
            <h3 className="text-base font-bold text-surface-100">Review Event Proposals</h3>
            <p className="text-xs text-surface-400 leading-relaxed">
              Evaluate event feasibility, budget, safety, and date conflicts before publishing to the campus calendar. Rejections require mandatory feedback reasons.
            </p>
          </div>
          <div className="mt-5 pt-4 border-t border-surface-800">
            <Button
              variant="primary"
              size="sm"
              className="w-full"
              onClick={() => {
                switchFacultyScope(FACULTY_SCOPES.CLUB_COORDINATOR);
                navigate('/faculty/event-approvals');
              }}
              iconRight={ArrowRight}
            >
              Open Event Proposals Desk
            </Button>
          </div>
        </Card>

        {/* Scope 2: Student OD Requests */}
        <Card className="border-surface-800 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-brand-400 uppercase tracking-wider flex items-center gap-1.5">
                <FileCheck2 className="w-4 h-4" />
                Scope 2: Class Mentor
              </span>
              <span className="text-[10px] bg-brand-500/10 text-brand-300 px-2 py-0.5 rounded-full border border-brand-500/20 font-semibold">
                2 Pending
              </span>
            </div>
            <h3 className="text-base font-bold text-surface-100">Review Mentee OD Requests</h3>
            <p className="text-xs text-surface-400 leading-relaxed">
              Verify On-Duty applications from Section-A students. System intersects active timetable periods and displays exact period exemptions for one-click approval.
            </p>
          </div>
          <div className="mt-5 pt-4 border-t border-surface-800">
            <Button
              variant="primary"
              size="sm"
              className="w-full"
              onClick={() => {
                switchFacultyScope(FACULTY_SCOPES.CLASS_MENTOR);
                navigate('/faculty/od-approvals');
              }}
              iconRight={ArrowRight}
            >
              Open OD Clearance Desk
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default FacultyDashboard;
