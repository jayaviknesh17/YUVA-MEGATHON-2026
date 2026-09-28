/**
 * Formatters for Date, Status Badges, RA Numbers, and Strings
 */

export const formatDate = (dateString, options = {}) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      ...options,
    });
  } catch {
    return dateString;
  }
};

export const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateString;
  }
};

export const formatTime = (timeString) => {
  if (!timeString) return 'N/A';
  return timeString;
};

export const getStatusColorClass = (status) => {
  const normalized = String(status || '').toUpperCase();
  
  switch (normalized) {
    case 'APPROVED':
    case 'ACTIVE':
    case 'COMPLETED':
    case 'PRESENT':
    case 'CONFIRMED':
    case 'ISSUED':
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';

    case 'PENDING_FACULTY_APPROVAL':
    case 'PENDING_MENTOR_APPROVAL':
    case 'PENDING':
    case 'ONGOING':
      return 'bg-amber-500/10 text-amber-400 border-amber-500/30';

    case 'DRAFT':
      return 'bg-slate-500/10 text-slate-300 border-slate-500/30';

    case 'REJECTED':
    case 'CANCELLED':
    case 'ABSENT':
    case 'REVOKED':
    case 'INACTIVE':
      return 'bg-rose-500/10 text-rose-400 border-rose-500/30';

    default:
      return 'bg-brand-500/10 text-brand-400 border-brand-500/30';
  }
};

export const getStatusLabel = (status) => {
  if (!status) return 'Unknown';
  return status
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
};
