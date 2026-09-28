import React, { useState } from 'react';
import PageHeader from '../../components/common/PageHeader';
import { Card } from '../../components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { Input } from '../../components/ui/Input';
import { History, Search, ShieldAlert, CheckCircle } from 'lucide-react';
import { formatDateTime } from '../../utils/formatters';

export const SuperAdminAuditLogsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const auditLogs = [
    {
      id: 1081,
      actor: 'Dr. A. Sharma (Super Admin)',
      action: 'TIMETABLE_PERIOD_ADD',
      entity: 'TimetableStructure #1',
      diff: 'Added Period 7 (14:50 - 15:40)',
      timestamp: '2026-09-28T16:20:00',
      ip: '192.168.1.45',
    },
    {
      id: 1080,
      actor: 'Dr. Meera Krishnan (Faculty)',
      action: 'OD_STATUS_UPDATE',
      entity: 'ODRequest #OD-2026-001',
      diff: 'Status changed PENDING -> APPROVED (Mentee: Aarav Patel)',
      timestamp: '2026-09-28T14:35:00',
      ip: '192.168.1.112',
    },
    {
      id: 1079,
      actor: 'Dr. Meera Krishnan (Faculty)',
      action: 'EVENT_STATUS_UPDATE',
      entity: 'Event #1 (YUVA MegaThon 2026)',
      diff: 'Status changed PENDING -> APPROVED',
      timestamp: '2026-09-28T11:45:00',
      ip: '192.168.1.112',
    },
    {
      id: 1078,
      actor: 'Kavya S. (Club Admin)',
      action: 'ROLE_PERMISSION_ASSIGN',
      entity: 'ClubMembership #2 (CodeCraft Club)',
      diff: 'Assigned dynamic role "Technical Lead" to Diya Menon',
      timestamp: '2026-09-27T18:10:00',
      ip: '192.168.2.80',
    },
  ];

  const filteredLogs = auditLogs.filter(
    (log) =>
      log.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.diff.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Security & Platform Audit Logs"
        subtitle="Immutable audit trail of administrative modifications, timetable edits, role delegations, and event approvals."
        breadcrumbs={['YUVA', 'Super Admin', 'Audit Logs']}
      />

      <div className="w-full sm:w-80">
        <Input
          placeholder="Filter by actor, action, or details..."
          icon={Search}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Card className="p-0 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Log ID & Timestamp</TableHead>
              <TableHead>Actor User</TableHead>
              <TableHead>Action Type</TableHead>
              <TableHead>Target Entity</TableHead>
              <TableHead>Change Details / Diff</TableHead>
              <TableHead>IP Address</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLogs.map((log) => (
              <TableRow key={log.id}>
                <TableCell>
                  <div className="font-mono text-xs font-bold text-brand-300">#{log.id}</div>
                  <div className="text-[10px] text-surface-400">{formatDateTime(log.timestamp)}</div>
                </TableCell>
                <TableCell>
                  <span className="text-xs font-semibold text-surface-100">{log.actor}</span>
                </TableCell>
                <TableCell>
                  <span className="text-[10px] font-mono font-bold bg-surface-900 border border-surface-700 px-2 py-0.5 rounded text-surface-300">
                    {log.action}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-xs text-surface-300">{log.entity}</span>
                </TableCell>
                <TableCell>
                  <span className="text-xs text-surface-400 font-mono max-w-sm block truncate">
                    {log.diff}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-xs font-mono text-surface-500">{log.ip}</span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default SuperAdminAuditLogsPage;
