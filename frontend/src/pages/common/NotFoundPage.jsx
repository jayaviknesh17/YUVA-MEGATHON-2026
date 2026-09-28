import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Home, ArrowLeft } from 'lucide-react';

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
      <div className="text-6xl font-black text-brand-500 font-mono tracking-widest">404</div>
      <h2 className="text-2xl font-bold text-surface-50">Page Not Found</h2>
      <p className="text-xs text-surface-400 max-w-sm leading-relaxed">
        The requested campus module or endpoint does not exist or has been moved to a different path.
      </p>
      <div className="flex items-center gap-3 pt-2">
        <Button variant="outline" size="sm" onClick={() => navigate(-1)} iconLeft={ArrowLeft}>
          Go Back
        </Button>
        <Link to="/">
          <Button variant="primary" size="sm" iconLeft={Home}>
            Return Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
