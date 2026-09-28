import React, { useState } from 'react';
import PageHeader from '../../components/common/PageHeader';
import StatusBadge from '../../components/common/StatusBadge';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { useNotification } from '../../hooks/useNotification';
import { FileCheck2, CheckCircle2, XCircle, Clock, User } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

export const FacultyODApprovalsPage = () => {
  const { success, warning } = useNotification();

  const [odList, setOdList] = useState([
    {
      id: 'OD-2026-002',
      studentName: 'Aarav Patel',
      raNumber: 'RA2311003010001',
      eventName: 'Generative AI & LLM Systems Workshop',
      eventDate: '2026-10-18',
      reason: 'Attending specialized hands-on technical workshop in seminar hall.',
      snapshottedPeriods: [
        { period: 6, time: '14:00 - 14:50' },
        { period: 7, time: '14:50 - 15:40' },
      ],
      status: 'PENDING_MENTOR_APPROVAL',
      appliedAt: '2026-09-28T09:15:00',
    },
    {
      id: 'OD-2026-003',
      studentName: 'Diya Menon',
      raNumber: 'RA2311003010002',
      eventName: 'Cloud Architecture Hands-on Bootcamp',
      eventDate: '2026-10-22',
      reason: 'Technical Lead role organizing deployments during live track.',
      snapshottedPeriods: [
        { period: 3, time: '10:30 - 11:20' },
        { period: 4, time: '11:20 - 12:10' },
      ],
      status: 'PENDING_MENTOR_APPROVAL',
      appliedAt: '2026-09-28T10:00:00',
    },
    {
      id: 'OD-2026-001',
      studentName: 'Aarav Patel',
      raNumber: 'RA2311003010001',
      eventName: 'YUVA MegaThon 2026: 36-Hour Hackathon',
      eventDate: '2026-10-15',
      reason: 'Department representative in competitive hackathon track.',
      snapshottedPeriods: [
        { period: 1, time: '08:30 - 09:20' },
        { period: 2, time: '09:20 - 10:10' },
        { period: 3, time: '10:30 - 11:20' },
        { period: 4, time: '11:20 - 12:10' },
      ],
      status: 'APPROVED',
      appliedAt: '2026-09-25T14:30:00',
    },
  ]);

  const handleApprove = (id) => {
    setOdList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'APPROVED' } : item))
    );
    success(`On-Duty clearance granted for ${id}. Class attendance will be marked exempt.`, 'OD Approved');
  };

  const handleReject = (id) => {
    setOdList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'REJECTED' } : item))
    );
    warning(`On-Duty request ${id} was rejected.`, 'OD Rejected');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Student On-Duty (OD) Clearances"
        subtitle="Scope 2: Class Mentor Desk (Section-A) • Review calculated period exemptions before approving attendance waivers."
        breadcrumbs={['YUVA', 'Faculty', 'OD Clearances']}
      />

      <Card className="p-0 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student (Mentee)</TableHead>
              <TableHead>Target Event</TableHead>
              <TableHead>Calculated Periods</TableHead>
              <TableHead>Justification Reason</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Mentor Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {odList.map((od) => (
              <TableRow key={od.id}>
                <TableCell>
                  <div className="font-semibold text-surface-100">{od.studentName}</div>
                  <div className="text-[11px] font-mono text-brand-300">{od.raNumber}</div>
                </TableCell>
                <TableCell>
                  <div className="text-xs font-semibold text-surface-200">{od.eventName}</div>
                  <div className="text-[10px] text-surface-500">{formatDate(od.eventDate)}</div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {od.snapshottedPeriods.map((p, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-mono bg-surface-900 text-brand-300 border border-brand-500/20 px-1.5 py-0.5 rounded"
                      >
                        P{p.period} ({p.time})
                      </span>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-xs text-surface-300 max-w-xs block leading-tight">
                    {od.reason}
                  </span>
                </TableCell>
                <TableCell>
                  <StatusBadge status={od.status} />
                </TableCell>
                <TableCell>
                  {od.status === 'PENDING_MENTOR_APPROVAL' ? (
                    <div className="flex items-center gap-1.5">
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => handleApprove(od.id)}
                        iconLeft={CheckCircle2}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleReject(od.id)}
                        iconLeft={XCircle}
                      >
                        Reject
                      </Button>
                    </div>
                  ) : (
                    <span className="text-xs text-surface-500 font-medium">Reviewed</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default FacultyODApprovalsPage;
