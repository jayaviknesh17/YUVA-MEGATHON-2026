import React, { useState } from 'react';
import PageHeader from '../../components/common/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { Select } from '../../components/ui/Select';
import { Modal } from '../../components/ui/Modal';
import { useNotification } from '../../hooks/useNotification';
import { Users, Shield, UserCheck, PlusCircle } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

export const ClubMembersPage = () => {
  const [selectedMember, setSelectedMember] = useState(null);
  const [selectedRoleId, setSelectedRoleId] = useState('');
  const { success } = useNotification();

  const [members, setMembers] = useState([
    {
      id: 1,
      name: 'Diya Menon',
      raNumber: 'RA2311003010002',
      email: 'diya@yuva.edu',
      department: 'CSE (Sec-A)',
      dynamicRole: 'Technical Lead',
      joinedAt: '2026-08-01',
      status: 'ACTIVE',
    },
    {
      id: 2,
      name: 'Aarav Patel',
      raNumber: 'RA2311003010001',
      email: 'aarav@yuva.edu',
      department: 'CSE (Sec-A)',
      dynamicRole: 'Member',
      joinedAt: '2026-08-10',
      status: 'ACTIVE',
    },
    {
      id: 3,
      name: 'Siddharth V.',
      raNumber: 'RA2311003010045',
      email: 'siddharth@yuva.edu',
      department: 'CSE (Sec-B)',
      dynamicRole: 'Event Coordinator',
      joinedAt: '2026-08-15',
      status: 'ACTIVE',
    },
  ]);

  const availableRoles = [
    { label: 'General Member', value: 'Member' },
    { label: 'Technical Lead', value: 'Technical Lead' },
    { label: 'Event Coordinator', value: 'Event Coordinator' },
    { label: 'Media & Design Head', value: 'Media & Design Head' },
  ];

  const handleAssignRole = () => {
    if (!selectedRoleId || !selectedMember) return;
    setMembers((prev) =>
      prev.map((m) => (m.id === selectedMember.id ? { ...m, dynamicRole: selectedRoleId } : m))
    );
    success(`Role updated to "${selectedRoleId}" for ${selectedMember.name}.`, 'Role Assigned');
    setSelectedMember(null);
    setSelectedRoleId('');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Club Members & Roles"
        subtitle="Manage student members and assign database-driven dynamic roles with granular permissions."
        breadcrumbs={['YUVA', 'Club Admin', 'Members']}
      />

      <Card className="p-0 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>RA Number</TableHead>
              <TableHead>Department / Section</TableHead>
              <TableHead>Assigned Dynamic Role</TableHead>
              <TableHead>Joined Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member.id}>
                <TableCell>
                  <div className="font-semibold text-surface-100">{member.name}</div>
                  <div className="text-[11px] text-surface-400">{member.email}</div>
                </TableCell>
                <TableCell>
                  <span className="font-mono text-xs text-brand-300 bg-brand-950/60 px-2 py-0.5 rounded border border-brand-500/20">
                    {member.raNumber}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-xs text-surface-300">{member.department}</span>
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                      member.dynamicRole === 'Member'
                        ? 'bg-surface-800 text-surface-300 border-surface-700'
                        : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                    }`}
                  >
                    <Shield className="w-3 h-3" />
                    <span>{member.dynamicRole}</span>
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-xs text-surface-400">{formatDate(member.joinedAt)}</span>
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedMember(member);
                      setSelectedRoleId(member.dynamicRole);
                    }}
                  >
                    Change Role
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Role Assignment Modal */}
      {selectedMember && (
        <Modal
          isOpen={!!selectedMember}
          onClose={() => setSelectedMember(null)}
          title="Assign Dynamic Club Role"
          description={`Update position and authority for ${selectedMember.name} in CodeCraft Club.`}
          footer={
            <>
              <Button variant="ghost" size="sm" onClick={() => setSelectedMember(null)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleAssignRole}>
                Save Assignment
              </Button>
            </>
          }
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 rounded-xl bg-surface-900 border border-surface-800 space-y-1">
              <div className="text-surface-400">Student: <span className="text-surface-100 font-semibold">{selectedMember.name}</span></div>
              <div className="text-surface-400">RA Number: <span className="font-mono text-brand-300">{selectedMember.raNumber}</span></div>
            </div>

            <Select
              label="Select Dynamic Club Role"
              options={availableRoles}
              value={selectedRoleId}
              onChange={(e) => setSelectedRoleId(e.target.value)}
            />
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ClubMembersPage;
