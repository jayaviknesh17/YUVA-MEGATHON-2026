import React, { useState } from 'react';
import PageHeader from '../../components/common/PageHeader';
import StatusBadge from '../../components/common/StatusBadge';
import EmptyState from '../../components/common/EmptyState';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { useNotification } from '../../hooks/useNotification';
import {
  CalendarCheck,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  Users,
  AlertTriangle,
} from 'lucide-react';
import { formatDate } from '../../utils/formatters';

export const FacultyEventApprovalsPage = () => {
  const [rejectingEvent, setRejectingEvent] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const { success, warning, error } = useNotification();

  const [proposals, setProposals] = useState([
    {
      id: 2,
      title: 'Web3 & Decentralized Finance Bootcamp',
      clubName: 'CodeCraft Club',
      submittedBy: 'Kavya S. (Club Admin)',
      venue: 'Seminar Hall 3',
      date: '2026-10-28T10:00:00',
      capacity: 100,
      description: 'Hands-on Ethereum smart contract deployment and Solidity security analysis.',
      status: 'PENDING_FACULTY_APPROVAL',
      submittedAt: '2026-09-28T11:20:00',
    },
    {
      id: 1,
      title: 'YUVA MegaThon 2026: 36-Hour Hackathon',
      clubName: 'CodeCraft Club',
      submittedBy: 'Kavya S. (Club Admin)',
      venue: 'Main Auditorium & Computer Lab 4',
      date: '2026-10-15T09:00:00',
      capacity: 250,
      description: 'The premier 36-hour hackathon across AI, Web3, IoT, and Cloud tracks.',
      status: 'APPROVED',
      submittedAt: '2026-09-20T10:00:00',
    },
  ]);

  const handleApprove = (id) => {
    setProposals((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'APPROVED' } : p))
    );
    success('Event proposal approved! The event is now published for student registrations.', 'Proposal Approved');
  };

  const handleConfirmReject = () => {
    if (!rejectionReason.trim()) {
      error('A clear rejection reason is mandatory to guide the club admin for resubmission.');
      return;
    }

    setProposals((prev) =>
      prev.map((p) =>
        p.id === rejectingEvent.id
          ? { ...p, status: 'REJECTED', rejectionReason: rejectionReason }
          : p
      )
    );
    warning('Event proposal rejected and returned to Club Admin with feedback notes.', 'Proposal Rejected');
    setRejectingEvent(null);
    setRejectionReason('');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Event Proposals & Approvals"
        subtitle="Scope 1: Club Faculty Coordinator Desk • Review and authorize events submitted by CodeCraft Club"
        breadcrumbs={['YUVA', 'Faculty', 'Event Proposals']}
      />

      <div className="space-y-4">
        {proposals.map((item) => (
          <Card key={item.id} className="border-surface-800 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2.5">
                  <h3 className="text-base font-bold text-surface-50">{item.title}</h3>
                  <StatusBadge status={item.status} />
                </div>
                <div className="text-xs text-surface-400">
                  Submitted by <span className="text-surface-200 font-medium">{item.submittedBy}</span> • Host: <span className="text-brand-300 font-semibold">{item.clubName}</span>
                </div>
              </div>

              {item.status === 'PENDING_FACULTY_APPROVAL' && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => setRejectingEvent(item)}
                    iconLeft={XCircle}
                  >
                    Reject Proposal
                  </Button>
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => handleApprove(item.id)}
                    iconLeft={CheckCircle2}
                  >
                    Approve & Publish
                  </Button>
                </div>
              )}
            </div>

            <p className="text-xs text-surface-300 leading-relaxed bg-surface-900/60 p-3 rounded-xl border border-surface-800/80">
              {item.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-surface-400 pt-2 border-t border-surface-800 font-medium">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-brand-400" />
                <span>Schedule: {formatDate(item.date)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-brand-400" />
                <span>Venue: {item.venue}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-brand-400" />
                <span>Capacity: {item.capacity} Attendees</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Reject Modal with Mandatory Reason */}
      {rejectingEvent && (
        <Modal
          isOpen={!!rejectingEvent}
          onClose={() => setRejectingEvent(null)}
          title="Reject Event Proposal"
          description={`Provide explicit feedback to Club Admin regarding why "${rejectingEvent.title}" cannot be approved in its current state.`}
          footer={
            <>
              <Button variant="ghost" size="sm" onClick={() => setRejectingEvent(null)}>
                Cancel
              </Button>
              <Button variant="danger" size="sm" onClick={handleConfirmReject}>
                Confirm Rejection
              </Button>
            </>
          }
        >
          <div className="space-y-3 text-xs">
            <div className="space-y-1.5">
              <label className="block font-semibold text-surface-200">
                Mandatory Rejection Reason & Revision Guidance <span className="text-rose-400">*</span>
              </label>
              <textarea
                rows={4}
                className="w-full rounded-lg bg-surface-900 border border-surface-700 text-surface-100 text-xs p-3 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                placeholder="Specify scheduling conflicts, budget issues, or required safety/venue changes..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                required
              />
            </div>
            <p className="text-[11px] text-surface-400">
              The Club Admin will be notified immediately and will be able to revise and resubmit the proposal.
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default FacultyEventApprovalsPage;
