import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../hooks/useNotification';
import StatusBadge from '../../components/common/StatusBadge';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { Select } from '../../components/ui/Select';
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
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  UserCheck,
  ChevronRight,
  Zap,
  TrendingUp,
  AlertCircle,
  Download,
  Flame,
  Layers,
  HelpCircle,
  PlusCircle,
  Compass,
} from 'lucide-react';
import { formatDate } from '../../utils/formatters';

export const StudentDashboard = () => {
  const { user } = useAuth();
  const { success, info } = useNotification();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('ALL');
  const [copiedRA, setCopiedRA] = useState(false);
  const [selectedEventModal, setSelectedEventModal] = useState(null);
  const [isApplyODModalOpen, setIsApplyODModalOpen] = useState(false);
  const [selectedEventForOD, setSelectedEventForOD] = useState('1');
  const [odReason, setOdReason] = useState('');
  const [isSubmittingOD, setIsSubmittingOD] = useState(false);

  // Student Identity Data
  const studentData = {
    fullName: user?.fullName || 'Aarav Patel',
    raNumber: user?.raNumber || 'RA2311003010001',
    department: user?.department || 'Computer Science & Engineering',
    section: user?.section || 'Sec-A',
    semester: user?.semester || 6,
    mentorName: 'Dr. Meera Krishnan',
    mentorDept: 'CSE Senior Professor & Class Mentor',
    attendanceRate: 96.4,
    odHoursCovered: 14,
    clubCredits: 340,
    dynamicClubRole: 'Technical Lead',
    clubName: 'CodeCraft Club',
  };

  // Mock domain-accurate events
  const [events, setEvents] = useState([
    {
      id: 1,
      title: 'YUVA MegaThon 2026: 36-Hour Hackathon',
      clubName: 'CodeCraft Club',
      category: 'HACKATHON',
      date: '2026-10-15T09:00:00',
      endDate: '2026-10-16T21:00:00',
      venue: 'Main Tech Auditorium & Lab 4',
      capacity: 250,
      registeredCount: 184,
      status: 'APPROVED',
      isRegistered: true,
      hasOD: true,
      odStatus: 'APPROVED',
      odPeriods: 'Periods 1-4 (Full Morning Session)',
      urgency: 'In 16 Days',
      bannerGradient: 'from-brand-600/20 via-surface-900 to-surface-900',
    },
    {
      id: 2,
      title: 'Generative AI & LLM Systems Workshop',
      clubName: 'AI & Robotics Club',
      category: 'WORKSHOP',
      date: '2026-10-18T14:00:00',
      endDate: '2026-10-18T17:00:00',
      venue: 'Seminar Hall B',
      capacity: 100,
      registeredCount: 88,
      status: 'APPROVED',
      isRegistered: true,
      hasOD: false,
      odStatus: 'NOT_APPLIED',
      urgency: 'In 19 Days',
      bannerGradient: 'from-cyber-cyan/20 via-surface-900 to-surface-900',
    },
    {
      id: 3,
      title: 'Cloud Architecture Hands-on Bootcamp',
      clubName: 'Cloud & DevOps Club',
      category: 'TECHNICAL',
      date: '2026-10-22T10:00:00',
      endDate: '2026-10-22T16:00:00',
      venue: 'Virtual Room / Tech Lab 2',
      capacity: 150,
      registeredCount: 62,
      status: 'APPROVED',
      isRegistered: false,
      hasOD: false,
      odStatus: null,
      urgency: 'In 23 Days',
      bannerGradient: 'from-cyber-emerald/20 via-surface-900 to-surface-900',
    },
    {
      id: 4,
      title: 'State Level Coding Championship 2026',
      clubName: 'CodeCraft Club',
      category: 'CONTEST',
      date: '2026-09-20T10:00:00',
      endDate: '2026-09-20T18:00:00',
      venue: 'Computer Center Block 1',
      capacity: 120,
      registeredCount: 120,
      status: 'COMPLETED',
      isRegistered: true,
      hasOD: true,
      odStatus: 'APPROVED',
      odPeriods: 'Periods 3, 4, 5',
      urgency: 'Completed',
      bannerGradient: 'from-surface-800/40 via-surface-900 to-surface-900',
    },
  ]);

  // Today's Academic Timetable Period schedule & live OD overlay
  const todayTimetable = [
    { period: 1, name: 'Advanced Algorithms', time: '08:30 - 09:20', isBreak: false, isExempt: true, odLabel: 'Hackathon Prep' },
    { period: 2, name: 'Distributed Systems', time: '09:20 - 10:10', isBreak: false, isExempt: true, odLabel: 'Hackathon Prep' },
    { period: 0, name: 'Tea & Refreshment', time: '10:10 - 10:30', isBreak: true, isExempt: false, odLabel: 'Break' },
    { period: 3, name: 'Compiler Engineering', time: '10:30 - 11:20', isBreak: false, isExempt: false, odLabel: 'In Session' },
    { period: 4, name: 'Database Internals', time: '11:20 - 12:10', isBreak: false, isExempt: false, odLabel: 'In Session' },
    { period: 0, name: 'Lunch Break', time: '12:10 - 13:00', isBreak: true, isExempt: false, odLabel: 'Break' },
    { period: 5, name: 'Cloud Computing Lab', time: '13:00 - 13:50', isBreak: false, isExempt: false, odLabel: 'Upcoming' },
    { period: 6, name: 'Software Architecture', time: '13:50 - 14:40', isBreak: false, isExempt: false, odLabel: 'Upcoming' },
  ];

  // OD clearance requests with snapshotted periods
  const odRequests = [
    {
      id: 'OD-2026-001',
      eventName: 'YUVA MegaThon 2026: 36-Hour Hackathon',
      eventDate: '2026-10-15',
      mentorName: 'Dr. Meera Krishnan',
      snapshottedPeriods: [
        { period: 1, time: '08:30 - 09:20' },
        { period: 2, time: '09:20 - 10:10' },
        { period: 3, time: '10:30 - 11:20' },
        { period: 4, time: '11:20 - 12:10' },
      ],
      reason: 'Official YUVA hackathon competitive coding track representing CSE Department.',
      status: 'APPROVED',
      appliedAt: '2026-09-25T14:30:00',
      mentorRemarks: 'Verified participation with club coordinator. Granted full morning OD clearance.',
    },
    {
      id: 'OD-2026-002',
      eventName: 'Generative AI & LLM Systems Workshop',
      eventDate: '2026-10-18',
      mentorName: 'Dr. Meera Krishnan',
      snapshottedPeriods: [
        { period: 6, time: '14:00 - 14:50' },
        { period: 7, time: '14:50 - 15:40' },
      ],
      reason: 'Attending specialized hands-on technical workshop in seminar hall.',
      status: 'PENDING_MENTOR_APPROVAL',
      appliedAt: '2026-09-28T09:15:00',
      mentorRemarks: null,
    },
  ];

  // Verified Certificates & Badges
  const latestCertificate = {
    id: 'CERT-2026-YUV-8821',
    eventName: 'State Level Coding Championship 2026',
    clubName: 'CodeCraft Club',
    issueDate: '2026-09-22',
    verificationCode: 'YUV-2026-CC-8821-A9F2',
    status: 'ISSUED',
  };

  const badges = [
    { id: 1, name: 'Hackathon Warrior', icon: '🏆', level: 'Silver Tier', desc: 'Participated in 3+ major events' },
    { id: 2, name: 'AI Explorer', icon: '🤖', level: 'Gold Tier', desc: 'Completed LLM & Neural workshops' },
    { id: 3, name: 'Punctual Attendant', icon: '⚡', level: 'Bronze Tier', desc: '100% verified attendance' },
    { id: 4, name: 'Cloud Builder', icon: '☁️', level: 'Silver Tier', desc: 'Docker & Kubernetes Certified' },
  ];

  const handleCopyRA = () => {
    navigator.clipboard.writeText(studentData.raNumber);
    setCopiedRA(true);
    success(`Copied RA Number ${studentData.raNumber} to clipboard.`, 'Copied');
    setTimeout(() => setCopiedRA(false), 2500);
  };

  const handleApplyODSubmit = (e) => {
    e.preventDefault();
    if (!odReason.trim()) return;
    setIsSubmittingOD(true);
    setTimeout(() => {
      setIsSubmittingOD(false);
      setIsApplyODModalOpen(false);
      setOdReason('');
      success('OD Application successfully submitted to Class Mentor (Dr. Meera Krishnan).', 'OD Request Dispatched');
    }, 600);
  };

  const filteredEvents = events.filter((evt) => {
    if (activeTab === 'ALL') return true;
    if (activeTab === 'REGISTERED') return evt.isRegistered && evt.status !== 'COMPLETED';
    if (activeTab === 'UPCOMING') return evt.status === 'APPROVED';
    if (activeTab === 'COMPLETED') return evt.status === 'COMPLETED';
    return true;
  });

  return (
    <div className="space-y-6 pb-8">
      {/* 1. TOP HERO: STUDENT IDENTITY & CAMPUS STATUS BANNER */}
      <div className="relative rounded-2xl overflow-hidden glass-panel border border-surface-800 shadow-card">
        {/* Subtle Ambient Top Glow */}
        <div className="absolute top-0 right-0 w-96 h-48 bg-gradient-to-bl from-brand-500/10 via-cyber-cyan/5 to-transparent blur-2xl pointer-events-none" />

        <div className="p-5 sm:p-6 lg:p-7 relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Left: Avatar & Identity Metadata */}
          <div className="flex items-start sm:items-center gap-4">
            <div className="relative flex-shrink-0">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-brand-600 via-brand-500 to-cyber-cyan p-0.5 shadow-glow">
                <div className="w-full h-full rounded-[14px] bg-surface-950 flex items-center justify-center text-white text-xl sm:text-2xl font-black">
                  {studentData.fullName.charAt(0)}
                </div>
              </div>
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-cyber-emerald border-2 border-surface-950 shadow-glow-emerald" title="Verified Active Student" />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-extrabold text-surface-50 tracking-tight">
                  {studentData.fullName}
                </h1>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-cyber-emerald bg-cyber-emerald/10 border border-cyber-emerald/30 px-2 py-0.5 rounded-full">
                  <Sparkles className="w-3 h-3" />
                  Active Scholar
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full">
                  <Flame className="w-3 h-3" />
                  {studentData.dynamicClubRole}
                </span>
              </div>

              {/* RA Number with 1-Click Copy */}
              <div className="flex items-center gap-3 text-xs text-surface-300 flex-wrap">
                <button
                  onClick={handleCopyRA}
                  className="group inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-900 hover:bg-surface-850 border border-surface-750 text-brand-300 font-mono text-xs transition-all hover:border-brand-500/40"
                  title="Click to copy official 15-char RA Number"
                >
                  <span className="text-surface-400 text-[11px]">RA:</span>
                  <span className="font-bold tracking-wider">{studentData.raNumber}</span>
                  {copiedRA ? (
                    <Check className="w-3.5 h-3.5 text-cyber-emerald animate-scale" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-surface-400 group-hover:text-brand-300 transition-colors" />
                  )}
                </button>

                <span className="text-surface-600 hidden sm:inline">•</span>
                <span className="text-surface-300 font-medium">
                  {studentData.department} (<span className="text-surface-100">{studentData.section}</span>, Sem {studentData.semester})
                </span>

                <span className="text-surface-600 hidden sm:inline">•</span>
                <span className="text-surface-400 flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5 text-brand-400" />
                  Mentor: <strong className="text-surface-200">{studentData.mentorName}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Right: Quick Action CTAs */}
          <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsApplyODModalOpen(true)}
              iconLeft={FileCheck2}
              className="bg-surface-900/80 border-surface-750 text-surface-200 hover:text-white hover:border-brand-500/40"
            >
              Apply for OD
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/student/events')}
              iconLeft={Compass}
              className="shadow-glow"
            >
              Explore Events
            </Button>
          </div>
        </div>

        {/* Bottom Fast-Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 border-t border-surface-800/80 bg-surface-900/40 text-xs">
          <div className="p-3.5 sm:px-6 flex items-center justify-between border-r border-surface-800/60">
            <span className="text-surface-400">Class Attendance</span>
            <span className="font-bold text-cyber-emerald font-mono">{studentData.attendanceRate}%</span>
          </div>
          <div className="p-3.5 sm:px-6 flex items-center justify-between border-r border-surface-800/60">
            <span className="text-surface-400">OD Periods Exempt</span>
            <span className="font-bold text-brand-300 font-mono">{studentData.odHoursCovered} Slots</span>
          </div>
          <div className="p-3.5 sm:px-6 flex items-center justify-between border-r border-surface-800/60">
            <span className="text-surface-400">Club Activity Pts</span>
            <span className="font-bold text-amber-400 font-mono">{studentData.clubCredits} pts</span>
          </div>
          <div className="p-3.5 sm:px-6 flex items-center justify-between">
            <span className="text-surface-400">Academic Standing</span>
            <span className="font-bold text-surface-200 flex items-center gap-1 font-mono">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyber-emerald" /> Good
            </span>
          </div>
        </div>
      </div>

      {/* 2. KPI METRIC CARDS (4 HIGH-IMPACT CARDS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Registered Events */}
        <Card className="border-surface-800 bg-surface-900/60 relative overflow-hidden group hover:border-brand-500/40 transition-all">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-surface-400">My Registrations</p>
              <h3 className="text-2xl font-black text-surface-50 mt-1 font-mono">4 Events</h3>
            </div>
            <div className="p-2.5 rounded-xl bg-brand-500/10 text-brand-400 border border-brand-500/20 group-hover:scale-105 transition-transform">
              <CalendarDays className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-surface-800/80 flex items-center justify-between text-xs">
            <span className="text-cyber-emerald font-semibold flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> 2 Upcoming
            </span>
            <span className="text-surface-400 text-[11px]">Next: Oct 15</span>
          </div>
        </Card>

        {/* Card 2: OD Clearances */}
        <Card className="border-surface-800 bg-surface-900/60 relative overflow-hidden group hover:border-cyber-emerald/40 transition-all">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-surface-400">OD Clearances</p>
              <h3 className="text-2xl font-black text-surface-50 mt-1 font-mono">3 Approved</h3>
            </div>
            <div className="p-2.5 rounded-xl bg-cyber-emerald/10 text-cyber-emerald border border-cyber-emerald/20 group-hover:scale-105 transition-transform">
              <FileCheck2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-surface-800/80 flex items-center justify-between text-xs">
            <span className="text-amber-400 font-semibold flex items-center gap-1">
              1 In Review
            </span>
            <span className="text-surface-400 text-[11px]">Class Mentor Synced</span>
          </div>
        </Card>

        {/* Card 3: Certificates */}
        <Card className="border-surface-800 bg-surface-900/60 relative overflow-hidden group hover:border-cyber-cyan/40 transition-all">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-surface-400">Credentials</p>
              <h3 className="text-2xl font-black text-surface-50 mt-1 font-mono">6 Certificates</h3>
            </div>
            <div className="p-2.5 rounded-xl bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/20 group-hover:scale-105 transition-transform">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-surface-800/80 flex items-center justify-between text-xs">
            <span className="text-cyber-cyan font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Hash-Verified
            </span>
            <span className="text-surface-400 text-[11px]">Tamper Proof</span>
          </div>
        </Card>

        {/* Card 4: Skill Badges & Level */}
        <Card className="border-surface-800 bg-surface-900/60 relative overflow-hidden group hover:border-amber-500/40 transition-all">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-surface-400">Campus Rank</p>
              <h3 className="text-2xl font-black text-surface-50 mt-1 font-mono">Tier: Gold</h3>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-surface-800/80 flex items-center justify-between text-xs">
            <span className="text-amber-300 font-semibold">5 Badges Unlocked</span>
            <span className="text-surface-400 text-[11px]">Top 5% Cohort</span>
          </div>
        </Card>
      </div>

      {/* 3. MAIN WORKSPACE: TWO-COLUMN MASTER GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN (2/3 WIDTH): EVENTS & OD SNAPSHOT MATRIX */}
        <div className="lg:col-span-2 space-y-6">
          {/* A. EVENT HUB & REGISTRATIONS */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-surface-100 flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 text-brand-400" />
                  <span>Campus Events & Registrations</span>
                </h2>
                <p className="text-xs text-surface-400 mt-0.5">
                  Track confirmed seats, attendance status, and direct On-Duty clearance eligibility.
                </p>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-surface-900 border border-surface-800 text-xs self-start sm:self-auto">
                {[
                  { id: 'ALL', label: 'All' },
                  { id: 'REGISTERED', label: 'Registered (2)' },
                  { id: 'UPCOMING', label: 'Explore (3)' },
                  { id: 'COMPLETED', label: 'Past (1)' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-3 py-1 rounded-lg font-medium transition-all ${
                      activeTab === tab.id
                        ? 'bg-brand-600 text-white shadow-sm'
                        : 'text-surface-400 hover:text-surface-200'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Event Cards List */}
            <div className="space-y-3">
              {filteredEvents.map((evt) => {
                const fillPercent = Math.round((evt.registeredCount / evt.capacity) * 100);

                return (
                  <Card
                    key={evt.id}
                    className="border-surface-800 hover:border-brand-500/40 transition-all p-5 bg-surface-900/40 relative overflow-hidden"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      {/* Event Core Details */}
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[11px] font-bold text-brand-300 bg-brand-950/80 px-2.5 py-0.5 rounded-full border border-brand-500/30">
                            {evt.clubName}
                          </span>
                          <StatusBadge status={evt.status} />
                          <span className="text-[11px] font-mono text-surface-400 bg-surface-800/60 px-2 py-0.5 rounded border border-surface-750">
                            {evt.urgency}
                          </span>
                        </div>

                        <h3 className="text-base font-bold text-surface-50 hover:text-brand-300 transition-colors cursor-pointer" onClick={() => setSelectedEventModal(evt)}>
                          {evt.title}
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-surface-300">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-brand-400" />
                            <span>{formatDate(evt.date, { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-brand-400" />
                            <span className="truncate">{evt.venue}</span>
                          </div>
                        </div>

                        {/* Capacity Meter Bar */}
                        <div className="pt-1.5 flex items-center gap-3 text-[11px] text-surface-400 max-w-md">
                          <div className="flex-1 h-1.5 rounded-full bg-surface-800 overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-brand-500 to-cyber-cyan rounded-full transition-all"
                              style={{ width: `${fillPercent}%` }}
                            />
                          </div>
                          <span className="font-mono whitespace-nowrap">
                            {evt.registeredCount}/{evt.capacity} seats ({fillPercent}%)
                          </span>
                        </div>
                      </div>

                      {/* Right Action / OD Status Hub */}
                      <div className="flex flex-col sm:items-end justify-between gap-2.5 border-t md:border-t-0 md:border-l border-surface-800/80 pt-3 md:pt-0 md:pl-4 min-w-[170px]">
                        {evt.isRegistered ? (
                          <>
                            <div className="text-left sm:text-right">
                              <span className="text-[10px] text-surface-400 uppercase font-semibold block">OD Status:</span>
                              {evt.hasOD ? (
                                <span className="inline-flex items-center gap-1 text-xs text-cyber-emerald font-semibold bg-cyber-emerald/10 px-2 py-0.5 rounded border border-cyber-emerald/30 mt-0.5">
                                  <CheckCircle2 className="w-3 h-3" />
                                  OD Approved
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-xs text-amber-400 font-semibold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30 mt-0.5">
                                  <AlertCircle className="w-3 h-3" />
                                  OD Not Applied
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-2">
                              {!evt.hasOD ? (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedEventForOD(String(evt.id));
                                    setIsApplyODModalOpen(true);
                                  }}
                                  className="text-xs"
                                >
                                  Apply OD
                                </Button>
                              ) : (
                                <span className="text-[11px] text-surface-400 font-mono">
                                  {evt.odPeriods}
                                </span>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedEventModal(evt)}
                                iconRight={ChevronRight}
                              />
                            </div>
                          </>
                        ) : (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => navigate('/student/events')}
                            className="w-full sm:w-auto"
                          >
                            Register Seat
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* B. ON-DUTY (OD) & TIMETABLE SNAPSHOT MATRIX */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-surface-100 flex items-center gap-2">
                  <FileCheck2 className="w-4 h-4 text-cyber-emerald" />
                  <span>On-Duty (OD) Clearance Records</span>
                </h2>
                <p className="text-xs text-surface-400 mt-0.5">
                  Periods snapshotted from the active college timetable and verified by your Class Mentor.
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/student/od')}
                iconRight={ArrowRight}
              >
                View Full Log
              </Button>
            </div>

            <div className="space-y-3">
              {odRequests.map((od) => (
                <Card key={od.id} className="border-surface-800 p-5 bg-surface-900/40 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-brand-300 bg-brand-950/60 px-2 py-0.5 rounded border border-brand-500/30">
                          {od.id}
                        </span>
                        <h4 className="text-sm font-bold text-surface-100">{od.eventName}</h4>
                      </div>
                      <p className="text-xs text-surface-400 mt-1">
                        Event Date: <span className="text-surface-200 font-medium">{formatDate(od.eventDate)}</span> • Reviewer: <span className="text-brand-300 font-semibold">{od.mentorName} (Class Mentor)</span>
                      </p>
                    </div>

                    <StatusBadge status={od.status} />
                  </div>

                  {/* Snapshotted Timetable Period Badges */}
                  <div className="p-3 rounded-xl bg-surface-950/80 border border-surface-800 space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-surface-400 font-semibold uppercase tracking-wider">
                        Snapshotted Academic Periods Exempted:
                      </span>
                      <span className="text-cyber-emerald font-mono text-[10px] bg-cyber-emerald/10 px-2 py-0.5 rounded border border-cyber-emerald/20">
                        TIMETABLE SYNCED
                      </span>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      {od.snapshottedPeriods.map((p, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-900 border border-surface-750 text-xs font-mono text-surface-200"
                        >
                          <span className="text-brand-400 font-bold">P{p.period}</span>
                          <span className="text-surface-400 text-[11px]">({p.time})</span>
                        </div>
                      ))}
                    </div>

                    <p className="text-[10px] text-surface-500">
                      * Refreshment & lunch breaks are excluded automatically. These period records remain immutable for academic audit.
                    </p>
                  </div>

                  {od.mentorRemarks && (
                    <div className="text-xs text-surface-300 flex items-start gap-2 bg-surface-900/60 p-2.5 rounded-lg border border-surface-800">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyber-emerald flex-shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-surface-200 font-semibold">Mentor Feedback: </strong>
                        <span>{od.mentorRemarks}</span>
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (1/3 WIDTH): MENTOR TOUCHPOINT, LIVE SCHEDULE & CREDENTIALS */}
        <div className="space-y-6">
          {/* A. TODAY'S TIMETABLE SCHEDULE & OD OVERLAY */}
          <Card className="border-surface-800 bg-surface-900/60 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-surface-100 flex items-center gap-2">
                <Clock className="w-4 h-4 text-brand-400" />
                <span>Today's Timetable Status</span>
              </h3>
              <span className="text-[10px] font-mono text-cyber-emerald bg-cyber-emerald/10 px-2 py-0.5 rounded border border-cyber-emerald/20">
                Thursday
              </span>
            </div>

            <p className="text-xs text-surface-400 leading-relaxed">
              Real-time sync between active timetable periods and your approved On-Duty exemptions.
            </p>

            <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
              {todayTimetable.map((slot, idx) => (
                <div
                  key={idx}
                  className={`p-2.5 rounded-xl border text-xs flex items-center justify-between transition-all ${
                    slot.isBreak
                      ? 'bg-surface-950/40 border-surface-800/60 text-surface-500'
                      : slot.isExempt
                      ? 'bg-brand-950/40 border-brand-500/40 text-brand-200'
                      : 'bg-surface-900 border-surface-800 text-surface-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {slot.isBreak ? (
                      <span className="text-[10px] font-mono text-amber-400/80 bg-amber-500/10 px-1.5 py-0.5 rounded">Break</span>
                    ) : (
                      <span className="text-[10px] font-mono font-bold text-brand-400 bg-brand-500/10 px-1.5 py-0.5 rounded">
                        P{slot.period}
                      </span>
                    )}
                    <div>
                      <div className="font-semibold text-surface-200 text-xs">{slot.name}</div>
                      <div className="text-[10px] text-surface-500 font-mono">{slot.time}</div>
                    </div>
                  </div>

                  {slot.isExempt ? (
                    <span className="text-[10px] font-semibold text-cyber-emerald bg-cyber-emerald/10 border border-cyber-emerald/30 px-2 py-0.5 rounded-full">
                      OD Exempted
                    </span>
                  ) : (
                    <span className="text-[10px] text-surface-400">{slot.odLabel}</span>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* B. CLASS MENTOR TOUCHPOINT */}
          <Card className="border-surface-800 bg-surface-900/60 p-5 space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-brand-400">Class Mentor Desk</span>
              <span className="text-[10px] font-mono text-surface-400 bg-surface-800 px-2 py-0.5 rounded">Sec-A</span>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-950 border border-surface-800">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-violet-500 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                MK
              </div>
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-surface-100">{studentData.mentorName}</div>
                <div className="text-[11px] text-surface-400">{studentData.mentorDept}</div>
              </div>
            </div>

            <p className="text-[11px] text-surface-400 leading-relaxed">
              Class Mentors possess exclusive authority to clear On-Duty periods. Club Faculty Coordinators review event proposals.
            </p>

            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs"
              onClick={() => setIsApplyODModalOpen(true)}
              iconLeft={PlusCircle}
            >
              Submit New OD Request
            </Button>
          </Card>

          {/* C. LATEST CREDENTIAL & VERIFIED CERTIFICATE */}
          <Card className="border-surface-800 bg-surface-900/60 p-5 space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-cyber-cyan">Latest Credential</span>
              <span className="text-[10px] font-mono text-cyber-emerald bg-cyber-emerald/10 px-2 py-0.5 rounded border border-cyber-emerald/30">
                VERIFIED
              </span>
            </div>

            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-surface-100">{latestCertificate.eventName}</h4>
              <p className="text-[11px] text-surface-400">Issued by {latestCertificate.clubName} • {formatDate(latestCertificate.issueDate)}</p>
            </div>

            <div className="p-2.5 rounded-xl bg-surface-950 border border-surface-800 text-[11px] font-mono space-y-1">
              <div className="text-surface-500 text-[10px]">Verification Code:</div>
              <div className="text-cyber-cyan font-bold truncate">{latestCertificate.verificationCode}</div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <Button
                variant="primary"
                size="sm"
                className="w-full text-xs"
                onClick={() => success('Certificate downloaded as tamper-proof PDF.', 'Download Started')}
                iconLeft={Download}
              >
                Download PDF
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/student/certificates')}
                iconRight={ArrowRight}
              />
            </div>
          </Card>

          {/* D. SKILL BADGES SHOWCASE */}
          <Card className="border-surface-800 bg-surface-900/60 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">Skill Badges & Milestones</span>
              <span className="text-[10px] font-mono text-surface-400">4 / 8 Unlocked</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {badges.map((b) => (
                <div
                  key={b.id}
                  className="p-2.5 rounded-xl bg-surface-950 border border-surface-800 text-center space-y-1 hover:border-amber-500/40 transition-colors"
                >
                  <div className="text-xl">{b.icon}</div>
                  <div className="text-xs font-bold text-surface-200 truncate">{b.name}</div>
                  <div className="text-[10px] text-amber-400 font-mono">{b.level}</div>
                </div>
              ))}
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="w-full text-xs text-surface-400 hover:text-surface-100"
              onClick={() => navigate('/student/certificates')}
            >
              View Full Badge Trophy Room →
            </Button>
          </Card>
        </div>
      </div>

      {/* 4. EVENT DETAILS MODAL */}
      {selectedEventModal && (
        <Modal
          isOpen={!!selectedEventModal}
          onClose={() => setSelectedEventModal(null)}
          title={selectedEventModal.title}
          description={`Organized by ${selectedEventModal.clubName} • ${selectedEventModal.category}`}
          footer={
            <>
              <Button variant="ghost" size="sm" onClick={() => setSelectedEventModal(null)}>
                Close
              </Button>
              {selectedEventModal.isRegistered ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedEventModal(null);
                    setSelectedEventForOD(String(selectedEventModal.id));
                    setIsApplyODModalOpen(true);
                  }}
                  iconLeft={FileCheck2}
                >
                  Apply for OD Clearance
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setSelectedEventModal(null);
                    navigate('/student/events');
                  }}
                >
                  Proceed to Registration
                </Button>
              )}
            </>
          }
        >
          <div className="space-y-4 text-xs">
            <div className="p-3.5 rounded-xl bg-surface-950 border border-surface-800 space-y-2">
              <div className="flex justify-between">
                <span className="text-surface-400">Date & Time:</span>
                <span className="font-semibold text-surface-200">{formatDate(selectedEventModal.date, { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-surface-400">Venue:</span>
                <span className="font-semibold text-surface-200">{selectedEventModal.venue}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-surface-400">Attendee Cap:</span>
                <span className="font-semibold text-surface-200">{selectedEventModal.registeredCount} / {selectedEventModal.capacity} spots</span>
              </div>
            </div>

            <p className="text-surface-300 leading-relaxed">
              Official campus event approved by Faculty Coordinator and synced with college timetable periods. Registered students are eligible for Class Mentor OD clearance.
            </p>
          </div>
        </Modal>
      )}

      {/* 5. INTERACTIVE APPLY OD MODAL */}
      <Modal
        isOpen={isApplyODModalOpen}
        onClose={() => setIsApplyODModalOpen(false)}
        title="Apply for On-Duty (OD) Clearance"
        description="Select your confirmed registered event. Overlapping timetable periods are calculated automatically."
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setIsApplyODModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              isLoading={isSubmittingOD}
              onClick={handleApplyODSubmit}
            >
              Submit to Class Mentor
            </Button>
          </>
        }
      >
        <form onSubmit={handleApplyODSubmit} className="space-y-4 text-xs">
          <Select
            label="Eligible Registered Event"
            placeholder="Select a registered event..."
            options={[
              { label: 'YUVA MegaThon 2026 (Oct 15) • Periods 1-4', value: '1' },
              { label: 'Generative AI Workshop (Oct 18) • Periods 6-7', value: '2' },
            ]}
            value={selectedEventForOD}
            onChange={(e) => setSelectedEventForOD(e.target.value)}
            required
          />

          <div className="p-3.5 rounded-xl bg-surface-950 border border-surface-800 space-y-2">
            <div className="flex items-center justify-between font-semibold text-surface-200">
              <span>Computed Timetable Overlap</span>
              <span className="text-brand-400 font-mono">4 Academic Periods</span>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="bg-brand-500/20 text-brand-300 px-2 py-0.5 rounded border border-brand-500/30 font-mono">
                P1 (08:30 - 09:20)
              </span>
              <span className="bg-brand-500/20 text-brand-300 px-2 py-0.5 rounded border border-brand-500/30 font-mono">
                P2 (09:20 - 10:10)
              </span>
              <span className="bg-brand-500/20 text-brand-300 px-2 py-0.5 rounded border border-brand-500/30 font-mono">
                P3 (10:30 - 11:20)
              </span>
              <span className="bg-brand-500/20 text-brand-300 px-2 py-0.5 rounded border border-brand-500/30 font-mono">
                P4 (11:20 - 12:10)
              </span>
            </div>
            <p className="text-[10px] text-surface-500">
              * Morning refreshment break (10:10-10:30) is bypassed. These periods will be snapshotted permanently.
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="block font-medium text-surface-300">Participation Justification</label>
            <textarea
              rows={3}
              className="w-full rounded-lg bg-surface-900 border border-surface-750 text-surface-100 text-xs p-3 focus:ring-2 focus:ring-brand-500 focus:outline-none placeholder-surface-500"
              placeholder="State your role (attendee, competitor, organizer) and academic justification..."
              value={odReason}
              onChange={(e) => setOdReason(e.target.value)}
              required
            />
          </div>

          <div className="p-2.5 rounded-lg bg-surface-950/80 border border-surface-800 text-[11px] text-surface-400 flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-cyber-emerald flex-shrink-0" />
            <span>Assigned Reviewer: <strong className="text-surface-200">Dr. Meera Krishnan (Class Mentor)</strong></span>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default StudentDashboard;
