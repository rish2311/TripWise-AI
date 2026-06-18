import { Link } from 'react-router-dom';
import { Map } from 'lucide-react';

export const MyTripsPage = () => (
  <div className="page-container text-center py-20">
    <div className="w-16 h-16 rounded-2xl bg-purple-600/10 flex items-center justify-center mx-auto mb-4">
      <Map className="w-8 h-8 text-purple-400" />
    </div>
    <h1 className="text-3xl font-display font-bold text-white mb-3">My Trips</h1>
    <p className="text-slate-400 mb-6">Coming in Phase 6 — full trip management dashboard.</p>
    <Link to="/dashboard" className="btn-secondary">← Back to Dashboard</Link>
  </div>
);
