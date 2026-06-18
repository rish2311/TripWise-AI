import { Link } from 'react-router-dom';
import { Plane, Sparkles, Shield, Share2, FileText, ArrowRight, Star } from 'lucide-react';

const features = [
  {
    icon: FileText,
    title: 'Upload Any Travel Doc',
    description: 'Flight tickets, hotel bookings, visas, train tickets — any format, any airline.',
  },
  {
    icon: Sparkles,
    title: 'AI-Powered Extraction',
    description: 'Gemini 2.5 Flash reads your document and extracts all travel details instantly.',
  },
  {
    icon: Plane,
    title: 'Day-by-Day Itinerary',
    description: 'Get a rich, personalised travel plan with attractions, food spots, and tips.',
  },
  {
    icon: Share2,
    title: 'Share with Anyone',
    description: 'Generate a public link to share your itinerary — no account needed to view.',
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Your documents are stored securely on AWS S3. Only you can see your trips.',
  },
  {
    icon: Star,
    title: 'Edit & Customise',
    description: 'Not happy with the plan? Edit your itinerary directly in the app.',
  },
];

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-surface-900 overflow-hidden">
      {/* ── Nav ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-surface-900/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center">
              <Plane className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-lg text-white">
              TripWise <span className="text-gradient">AI</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="btn-secondary px-4 py-2 text-sm">Sign in</Link>
            <Link to="/register" className="btn-primary px-4 py-2 text-sm">Get started</Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative pt-32 pb-24 px-6">
        {/* Background glows */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-primary-600/10 blur-3xl" />
          <div className="absolute top-40 right-20 w-80 h-80 rounded-full bg-purple-600/15 blur-3xl" />
          <div className="absolute top-60 left-20 w-60 h-60 rounded-full bg-accent-500/10 blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-sm font-medium mb-6 animate-fade-in">
            <Sparkles className="w-3.5 h-3.5" />
            Powered by Gemini 2.5 Flash
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold text-white leading-tight animate-slide-up">
            Your Personal{' '}
            <span className="text-gradient">AI Travel</span>
            <br />Planner
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed animate-slide-up">
            Upload your travel documents. Our AI extracts all details and generates a rich,
            day-by-day itinerary tailored just for you — in seconds.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up">
            <Link to="/register" className="btn-primary text-base px-8 py-4">
              Start planning for free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/login" className="btn-secondary text-base px-8 py-4">
              Sign in
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto">
            {[
              { value: '< 30s', label: 'Itinerary generated' },
              { value: '5+', label: 'Document types' },
              { value: '100%', label: 'AI-powered' },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="text-2xl font-display font-bold text-gradient">{value}</div>
                <div className="text-xs text-slate-500 mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold text-white">
              Everything you need for{' '}
              <span className="text-gradient">smarter travel</span>
            </h2>
            <p className="mt-4 text-slate-400 max-w-xl mx-auto">
              From document upload to shareable itinerary — all in one place.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="glass-card p-6 group hover:border-primary-500/30 transition-all duration-300 hover:shadow-glow-sm"
              >
                <div className="w-10 h-10 rounded-xl bg-primary-600/20 border border-primary-500/20 flex items-center justify-center mb-4 group-hover:bg-primary-600/30 transition-colors">
                  <Icon className="w-5 h-5 text-primary-400" />
                </div>
                <h3 className="font-display font-semibold text-white mb-2">{title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center glass-card p-12">
          <h2 className="text-4xl font-display font-bold text-white mb-4">
            Ready to plan your next adventure?
          </h2>
          <p className="text-slate-400 mb-8">
            Join thousands of travellers using TripWise AI to plan smarter trips.
          </p>
          <Link to="/register" className="btn-primary text-base px-10 py-4">
            Get started — it's free
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/5 py-8 text-center text-slate-600 text-sm">
        © 2024 TripWise AI · Your Personal AI Travel Planner
      </footer>
    </div>
  );
};
