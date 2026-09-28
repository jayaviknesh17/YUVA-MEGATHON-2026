import React from 'react';

export const Table = ({ children, className = '' }) => {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-surface-800">
      <table className={`w-full text-left text-sm text-surface-200 ${className}`}>{children}</table>
    </div>
  );
};

export const TableHeader = ({ children, className = '' }) => {
  return <thead className={`bg-surface-900/80 text-xs uppercase tracking-wider text-surface-400 border-b border-surface-800 ${className}`}>{children}</thead>;
};

export const TableBody = ({ children, className = '' }) => {
  return <tbody className={`divide-y divide-surface-800/60 ${className}`}>{children}</tbody>;
};

export const TableRow = ({ children, className = '', onClick }) => {
  return (
    <tr
      onClick={onClick}
      className={`transition-colors hover:bg-surface-900/40 ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {children}
    </tr>
  );
};

export const TableHead = ({ children, className = '' }) => {
  return <th className={`px-4 py-3.5 font-medium ${className}`}>{children}</th>;
};

export const TableCell = ({ children, className = '' }) => {
  return <td className={`px-4 py-3.5 whitespace-nowrap ${className}`}>{children}</td>;
};

export default Table;
