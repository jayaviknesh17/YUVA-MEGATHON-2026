import React, { useState } from 'react';
import PageHeader from '../../components/common/PageHeader';
import StatusBadge from '../../components/common/StatusBadge';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Tabs } from '../../components/ui/Tabs';
import { useNotification } from '../../hooks/useNotification';
import {
  Award,
  Download,
  QrCode,
  ShieldCheck,
  ExternalLink,
  Sparkles,
  Layers,
  CheckCircle2,
} from 'lucide-react';
import { formatDate } from '../../utils/formatters';

export const StudentCertificatesPage = () => {
  const [activeTab, setActiveTab] = useState('CERTIFICATES');
  const [selectedCert, setSelectedCert] = useState(null);
  const { success } = useNotification();

  // Mock student certificates with cryptographic / unique verifiable codes
  const certificates = [
    {
      id: 'CERT-2026-YUV-8821',
      eventName: 'State Level Coding Championship 2026',
      clubName: 'CodeCraft Club',
      issueDate: '2026-09-22',
      verificationCode: 'YUV-2026-CC-8821-A9F2',
      status: 'ISSUED',
      recipientName: 'Aarav Patel',
      raNumber: 'RA2311003010001',
    },
    {
      id: 'CERT-2026-AI-1049',
      eventName: 'Deep Learning & Neural Architectures Workshop',
      clubName: 'AI & Robotics Club',
      issueDate: '2026-08-14',
      verificationCode: 'YUV-2026-AI-1049-7B31',
      status: 'ISSUED',
      recipientName: 'Aarav Patel',
      raNumber: 'RA2311003010001',
    },
  ];

  // Mock student badges & credentials
  const badges = [
    {
      id: 1,
      name: 'Hackathon Warrior',
      category: 'EVENT_COUNT',
      description: 'Participated in 3+ college hackathons with confirmed attendance.',
      icon: '🏆',
      awardedAt: '2026-09-22',
      level: 'Silver',
    },
    {
      id: 2,
      name: 'AI Explorer',
      category: 'TECHNICAL',
      description: 'Completed 2 workshops in AI, Machine Learning, or Robotics.',
      icon: '🤖',
      awardedAt: '2026-08-14',
      level: 'Gold',
    },
    {
      id: 3,
      name: 'Punctual Attendant',
      category: 'ATTENDANCE_STREAK',
      description: 'Maintained 100% attendance across registered club events.',
      icon: '⚡',
      awardedAt: '2026-09-10',
      level: 'Bronze',
    },
  ];

  const handleDownload = (cert) => {
    success(`Certificate ${cert.id} downloaded successfully.`, 'Download Ready');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Certificates & Badges"
        subtitle="Verifiable credentials and milestone badges earned from completed campus events and verified attendance records."
        breadcrumbs={['YUVA', 'Student', 'Credentials']}
      />

      <Tabs
        tabs={[
          { id: 'CERTIFICATES', label: 'Verified Certificates', count: certificates.length, icon: Award },
          { id: 'BADGES', label: 'Earned Badges', count: badges.length, icon: Sparkles },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {activeTab === 'CERTIFICATES' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certificates.map((cert) => (
            <Card key={cert.id} className="border-surface-800 hover:border-brand-500/40 transition-all flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-brand-400 bg-brand-500/10 px-2.5 py-0.5 rounded-full border border-brand-500/20">
                    {cert.clubName}
                  </span>
                  <StatusBadge status={cert.status} />
                </div>

                <h3 className="text-base font-bold text-surface-50">{cert.eventName}</h3>
                <div className="p-3 rounded-xl bg-surface-900 border border-surface-800/80 space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-surface-400">Recipient:</span>
                    <span className="text-surface-200 font-medium">{cert.recipientName} ({cert.raNumber})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-surface-400">Issue Date:</span>
                    <span className="text-surface-200">{formatDate(cert.issueDate)}</span>
                  </div>
                  <div className="flex justify-between font-mono text-[11px] pt-1 border-t border-surface-800">
                    <span className="text-surface-400">Verifiable Hash:</span>
                    <span className="text-emerald-400">{cert.verificationCode}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-surface-800 flex items-center justify-between">
                <button
                  onClick={() => setSelectedCert(cert)}
                  className="text-xs text-brand-400 hover:text-brand-300 font-medium flex items-center gap-1"
                >
                  <QrCode className="w-4 h-4" />
                  <span>Verify Authenticity</span>
                </button>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleDownload(cert)}
                  iconLeft={Download}
                >
                  Download PDF
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'BADGES' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {badges.map((badge) => (
            <Card key={badge.id} className="text-center p-6 border-surface-800 space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-surface-900 border border-surface-700/80 flex items-center justify-center text-3xl mx-auto shadow-inner">
                {badge.icon}
              </div>
              <h4 className="text-base font-bold text-surface-100">{badge.name}</h4>
              <p className="text-xs text-surface-400 leading-relaxed">{badge.description}</p>
              <div className="pt-3 border-t border-surface-800 text-[11px] text-surface-500 font-mono">
                Awarded: {formatDate(badge.awardedAt)}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Certificate Verification Modal */}
      {selectedCert && (
        <Modal
          isOpen={!!selectedCert}
          onClose={() => setSelectedCert(null)}
          title="Certificate Verification"
          description="Cryptographic proof of attendance and event completion."
          footer={
            <Button variant="primary" size="sm" onClick={() => setSelectedCert(null)}>
              Close
            </Button>
          }
        >
          <div className="space-y-4 text-xs text-center py-2">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h4 className="text-sm font-bold text-surface-100">Valid & Tamper-Proof Certificate</h4>
            <div className="p-3.5 rounded-xl bg-surface-900 border border-surface-800 text-left space-y-2 font-mono text-[11px]">
              <div><span className="text-surface-500">Event:</span> {selectedCert.eventName}</div>
              <div><span className="text-surface-500">Student RA:</span> {selectedCert.raNumber}</div>
              <div><span className="text-surface-500">Verification Hash:</span> <span className="text-emerald-400">{selectedCert.verificationCode}</span></div>
              <div><span className="text-surface-500">Attendance Check:</span> <span className="text-emerald-400">VERIFIED (100% Present)</span></div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default StudentCertificatesPage;
