import React, { useState } from 'react';
import PageHeader from '../../components/common/PageHeader';
import StatusBadge from '../../components/common/StatusBadge';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { useNotification } from '../../hooks/useNotification';
import {
  PlusCircle,
  Send,
  Calendar,
  Clock,
  MapPin,
  Users,
  AlertOctagon,
  CheckCircle2,
  Edit,
} from 'lucide-react';
import { formatDate } from '../../utils/formatters';

export const ClubEventsManagePage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { success, warning } = useNotification();

  const [form, setForm] = useState({
    title: '',
    venue: '',
    startDatetime: '',
    endDatetime: '',
    capacity: 100,
    description: '',
  });

  const [events, setEvents] = useState([
    {
      id: 1,
      title: 'YUVA MegaThon 2026: 36-Hour Hackathon',
      venue: 'Main Auditorium & Computer Lab 4',
      date: '2026-10-15T09:00:00',
      capacity: 250,
      currentRegistrations: 184,
      status: 'APPROVED',
      rejectionReason: null,
    },
    {
      id: 2,
      title: 'Web3 & Decentralized Finance Bootcamp',
      venue: 'Seminar Hall 3',
      date: '2026-10-28T10:00:00',
      capacity: 100,
      currentRegistrations: 0,
      status: 'PENDING_FACULTY_APPROVAL',
      rejectionReason: null,
    },
    {
      id: 3,
      title: 'Cybersecurity Threat Modeling Workshop',
      venue: 'Lab 2',
      date: '2026-11-02T13:00:00',
      capacity: 60,
      currentRegistrations: 0,
      status: 'REJECTED',
      rejectionReason: 'Event clashes with mid-term assessments in Department. Please reschedule to Friday afternoon.',
    },
    {
      id: 4,
      title: 'Autonomous Drone Systems Workshop',
      venue: 'Open Tech Grounds',
      date: '2026-11-04T14:00:00',
      capacity: 80,
      currentRegistrations: 0,
      status: 'DRAFT',
      rejectionReason: null,
    },
  ]);

  const handleCreateDraft = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      const newEvent = {
        id: events.length + 1,
        title: form.title,
        venue: form.venue,
        date: form.startDatetime,
        capacity: Number(form.capacity),
        currentRegistrations: 0,
        status: 'DRAFT',
        rejectionReason: null,
      };
      setEvents((prev) => [newEvent, ...prev]);
      setIsSubmitting(false);
      setIsCreateModalOpen(false);
      setForm({ title: '', venue: '', startDatetime: '', endDatetime: '', capacity: 100, description: '' });
      success('Draft event created. You can now submit it for Faculty Coordinator approval.', 'Draft Created');
    }, 400);
  };

  const handleSubmitForApproval = (eventId) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === eventId ? { ...e, status: 'PENDING_FACULTY_APPROVAL', rejectionReason: null } : e))
    );
    success('Event proposal submitted to Faculty Coordinator (Dr. Meera Krishnan) for review.', 'Submitted for Approval');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Event Lifecycle & Proposals"
        subtitle="Create draft proposals, resolve faculty feedback, and publish approved campus events."
        breadcrumbs={['YUVA', 'Club Admin', 'Events']}
        actions={
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsCreateModalOpen(true)}
            iconLeft={PlusCircle}
          >
            Create Event Proposal
          </Button>
        }
      />

      {/* Events Grid */}
      <div className="space-y-4">
        {events.map((evt) => (
          <Card key={evt.id} className="border-surface-800 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h3 className="text-base font-bold text-surface-50">{evt.title}</h3>
                  <StatusBadge status={evt.status} />
                </div>

                <div className="flex items-center gap-4 text-xs text-surface-400 font-medium">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-brand-400" />
                    {formatDate(evt.date)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-brand-400" />
                    {evt.venue}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-brand-400" />
                    Capacity: {evt.capacity} students ({evt.currentRegistrations} registered)
                  </span>
                </div>
              </div>

              {/* Action Buttons based on status */}
              <div className="flex items-center gap-2">
                {evt.status === 'DRAFT' && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleSubmitForApproval(evt.id)}
                    iconLeft={Send}
                  >
                    Submit for Approval
                  </Button>
                )}

                {evt.status === 'REJECTED' && (
                  <Button
                    variant="warning"
                    size="sm"
                    onClick={() => handleSubmitForApproval(evt.id)}
                    iconLeft={Send}
                  >
                    Resubmit to Faculty
                  </Button>
                )}

                {evt.status === 'PENDING_FACULTY_APPROVAL' && (
                  <span className="text-xs text-amber-400 font-medium bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/30">
                    Awaiting Coordinator Review
                  </span>
                )}

                {evt.status === 'APPROVED' && (
                  <span className="text-xs text-emerald-400 font-medium bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/30 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Published & Live
                  </span>
                )}
              </div>
            </div>

            {/* Rejection Justification Box if Rejected */}
            {evt.status === 'REJECTED' && evt.rejectionReason && (
              <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-xs text-rose-300 flex items-start gap-2.5">
                <AlertOctagon className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-400" />
                <div>
                  <span className="font-bold text-rose-200">Faculty Coordinator Rejection Feedback: </span>
                  <span>{evt.rejectionReason}</span>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Create Event Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Event Proposal"
        description="Draft details for faculty coordinator evaluation and campus publishing."
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              isLoading={isSubmitting}
              onClick={handleCreateDraft}
            >
              Save as Draft
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreateDraft} className="space-y-4 text-xs">
          <Input
            label="Event Title"
            placeholder="e.g. Autonomous Robotics Hackathon"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Venue / Room"
              placeholder="e.g. Lab 4 / Audi 1"
              value={form.venue}
              onChange={(e) => setForm({ ...form, venue: e.target.value })}
              required
            />
            <Input
              label="Attendee Capacity"
              type="number"
              value={form.capacity}
              onChange={(e) => setForm({ ...form, capacity: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Start Date & Time"
              type="datetime-local"
              value={form.startDatetime}
              onChange={(e) => setForm({ ...form, startDatetime: e.target.value })}
              required
            />
            <Input
              label="End Date & Time"
              type="datetime-local"
              value={form.endDatetime}
              onChange={(e) => setForm({ ...form, endDatetime: e.target.value })}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="block font-medium text-surface-300">Description & Tracks</label>
            <textarea
              rows={3}
              className="w-full rounded-lg bg-surface-900 border border-surface-700 text-surface-100 text-xs p-3 focus:ring-2 focus:ring-brand-500 focus:outline-none"
              placeholder="Provide event overview, eligibility, prerequisites..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ClubEventsManagePage;
