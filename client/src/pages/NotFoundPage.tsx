import { Link } from 'react-router-dom';
import { Plane, Home } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-surface-900 flex items-center justify-center p-6">
      <div className="text-center animate-slide-up">
        <div className="text-8xl font-display font-bold text-gradient mb-4">404</div>
        <div className="w-16 h-16 rounded-2xl bg-primary-600/10 flex items-center justify-center mx-auto mb-6">
          <Plane className="w-8 h-8 text-primary-400 opacity-50" />
        </div>
        <h1 className="text-3xl font-display font-bold text-white mb-3">Page not found</h1>
        <p className="text-slate-400 mb-8 max-w-sm mx-auto">
          Looks like this page took off without us. Let's get you back on track.
        </p>
        <Link to="/" className="btn-primary">
          <Home className="w-4 h-4" />
          Go home
        </Link>
      </div>
    </div>
  );
};
