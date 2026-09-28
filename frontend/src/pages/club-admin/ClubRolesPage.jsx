import React, { useState } from 'react';
import PageHeader from '../../components/common/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { useNotification } from '../../hooks/useNotification';
import { Layers, PlusCircle, CheckSquare, Shield } from 'lucide-react';

export const ClubRolesPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roleName, setRoleName] = useState('');
  const [permissions, setPermissions] = useState({
    can_create_events: true,
    can_mark_attendance: false,
    can_manage_assets: true,
  });
  const { success } = useNotification();

  const [roles, setRoles] = useState([
    {
      id: 1,
      name: 'Technical Lead',
      description: 'Manages coding platforms, problem statements, and technical mentors.',
      permissions: ['Create Draft Events', 'Manage Workshop Assets'],
      memberCount: 1,
    },
    {
      id: 2,
      name: 'Event Coordinator',
      description: 'Coordinates venues, volunteer rosters, and check-in desks.',
      permissions: ['Create Draft Events', 'Mark Event Attendance'],
      memberCount: 2,
    },
    {
      id: 3,
      name: 'Media & Design Head',
      description: 'Designs posters, manages social media outreach, and photography.',
      permissions: ['Manage Workshop Assets'],
      memberCount: 1,
    },
  ]);

  const handleCreateRole = (e) => {
    e.preventDefault();
    if (!roleName) return;

    const newRole = {
      id: roles.length + 1,
      name: roleName,
      description: 'Custom dynamic role created for CodeCraft Club operations.',
      permissions: Object.keys(permissions).filter((k) => permissions[k]),
      memberCount: 0,
    };

    setRoles((prev) => [...prev, newRole]);
    setIsModalOpen(false);
    setRoleName('');
    success(`Dynamic role "${roleName}" added to club configuration.`, 'Role Created');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dynamic Club Roles"
        subtitle="Define database-driven sub-lead roles and permission capabilities specific to CodeCraft Club."
        breadcrumbs={['YUVA', 'Club Admin', 'Dynamic Roles']}
        actions={
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsModalOpen(true)}
            iconLeft={PlusCircle}
          >
            Create Dynamic Role
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {roles.map((role) => (
          <Card key={role.id} className="border-surface-800 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Layers className="w-5 h-5" />
                </div>
                <span className="text-xs text-surface-400 font-mono">
                  {role.memberCount} Assigned
                </span>
              </div>

              <h3 className="text-base font-bold text-surface-50">{role.name}</h3>
              <p className="text-xs text-surface-400 leading-relaxed">{role.description}</p>

              <div className="pt-3 border-t border-surface-800 space-y-1.5">
                <span className="text-[11px] font-semibold text-surface-400 uppercase tracking-wider">
                  Granted Capabilities:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {role.permissions.map((perm, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] bg-surface-900 text-surface-300 border border-surface-700 px-2 py-0.5 rounded"
                    >
                      {perm}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Create Role Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Dynamic Club Role"
        description="Add a new custom position to the club's organizational hierarchy."
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleCreateRole}>
              Save Role
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreateRole} className="space-y-4 text-xs">
          <Input
            label="Role Title"
            placeholder="e.g. Public Relations Lead"
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
            required
          />

          <div className="space-y-2">
            <label className="block font-medium text-surface-300">Role Capabilities</label>
            <div className="space-y-2 p-3 rounded-xl bg-surface-900 border border-surface-800">
              <label className="flex items-center gap-2 cursor-pointer text-surface-300">
                <input
                  type="checkbox"
                  checked={permissions.can_create_events}
                  onChange={(e) => setPermissions({ ...permissions, can_create_events: e.target.checked })}
                  className="rounded bg-surface-950 border-surface-700 text-brand-600 focus:ring-brand-500"
                />
                <span>Can create and edit draft event proposals</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-surface-300">
                <input
                  type="checkbox"
                  checked={permissions.can_mark_attendance}
                  onChange={(e) => setPermissions({ ...permissions, can_mark_attendance: e.target.checked })}
                  className="rounded bg-surface-950 border-surface-700 text-brand-600 focus:ring-brand-500"
                />
                <span>Can mark QR and manual attendee check-in</span>
              </label>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ClubRolesPage;
