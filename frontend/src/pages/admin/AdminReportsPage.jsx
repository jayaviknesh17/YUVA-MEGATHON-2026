import React from 'react';
import PageHeader from '../../components/common/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useNotification } from '../../hooks/useNotification';
import { FileSpreadsheet, Download, BarChart3, Users, CalendarDays, Award } from 'lucide-react';

export const AdminReportsPage = () => {
  const { success } = useNotification();

  const reportTypes = [
    {
      id: 1,
      title: 'College-wide Event Attendance Summary',
      description: 'Comprehensive roster of students who attended verified events, with check-in timestamps and RA numbers.',
      format: 'CSV / Excel',
      icon: CalendarDays,
    },
    {
      id: 2,
      title: 'On-Duty (OD) Exemptions & Timetable Impact',
      description: 'Complete audit log of mentor-approved OD clearances and snapshotted academic periods.',
      format: 'CSV / PDF',
      icon: Users,
    },
    {
      id: 3,
      title: 'Certificate Issuance & Verification Hashes',
      description: 'Directory of all issued tamper-proof certificate identifiers and recipient mapping.',
      format: 'CSV / JSON',
      icon: Award,
    },
    {
      id: 4,
      title: 'Campus Club Engagement & Health Index',
      description: 'Aggregated membership sizes, event frequency, and participation metrics per club category.',
      format: 'PDF Summary',
      icon: BarChart3,
    },
  ];

  const handleExport = (report) => {
    success(`Generated ${report.title} report export.`, 'Report Download Ready');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics & Institutional Reports"
        subtitle="Export high-fidelity reports for academic review, accreditation, and attendance reconciliation."
        breadcrumbs={['YUVA', 'Admin', 'Reports']}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reportTypes.map((rep) => {
          const Icon = rep.icon;
          return (
            <Card key={rep.id} className="border-surface-800 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-xl bg-brand-500/10 text-brand-400 border border-brand-500/20">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono text-surface-400 bg-surface-900 px-2 py-0.5 rounded border border-surface-800">
                    {rep.format}
                  </span>
                </div>

                <h3 className="text-base font-bold text-surface-50">{rep.title}</h3>
                <p className="text-xs text-surface-400 leading-relaxed">{rep.description}</p>
              </div>

              <div className="mt-5 pt-4 border-t border-surface-800 flex items-center justify-end">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleExport(rep)}
                  iconLeft={Download}
                >
                  Export Data
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default AdminReportsPage;
