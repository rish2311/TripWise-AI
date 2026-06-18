import { useParams } from 'react-router-dom';
import { Plane } from 'lucide-react';

export const SharedTripPage = () => {
  const { shareId } = useParams();
  return (
    <div className="min-h-screen bg-surface-900 flex items-center justify-center p-6 text-center">
      <div>
        <div className="w-16 h-16 rounded-2xl bg-primary-600/10 flex items-center justify-center mx-auto mb-4">
          <Plane className="w-8 h-8 text-primary-400" />
        </div>
        <h1 className="text-3xl font-display font-bold text-white mb-3">Shared Trip</h1>
        <p className="text-slate-400 mb-2">Share ID: <code className="text-primary-400">{shareId}</code></p>
        <p className="text-slate-400">Coming in Phase 7 — public shareable itinerary view.</p>
      </div>
    </div>
  );
};
