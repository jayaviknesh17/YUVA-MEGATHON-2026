import React, { useState } from 'react';
import PageHeader from '../../components/common/PageHeader';
import StatusBadge from '../../components/common/StatusBadge';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { useNotification } from '../../hooks/useNotification';
import { Building2, PlusCircle, Shield, User } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

export const AdminClubsPage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { success } = useNotification();

  const [clubs, setClubs] = useState([
    {
      id: 1,
      name: 'CodeCraft Club',
      code: 'CCC-01',
      category: 'TECHNICAL',
      leadAdmin: 'Kavya S.',
      coordinator: 'Dr. Meera Krishnan',
      memberCount: 142,
      status: 'ACTIVE',
      createdAt: '2026-01-15',
    },
    {
      id: 2,
      name: 'AI & Robotics Club',
      code: 'AIR-02',
      category: 'INNOVATION',
      leadAdmin: 'Rohan V.',
      coordinator: 'Dr. S. Raman',
      memberCount: 98,
      status: 'ACTIVE',
      createdAt: '2026-02-10',
    },
    {
      id: 3,
      name: 'Cloud & DevOps Club',
      code: 'CDC-03',
      category: 'INFRASTRUCTURE',
      leadAdmin: 'Ananya G.',
      coordinator: 'Prof. K. Venkatesh',
      memberCount: 76,
      status: 'ACTIVE',
      createdAt: '2026-03-01',
    },
  ]);

  const [form, setForm] = useState({
    name: '',
    code: '',
    category: 'TECHNICAL',
    leadEmail: '',
    coordinatorEmail: '',
  });

  const handleCreateClub = (e) => {
    e.preventDefault();
    const newClub = {
      id: clubs.length + 1,
      name: form.name,
      code: form.code,
      category: form.category,
      leadAdmin: form.leadEmail,
      coordinator: form.coordinatorEmail,
      memberCount: 1,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
    };
    setClubs((prev) => [...prev, newClub]);
    setIsCreateModalOpen(false);
    setForm({ name: '', code: '', category: 'TECHNICAL', leadEmail: '', coordinatorEmail: '' });
    success(`Club "${form.name}" created and recognized.`, 'Club Registered');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Campus Clubs Governance"
        subtitle="Approve new club charters, assign faculty coordinators, and oversee club health metrics."
        breadcrumbs={['YUVA', 'Admin', 'Clubs']}
        actions={
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsCreateModalOpen(true)}
            iconLeft={PlusCircle}
          >
            Charter New Club
          </Button>
        }
      />

      <Card className="p-0 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Club Name & Code</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Lead Student Admin</TableHead>
              <TableHead>Faculty Coordinator</TableHead>
              <TableHead>Total Members</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clubs.map((club) => (
              <TableRow key={club.id}>
                <TableCell>
                  <div className="font-semibold text-surface-100">{club.name}</div>
                  <div className="text-[10px] font-mono text-brand-400">{club.code}</div>
                </TableCell>
                <TableCell>
                  <span className="text-xs bg-surface-900 border border-surface-700 px-2 py-0.5 rounded text-surface-300">
                    {club.category}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-xs text-surface-200 font-medium">{club.leadAdmin}</span>
                </TableCell>
                <TableCell>
                  <span className="text-xs text-surface-200 font-medium">{club.coordinator}</span>
                </TableCell>
                <TableCell>
                  <span className="text-xs text-surface-400">{club.memberCount} members</span>
                </TableCell>
                <TableCell>
                  <StatusBadge status={club.status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Charter Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Charter New Campus Club"
        description="Establish an official recognized student club entity."
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleCreateClub}>
              Charter Club
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreateClub} className="space-y-4 text-xs">
          <Input
            label="Club Name"
            placeholder="e.g. Cyber Security Society"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Club Code"
              placeholder="e.g. CSS-05"
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value })}
              required
            />
            <Select
              label="Category"
              options={['TECHNICAL', 'INNOVATION', 'CULTURAL', 'SPORTS', 'DESIGN']}
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            />
          </div>

          <Input
            label="Designated Lead Student Email"
            type="email"
            placeholder="student@yuva.edu"
            value={form.leadEmail}
            onChange={(e) => setForm({ ...form, leadEmail: e.target.value })}
            required
          />

          <Input
            label="Designated Faculty Coordinator Email"
            type="email"
            placeholder="faculty@yuva.edu"
            value={form.coordinatorEmail}
            onChange={(e) => setForm({ ...form, coordinatorEmail: e.target.value })}
            required
          />
        </form>
      </Modal>
    </div>
  );
};

export default AdminClubsPage;
