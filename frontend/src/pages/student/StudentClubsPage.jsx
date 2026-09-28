import React, { useState } from 'react';
import PageHeader from '../../components/common/PageHeader';
import StatusBadge from '../../components/common/StatusBadge';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useNotification } from '../../hooks/useNotification';
import { Building2, Users, Search, Award, CheckCircle2 } from 'lucide-react';

export const StudentClubsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { success } = useNotification();

  const [clubs, setClubs] = useState([
    {
      id: 1,
      name: 'CodeCraft Club',
      code: 'CCC-01',
      category: 'TECHNICAL',
      description: 'The flagship competitive programming and full-stack software development community.',
      leadName: 'Kavya S.',
      coordinatorName: 'Dr. Meera Krishnan',
      memberCount: 142,
      isJoined: true,
      dynamicRole: 'Member',
    },
    {
      id: 2,
      name: 'AI & Robotics Club',
      code: 'AIR-02',
      category: 'INNOVATION',
      description: 'Building autonomous robotics, computer vision pipelines, and deep neural agents.',
      leadName: 'Rohan V.',
      coordinatorName: 'Dr. S. Raman',
      memberCount: 98,
      isJoined: false,
      dynamicRole: null,
    },
    {
      id: 3,
      name: 'Cloud & DevOps Club',
      code: 'CDC-03',
      category: 'INFRASTRUCTURE',
      description: 'Hands-on serverless computing, Kubernetes clusters, and cloud platform architecture.',
      leadName: 'Ananya G.',
      coordinatorName: 'Prof. K. Venkatesh',
      memberCount: 76,
      isJoined: false,
      dynamicRole: null,
    },
  ]);

  const handleJoin = (clubId) => {
    setClubs((prev) =>
      prev.map((c) => (c.id === clubId ? { ...c, isJoined: true, memberCount: c.memberCount + 1 } : c))
    );
    success('Membership request sent to Club Admin.', 'Club Joined');
  };

  const filteredClubs = clubs.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Campus Clubs Directory"
        subtitle="Discover student-led clubs, apply for memberships, and earn leadership dynamic roles."
        breadcrumbs={['YUVA', 'Student', 'Clubs']}
      />

      <div className="w-full sm:w-80">
        <Input
          placeholder="Search clubs by name or category..."
          icon={Search}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClubs.map((club) => (
          <Card key={club.id} className="flex flex-col justify-between border-surface-800">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-brand-400 bg-brand-500/10 px-2.5 py-0.5 rounded-full border border-brand-500/20">
                  {club.category}
                </span>
                <span className="text-[10px] text-surface-500 font-mono">{club.code}</span>
              </div>

              <h3 className="text-base font-bold text-surface-50">{club.name}</h3>
              <p className="text-xs text-surface-400 leading-relaxed">{club.description}</p>

              <div className="p-3 rounded-xl bg-surface-900 border border-surface-800 space-y-1.5 text-xs text-surface-300">
                <div className="flex justify-between">
                  <span className="text-surface-500">Club Lead:</span>
                  <span className="font-medium text-surface-200">{club.leadName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-surface-500">Faculty Coord:</span>
                  <span className="font-medium text-surface-200">{club.coordinatorName}</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-surface-800 flex items-center justify-between">
              <div className="text-xs text-surface-400 flex items-center gap-1.5">
                <Users className="w-4 h-4" />
                <span>{club.memberCount} Members</span>
              </div>

              {club.isJoined ? (
                <span className="inline-flex items-center gap-1 text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Joined
                </span>
              ) : (
                <Button variant="primary" size="sm" onClick={() => handleJoin(club.id)}>
                  Join Club
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default StudentClubsPage;
