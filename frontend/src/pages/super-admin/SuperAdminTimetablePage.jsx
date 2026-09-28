import React, { useState } from 'react';
import PageHeader from '../../components/common/PageHeader';
import StatusBadge from '../../components/common/StatusBadge';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { useNotification } from '../../hooks/useNotification';
import { Clock, PlusCircle, Trash2, CheckCircle2, Lock, AlertTriangle, Coffee } from 'lucide-react';

export const SuperAdminTimetablePage = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { success, error } = useNotification();

  const [periods, setPeriods] = useState([
    { id: 1, periodNumber: 1, name: 'Period 1', startTime: '08:30', endTime: '09:20', isBreak: false },
    { id: 2, periodNumber: 2, name: 'Period 2', startTime: '09:20', endTime: '10:10', isBreak: false },
    { id: 3, periodNumber: 0, name: 'Morning Refreshment Break', startTime: '10:10', endTime: '10:30', isBreak: true },
    { id: 4, periodNumber: 3, name: 'Period 3', startTime: '10:30', endTime: '11:20', isBreak: false },
    { id: 5, periodNumber: 4, name: 'Period 4', startTime: '11:20', endTime: '12:10', isBreak: false },
    { id: 6, periodNumber: 0, name: 'Lunch Break', startTime: '12:10', endTime: '13:00', isBreak: true },
    { id: 7, periodNumber: 5, name: 'Period 5', startTime: '13:00', endTime: '13:50', isBreak: false },
    { id: 8, periodNumber: 6, name: 'Period 6', startTime: '13:50', endTime: '14:40', isBreak: false },
    { id: 9, periodNumber: 7, name: 'Period 7', startTime: '14:50', endTime: '15:40', isBreak: false },
  ]);

  const [form, setForm] = useState({
    name: '',
    periodNumber: 8,
    startTime: '',
    endTime: '',
    isBreak: false,
  });

  const handleAddPeriod = (e) => {
    e.preventDefault();
    if (form.startTime >= form.endTime) {
      error('Period end time must be strictly after start time.');
      return;
    }

    const newPeriod = {
      id: periods.length + 1,
      name: form.name,
      periodNumber: form.isBreak ? 0 : Number(form.periodNumber),
      startTime: form.startTime,
      endTime: form.endTime,
      isBreak: form.isBreak,
    };

    setPeriods((prev) => [...prev, newPeriod].sort((a, b) => a.startTime.localeCompare(b.startTime)));
    setIsAddModalOpen(false);
    setForm({ name: '', periodNumber: periods.length + 1, startTime: '', endTime: '', isBreak: false });
    success('Timetable period successfully added to active schedule.', 'Period Added');
  };

  const handleDeletePeriod = (id) => {
    setPeriods((prev) => prev.filter((p) => p.id !== id));
    success('Period removed from schedule.', 'Period Deleted');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="College-Wide Timetable Master Manager"
        subtitle="Super Admin Exclusive Authority • Active Timetable Schedule defines period boundaries for automatic OD snapshotting."
        breadcrumbs={['YUVA', 'Super Admin', 'Timetable']}
        actions={
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            iconLeft={PlusCircle}
          >
            Add Period / Break
          </Button>
        }
      />

      {/* Authority Lock Card */}
      <div className="p-4 rounded-xl glass-panel border border-brand-500/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-brand-500/10 text-brand-400">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-surface-100">
              Active Master Timetable: Academic Year 2026 (Odd Semester)
            </h4>
            <p className="text-[11px] text-surface-400">
              All student On-Duty calculations intersect start and end times against this active table.
            </p>
          </div>
        </div>
        <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20 font-semibold">
          ACTIVE SYNC
        </span>
      </div>

      <Card className="p-0 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type & Name</TableHead>
              <TableHead>Academic Period #</TableHead>
              <TableHead>Start Time</TableHead>
              <TableHead>End Time</TableHead>
              <TableHead>OD Calculation Impact</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {periods.map((item) => (
              <TableRow key={item.id} className={item.isBreak ? 'bg-surface-900/40' : ''}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {item.isBreak ? (
                      <Coffee className="w-4 h-4 text-amber-400" />
                    ) : (
                      <Clock className="w-4 h-4 text-brand-400" />
                    )}
                    <span className="font-semibold text-surface-100">{item.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {item.isBreak ? (
                    <span className="text-xs text-surface-500 font-mono">Break Slot</span>
                  ) : (
                    <span className="font-mono text-xs text-brand-300 font-bold bg-brand-950/60 px-2 py-0.5 rounded border border-brand-500/20">
                      Period {item.periodNumber}
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  <span className="font-mono text-xs text-surface-200">{item.startTime}</span>
                </TableCell>
                <TableCell>
                  <span className="font-mono text-xs text-surface-200">{item.endTime}</span>
                </TableCell>
                <TableCell>
                  {item.isBreak ? (
                    <span className="text-[11px] text-surface-500">Excluded (No OD Required)</span>
                  ) : (
                    <span className="text-[11px] text-emerald-400 font-medium">Included in OD Snapshot</span>
                  )}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeletePeriod(item.id)}
                    className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Add Period Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Timetable Slot"
        description="Configure period timing or break duration in the master timetable."
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleAddPeriod}>
              Save Slot
            </Button>
          </>
        }
      >
        <form onSubmit={handleAddPeriod} className="space-y-4 text-xs">
          <Input
            label="Slot Name"
            placeholder="e.g. Period 8 or Afternoon Tea Break"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Start Time (24h)"
              type="time"
              value={form.startTime}
              onChange={(e) => setForm({ ...form, startTime: e.target.value })}
              required
            />
            <Input
              label="End Time (24h)"
              type="time"
              value={form.endTime}
              onChange={(e) => setForm({ ...form, endTime: e.target.value })}
              required
            />
          </div>

          <div className="p-3 rounded-xl bg-surface-900 border border-surface-800 space-y-2">
            <label className="flex items-center gap-2 cursor-pointer text-surface-200 font-medium">
              <input
                type="checkbox"
                checked={form.isBreak}
                onChange={(e) => setForm({ ...form, isBreak: e.target.checked })}
                className="rounded bg-surface-950 border-surface-700 text-brand-600 focus:ring-brand-500"
              />
              <span>Mark this slot as Break (Lunch, Refreshment)</span>
            </label>
            <p className="text-[10px] text-surface-500">
              Break slots are automatically bypassed during student On-Duty period calculation.
            </p>
          </div>

          {!form.isBreak && (
            <Input
              label="Academic Period Number"
              type="number"
              value={form.periodNumber}
              onChange={(e) => setForm({ ...form, periodNumber: e.target.value })}
              required
            />
          )}
        </form>
      </Modal>
    </div>
  );
};

export default SuperAdminTimetablePage;
