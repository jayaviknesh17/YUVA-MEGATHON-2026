import React, { useState } from 'react';
import PageHeader from '../../components/common/PageHeader';
import StatusBadge from '../../components/common/StatusBadge';
import EmptyState from '../../components/common/EmptyState';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { Modal } from '../../components/ui/Modal';
import { Select } from '../../components/ui/Select';
import { Input } from '../../components/ui/Input';
import { useNotification } from '../../hooks/useNotification';
import {
  FileCheck2,
  Clock,
  CheckCircle2,
  PlusCircle,
  HelpCircle,
  AlertTriangle,
  UserCheck,
} from 'lucide-react';
import { formatDate } from '../../utils/formatters';

export const StudentODPage = () => {
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [odReason, setOdReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { success, error } = useNotification();

  // Mock registered events eligible for OD
  const registeredEvents = [
    { id: '1', title: 'YUVA MegaThon 2026: 36-Hour Hackathon (Oct 15)' },
    { id: '2', title: 'Generative AI & LLM Systems Workshop (Oct 18)' },
  ];

  // Mock student OD requests with snapshotted periods
  const [odRequests, setOdRequests] = useState([
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
      reason: 'Participating in official YUVA hackathon competitive coding track representing Department.',
      status: 'APPROVED',
      appliedAt: '2026-09-25T14:30:00',
      mentorRemarks: 'Verified participation with club coordinator. Granted full day OD.',
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
  ]);

  const handleApplyOD = (e) => {
    e.preventDefault();
    if (!selectedEventId || !odReason) {
      error('Please select an event and provide a clear justification.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const selectedEvt = registeredEvents.find((e) => e.id === selectedEventId);
      const newOD = {
        id: `OD-2026-00${odRequests.length + 1}`,
        eventName: selectedEvt ? selectedEvt.title : 'Selected Event',
        eventDate: '2026-10-22',
        mentorName: 'Dr. Meera Krishnan',
        snapshottedPeriods: [
          { period: 3, time: '10:30 - 11:20' },
          { period: 4, time: '11:20 - 12:10' },
        ],
        reason: odReason,
        status: 'PENDING_MENTOR_APPROVAL',
        appliedAt: new Date().toISOString(),
        mentorRemarks: null,
      };

      setOdRequests((prev) => [newOD, ...prev]);
      setIsSubmitting(false);
      setIsApplyModalOpen(false);
      setSelectedEventId('');
      setOdReason('');
      success('OD Request submitted to Class Mentor (Dr. Meera Krishnan). Affected timetable periods calculated & snapshotted!', 'OD Submitted');
    }, 500);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="On-Duty (OD) Management"
        subtitle="Apply for attendance clearance on registered events. Periods are automatically computed from the active college timetable and submitted to your Class Mentor."
        breadcrumbs={['YUVA', 'Student', 'On-Duty']}
        actions={
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsApplyModalOpen(true)}
            iconLeft={PlusCircle}
          >
            Apply for OD
          </Button>
        }
      />

      {/* OD Rules Banner */}
      <div className="p-4 rounded-xl glass-panel border border-brand-500/30 bg-brand-950/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-brand-500/20 text-brand-300">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-surface-100">Class Mentor Approval Route</h4>
            <p className="text-[11px] text-surface-400">
              Your assigned mentor <span className="text-brand-300 font-semibold">Dr. Meera Krishnan</span> reviews all period exemptions.
            </p>
          </div>
        </div>
        <div className="text-[11px] font-mono text-emerald-400 bg-surface-900 px-3 py-1.5 rounded-lg border border-surface-800">
          OD Snapshotting: ACTIVE
        </div>
      </div>

      {/* OD Requests Table */}
      {odRequests.length === 0 ? (
        <EmptyState
          icon={FileCheck2}
          title="No OD requests filed"
          description="Register for an approved event to submit an On-Duty clearance application."
          actionLabel="Apply for OD"
          onAction={() => setIsApplyModalOpen(true)}
        />
      ) : (
        <Card className="p-0 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Request ID & Event</TableHead>
                <TableHead>Event Date</TableHead>
                <TableHead>Affected Snapshotted Periods</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Mentor Remarks</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {odRequests.map((req) => (
                <TableRow key={req.id}>
                  <TableCell>
                    <div className="font-semibold text-surface-100">{req.eventName}</div>
                    <div className="text-[10px] text-surface-500 font-mono mt-0.5">{req.id}</div>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs font-medium text-surface-300">{formatDate(req.eventDate)}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {req.snapshottedPeriods.map((p, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-mono bg-surface-900 text-brand-300 border border-brand-500/20 px-2 py-0.5 rounded"
                          title={p.time}
                        >
                          P{p.period} ({p.time})
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={req.status} />
                  </TableCell>
                  <TableCell>
                    <span className="text-xs text-surface-400 max-w-xs truncate block">
                      {req.mentorRemarks || '—'}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Apply OD Modal */}
      <Modal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        title="Apply for On-Duty (OD) Clearance"
        description="Select an eligible event registration to compute affected periods against the college timetable."
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setIsApplyModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              isLoading={isSubmitting}
              onClick={handleApplyOD}
            >
              Submit OD Request
            </Button>
          </>
        }
      >
        <form onSubmit={handleApplyOD} className="space-y-4 text-xs">
          <Select
            label="Eligible Registered Event"
            placeholder="Select a registered event..."
            options={registeredEvents.map((e) => ({ label: e.title, value: e.id }))}
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
            required
          />

          {selectedEventId && (
            <div className="p-3 rounded-xl bg-surface-900 border border-surface-800 space-y-2">
              <div className="flex items-center justify-between font-semibold text-surface-200">
                <span>Calculated Timetable Overlap</span>
                <span className="text-brand-400">2 Academic Periods</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-brand-500/20 text-brand-300 px-2 py-0.5 rounded border border-brand-500/30 font-mono">
                  Period 3 (10:30 - 11:20)
                </span>
                <span className="bg-brand-500/20 text-brand-300 px-2 py-0.5 rounded border border-brand-500/30 font-mono">
                  Period 4 (11:20 - 12:10)
                </span>
              </div>
              <p className="text-[10px] text-surface-500">
                Breaks are excluded. These periods will be snapshotted permanently into your OD record.
              </p>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block font-medium text-surface-300">Participation Justification</label>
            <textarea
              rows={3}
              className="w-full rounded-lg bg-surface-900 border border-surface-700 text-surface-100 text-xs p-3 focus:ring-2 focus:ring-brand-500 focus:outline-none"
              placeholder="Describe your role (participant, speaker, organizer) and reason for class exemption..."
              value={odReason}
              onChange={(e) => setOdReason(e.target.value)}
              required
            />
          </div>

          <div className="p-2.5 rounded-lg bg-surface-900/60 border border-surface-800 text-[11px] text-surface-400 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>Target Approver: Class Mentor (Dr. Meera Krishnan)</span>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default StudentODPage;
