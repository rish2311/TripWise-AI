import { useParams, Link } from 'react-router-dom';
import { Plane } from 'lucide-react';

export const TripDetailPage = () => {
  const { id } = useParams();
  return (
    <div className="page-container text-center py-20">
      <div className="w-16 h-16 rounded-2xl bg-primary-600/10 flex items-center justify-center mx-auto mb-4">
        <Plane className="w-8 h-8 text-primary-400" />
      </div>
      <h1 className="text-3xl font-display font-bold text-white mb-3">Trip Detail</h1>
      <p className="text-slate-400 mb-2">Trip ID: <code className="text-primary-400">{id}</code></p>
      <p className="text-slate-400 mb-6">Coming in Phase 5 — full itinerary view with AI summary card.</p>
      <Link to="/trips" className="btn-secondary">← Back to My Trips</Link>
    </div>
  );
};
