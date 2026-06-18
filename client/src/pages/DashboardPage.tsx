import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Plane, Plus, Map, ArrowRight, Sparkles, TrendingUp } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { itinerariesApi } from '@/api/itineraries';
import { formatDistanceToNow } from '@/utils/date';

export const DashboardPage = () => {
  const { user } = useAuthStore();

  const { data, isLoading } = useQuery({
    queryKey: ['itineraries'],
    queryFn: () => itinerariesApi.list(),
  });

  const itineraries = data?.data?.data?.itineraries ?? [];
  const recentTrips = itineraries.slice(0, 3);

  return (
    <div className="page-container">
      {/* ── Welcome header ── */}
      <div className="mb-10 animate-slide-up">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-xs font-medium mb-3">
          <Sparkles className="w-3 h-3" />
          AI-Powered Travel Planning
        </div>
        <h1 className="text-4xl font-display font-bold text-white">
          Welcome back, <span className="text-gradient">{user?.name?.split(' ')[0]}</span> 👋
        </h1>
        <p className="text-slate-400 mt-2">Ready to plan your next adventure?</p>
      </div>

      {/* ── Quick actions ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        <Link
          to="/upload"
          className="glass-card p-6 group hover:border-primary-500/30 hover:shadow-glow-sm transition-all duration-300 flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-primary-600/20 border border-primary-500/20 flex items-center justify-center group-hover:bg-primary-600/30 transition-colors flex-shrink-0">
            <Plus className="w-6 h-6 text-primary-400" />
          </div>
          <div>
            <div className="font-semibold text-white">New Trip</div>
            <div className="text-xs text-slate-400 mt-0.5">Upload a travel document</div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-primary-400 ml-auto transition-colors" />
        </Link>

        <Link
          to="/trips"
          className="glass-card p-6 group hover:border-purple-500/30 hover:shadow-glow-sm transition-all duration-300 flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-purple-600/20 border border-purple-500/20 flex items-center justify-center group-hover:bg-purple-600/30 transition-colors flex-shrink-0">
            <Map className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <div className="font-semibold text-white">My Trips</div>
            <div className="text-xs text-slate-400 mt-0.5">{itineraries.length} trip{itineraries.length !== 1 ? 's' : ''} saved</div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-purple-400 ml-auto transition-colors" />
        </Link>

        <div className="glass-card p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-accent-500/20 border border-accent-500/20 flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-6 h-6 text-accent-400" />
          </div>
          <div>
            <div className="font-semibold text-white">Total Trips</div>
            <div className="text-2xl font-display font-bold text-gradient mt-0.5">{itineraries.length}</div>
          </div>
        </div>
      </div>

      {/* ── Recent trips ── */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="section-title">Recent Trips</h2>
          {itineraries.length > 0 && (
            <Link to="/trips" className="text-sm text-primary-400 hover:text-primary-300 flex items-center gap-1 transition-colors">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-card p-6 h-36 skeleton" />
            ))}
          </div>
        ) : recentTrips.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentTrips.map((trip) => (
              <Link
                key={trip._id}
                to={`/trips/${trip._id}`}
                className="glass-card p-5 group hover:border-primary-500/20 transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-9 h-9 rounded-lg bg-primary-600/20 flex items-center justify-center">
                    <Plane className="w-4 h-4 text-primary-400" />
                  </div>
                  {trip.isShared && (
                    <span className="badge-primary text-xs">Shared</span>
                  )}
                </div>
                <h3 className="font-semibold text-white text-sm leading-tight line-clamp-2">{trip.title}</h3>
                {trip.destination && (
                  <p className="text-xs text-primary-400 mt-1">{trip.destination}</p>
                )}
                <p className="text-xs text-slate-500 mt-2">{formatDistanceToNow(trip.createdAt)}</p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="glass-card p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary-600/10 flex items-center justify-center mx-auto mb-4">
              <Plane className="w-8 h-8 text-primary-400 opacity-50" />
            </div>
            <h3 className="font-display font-semibold text-white mb-2">No trips yet</h3>
            <p className="text-slate-400 text-sm mb-6">Upload a travel document to generate your first AI itinerary.</p>
            <Link to="/upload" className="btn-primary">
              <Plus className="w-4 h-4" />
              Plan your first trip
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
