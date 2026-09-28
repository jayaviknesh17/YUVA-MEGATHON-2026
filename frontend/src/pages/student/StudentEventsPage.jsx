import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import StatusBadge from '../../components/common/StatusBadge';
import EmptyState from '../../components/common/EmptyState';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { useNotification } from '../../hooks/useNotification';
import {
  Search,
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  FileCheck,
  Building,
} from 'lucide-react';
import { formatDate } from '../../utils/formatters';

export const StudentEventsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedEventForModal, setSelectedEventForModal] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const { success, info } = useNotification();
  const navigate = useNavigate();

  // Mock approved events catalog
  const [events, setEvents] = useState([
    {
      id: 1,
      title: 'YUVA MegaThon 2026: 36-Hour Hackathon',
      category: 'TECHNICAL',
      clubName: 'CodeCraft Club',
      description: 'The premier 36-hour hackathon across AI, Web3, IoT, and Cloud computing tracks.',
      venue: 'Main Auditorium & Computer Lab 4',
      date: '2026-10-15T09:00:00',
      endDate: '2026-10-16T21:00:00',
      capacity: 250,
      registeredCount: 184,
      status: 'APPROVED',
      isRegistered: true,
    },
    {
      id: 2,
      title: 'Generative AI & LLM Systems Workshop',
      category: 'WORKSHOP',
      clubName: 'AI & Robotics Club',
      description: 'Hands-on exploration of Retrieval-Augmented Generation (RAG) and Agentic pipelines.',
      venue: 'Seminar Hall B',
      date: '2026-10-18T14:00:00',
      endDate: '2026-10-18T17:00:00',
      capacity: 100,
      registeredCount: 88,
      status: 'APPROVED',
      isRegistered: true,
    },
    {
      id: 3,
      title: 'Cloud Architecture Hands-on Bootcamp',
      category: 'TECHNICAL',
      clubName: 'Cloud & DevOps Club',
      description: 'Zero-to-production deployment architectures using containers and serverless orchestration.',
      venue: 'Virtual Hall 2',
      date: '2026-10-22T10:00:00',
      endDate: '2026-10-22T16:00:00',
      capacity: 150,
      registeredCount: 62,
      status: 'APPROVED',
      isRegistered: false,
    },
    {
      id: 4,
      title: 'Design Sprint: UX & Interaction Architecture',
      category: 'DESIGN',
      clubName: 'Designers Guild',
      description: 'Rapid prototyping and human-centric design thinking for campus mobile applications.',
      venue: 'Design Studio 1',
      date: '2026-10-25T11:00:00',
      endDate: '2026-10-25T15:30:00',
      capacity: 60,
      registeredCount: 45,
      status: 'APPROVED',
      isRegistered: false,
    },
  ]);

  const filteredEvents = events.filter((evt) => {
    const matchesSearch =
      evt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evt.clubName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evt.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || evt.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleRegister = (event) => {
    setIsRegistering(true);
    setTimeout(() => {
      setEvents((prev) =>
        prev.map((e) => (e.id === event.id ? { ...e, isRegistered: true, registeredCount: e.registeredCount + 1 } : e))
      );
      setIsRegistering(false);
      setSelectedEventForModal(null);
      success(`Successfully registered for "${event.title}"! You can now apply for OD.`, 'Registration Confirmed');
    }, 400);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Explore Campus Events"
        subtitle="Browse approved events, register seamlessly, and secure On-Duty (OD) permissions from your class mentor."
        breadcrumbs={['YUVA', 'Student', 'Events']}
      />

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl glass-panel border border-surface-800">
        <div className="relative w-full sm:w-80">
          <Input
            placeholder="Search events, clubs, topics..."
            icon={Search}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {['ALL', 'TECHNICAL', 'WORKSHOP', 'DESIGN'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-surface-900 text-surface-400 hover:text-surface-200 border border-surface-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Events Grid */}
      {filteredEvents.length === 0 ? (
        <EmptyState
          title="No events match your criteria"
          description="Try modifying your search keywords or switching category filters."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredEvents.map((evt) => {
            const isFull = evt.registeredCount >= evt.capacity;
            return (
              <Card key={evt.id} className="flex flex-col justify-between border-surface-800 hover:border-brand-500/30 transition-all">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-brand-400 bg-brand-500/10 px-2.5 py-0.5 rounded-full border border-brand-500/20">
                      {evt.clubName}
                    </span>
                    <StatusBadge status={evt.status} />
                  </div>

                  <h3 className="text-lg font-bold text-surface-50 leading-snug">{evt.title}</h3>
                  <p className="text-xs text-surface-400 line-clamp-2 leading-relaxed">{evt.description}</p>

                  <div className="grid grid-cols-2 gap-2 text-xs text-surface-300 pt-2 border-t border-surface-800/60 font-medium">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-brand-400" />
                      <span>{formatDate(evt.date)}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-brand-400" />
                      <span>{new Date(evt.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div className="flex items-center gap-1.5 col-span-2">
                      <MapPin className="w-3.5 h-3.5 text-brand-400" />
                      <span className="truncate">{evt.venue}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-surface-800 flex items-center justify-between">
                  <div className="text-xs text-surface-400 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    <span>
                      {evt.registeredCount}/{evt.capacity} spots filled
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {evt.isRegistered ? (
                      <>
                        <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Registered
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate('/student/od')}
                          iconLeft={FileCheck}
                        >
                          OD
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant={isFull ? 'secondary' : 'primary'}
                        size="sm"
                        disabled={isFull}
                        onClick={() => setSelectedEventForModal(evt)}
                      >
                        {isFull ? 'Event Full' : 'Register Now'}
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Registration Confirmation Modal */}
      {selectedEventForModal && (
        <Modal
          isOpen={!!selectedEventForModal}
          onClose={() => setSelectedEventForModal(null)}
          title="Confirm Event Registration"
          description={`Lock your seat for ${selectedEventForModal.title}`}
          footer={
            <>
              <Button variant="ghost" size="sm" onClick={() => setSelectedEventForModal(null)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                isLoading={isRegistering}
                onClick={() => handleRegister(selectedEventForModal)}
              >
                Confirm Registration
              </Button>
            </>
          }
        >
          <div className="space-y-4 text-xs">
            <div className="p-3.5 rounded-xl bg-surface-900 border border-surface-800 space-y-2">
              <div className="flex justify-between">
                <span className="text-surface-400">Host Club:</span>
                <span className="font-semibold text-surface-200">{selectedEventForModal.clubName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-surface-400">Schedule:</span>
                <span className="font-semibold text-surface-200">{formatDate(selectedEventForModal.date)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-surface-400">Venue:</span>
                <span className="font-semibold text-surface-200">{selectedEventForModal.venue}</span>
              </div>
            </div>
            <p className="text-surface-400 leading-relaxed">
              Upon confirming registration, you will receive an eligibility token and can directly submit an On-Duty (OD) request to your Class Mentor.
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default StudentEventsPage;
