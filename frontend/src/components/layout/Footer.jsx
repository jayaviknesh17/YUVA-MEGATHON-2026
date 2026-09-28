import React from 'react';

export const Footer = () => {
  return (
    <footer className="mt-auto py-6 px-6 border-t border-surface-800/60 text-center text-xs text-surface-500">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl mx-auto">
        <p>© 2026 YUVA Megathon. Campus Club Management Platform.</p>
        <div className="flex items-center gap-4 text-[11px]">
          <span className="text-surface-400">FastAPI + React Architecture</span>
          <span className="text-surface-600">•</span>
          <span className="text-emerald-400">SQLite Foreign Keys Enforced</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
