import React, { useState } from 'react';
import PageHeader from '../../components/common/PageHeader';
import StatusBadge from '../../components/common/StatusBadge';
import { Card } from '../../components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Search, Shield, User } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

export const AdminUsersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  const users = [
    {
      id: 1,
      fullName: 'Dr. A. Sharma',
      email: 'superadmin@yuva.edu',
      role: 'SUPER_ADMIN',
      raNumber: null,
      department: 'Dean Office',
      createdAt: '2026-01-01',
    },
    {
      id: 2,
      fullName: 'Prof. R. Nair',
      email: 'admin@yuva.edu',
      role: 'ADMIN',
      raNumber: null,
      department: 'Student Affairs',
      createdAt: '2026-01-05',
    },
    {
      id: 3,
      fullName: 'Dr. Meera Krishnan',
      email: 'faculty@yuva.edu',
      role: 'FACULTY',
      raNumber: null,
      department: 'CSE',
      createdAt: '2026-01-10',
    },
    {
      id: 4,
      fullName: 'Kavya S.',
      email: 'clubadmin@yuva.edu',
      role: 'CLUB_ADMIN',
      raNumber: 'RA2311003010099',
      department: 'CSE',
      createdAt: '2026-01-15',
    },
    {
      id: 5,
      fullName: 'Aarav Patel',
      email: 'aarav@yuva.edu',
      role: 'STUDENT',
      raNumber: 'RA2311003010001',
      department: 'CSE (Sec-A)',
      createdAt: '2026-01-20',
    },
    {
      id: 6,
      fullName: 'Diya Menon',
      email: 'diya@yuva.edu',
      role: 'STUDENT',
      raNumber: 'RA2311003010002',
      department: 'CSE (Sec-A)',
      createdAt: '2026-01-20',
    },
  ];

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.raNumber && u.raNumber.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Institutional User Directory"
        subtitle="Manage and audit system accounts across Super Admin, Admin, Faculty, Club Admin, and Student roles."
        breadcrumbs={['YUVA', 'Admin', 'Users']}
      />

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl glass-panel border border-surface-800">
        <div className="w-full sm:w-80">
          <Input
            placeholder="Search name, email, or 15-char RA..."
            icon={Search}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="w-full sm:w-48">
          <Select
            options={[
              { label: 'All Roles', value: 'ALL' },
              { label: 'Super Admin', value: 'SUPER_ADMIN' },
              { label: 'Admin', value: 'ADMIN' },
              { label: 'Faculty', value: 'FACULTY' },
              { label: 'Club Admin', value: 'CLUB_ADMIN' },
              { label: 'Student', value: 'STUDENT' },
            ]}
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          />
        </div>
      </div>

      <Card className="p-0 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Institutional Role</TableHead>
              <TableHead>Student RA Number (15-Char)</TableHead>
              <TableHead>Department / Unit</TableHead>
              <TableHead>Created At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="font-semibold text-surface-100">{user.fullName}</div>
                  <div className="text-[11px] text-surface-400">{user.email}</div>
                </TableCell>
                <TableCell>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-brand-500/10 text-brand-300 border border-brand-500/20">
                    <Shield className="w-3 h-3" />
                    <span>{user.role.replace('_', ' ')}</span>
                  </span>
                </TableCell>
                <TableCell>
                  {user.raNumber ? (
                    <span className="font-mono text-xs text-brand-300 bg-brand-950/60 px-2 py-0.5 rounded border border-brand-500/20">
                      {user.raNumber}
                    </span>
                  ) : (
                    <span className="text-xs text-surface-500">N/A (Staff/Admin)</span>
                  )}
                </TableCell>
                <TableCell>
                  <span className="text-xs text-surface-300">{user.department}</span>
                </TableCell>
                <TableCell>
                  <span className="text-xs text-surface-400">{formatDate(user.createdAt)}</span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default AdminUsersPage;
