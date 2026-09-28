import React, { useState } from 'react';
import PageHeader from '../../components/common/PageHeader';
import StatusBadge from '../../components/common/StatusBadge';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { useNotification } from '../../hooks/useNotification';
import { QrCode, Search, CheckCircle2, UserCheck, ShieldCheck } from 'lucide-react';

export const ClubAttendancePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { success } = useNotification();

  const [attendees, setAttendees] = useState([
    {
      id: 1,
      studentName: 'Aarav Patel',
      raNumber: 'RA2311003010001',
      eventName: 'YUVA MegaThon 2026',
      registrationStatus: 'CONFIRMED',
      attendanceStatus: 'PRESENT',
      checkInTime: '08:45 AM',
    },
    {
      id: 2,
      studentName: 'Diya Menon',
      raNumber: 'RA2311003010002',
      eventName: 'YUVA MegaThon 2026',
      registrationStatus: 'CONFIRMED',
      attendanceStatus: 'PRESENT',
      checkInTime: '08:50 AM',
    },
    {
      id: 3,
      studentName: 'Vikram Seth',
      raNumber: 'RA2311003010088',
      eventName: 'YUVA MegaThon 2026',
      registrationStatus: 'CONFIRMED',
      attendanceStatus: 'ABSENT',
      checkInTime: '—',
    },
  ]);

  const handleMarkPresent = (id) => {
    setAttendees((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, attendanceStatus: 'PRESENT', checkInTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) } : a
      )
    );
    success('Student attendance marked. Certificate & Badge eligibility unlocked.', 'Attendance Recorded');
  };

  const filteredAttendees = attendees.filter(
    (a) =>
      a.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.raNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Event Attendance & Check-In"
        subtitle="Validate registered attendees and record check-in via QR or manual RA search."
        breadcrumbs={['YUVA', 'Club Admin', 'Attendance']}
      />

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl glass-panel border border-surface-800">
        <div className="w-full sm:w-80">
          <Input
            placeholder="Search by student name or 15-char RA..."
            icon={Search}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" iconLeft={QrCode}>
            Launch QR Scanner
          </Button>
        </div>
      </div>

      <Card className="p-0 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student Name</TableHead>
              <TableHead>RA Number</TableHead>
              <TableHead>Registration</TableHead>
              <TableHead>Attendance Status</TableHead>
              <TableHead>Check-In Time</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAttendees.map((att) => (
              <TableRow key={att.id}>
                <TableCell>
                  <div className="font-semibold text-surface-100">{att.studentName}</div>
                  <div className="text-[10px] text-surface-400">{att.eventName}</div>
                </TableCell>
                <TableCell>
                  <span className="font-mono text-xs text-brand-300 bg-brand-950/60 px-2 py-0.5 rounded border border-brand-500/20">
                    {att.raNumber}
                  </span>
                </TableCell>
                <TableCell>
                  <StatusBadge status={att.registrationStatus} />
                </TableCell>
                <TableCell>
                  <StatusBadge status={att.attendanceStatus} />
                </TableCell>
                <TableCell>
                  <span className="text-xs text-surface-400 font-mono">{att.checkInTime}</span>
                </TableCell>
                <TableCell>
                  {att.attendanceStatus === 'ABSENT' ? (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleMarkPresent(att.id)}
                      iconLeft={UserCheck}
                    >
                      Mark Present
                    </Button>
                  ) : (
                    <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Verified
                    </span>
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

export default ClubAttendancePage;
