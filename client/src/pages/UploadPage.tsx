import { Link } from 'react-router-dom';
import { Plane, Upload } from 'lucide-react';

export const UploadPage = () => (
  <div className="page-container text-center py-20">
    <div className="w-16 h-16 rounded-2xl bg-primary-600/10 flex items-center justify-center mx-auto mb-4">
      <Upload className="w-8 h-8 text-primary-400" />
    </div>
    <h1 className="text-3xl font-display font-bold text-white mb-3">Upload Travel Document</h1>
    <p className="text-slate-400 mb-6">Coming in Phase 3 — drag-and-drop file upload with AI extraction.</p>
    <Link to="/dashboard" className="btn-secondary">← Back to Dashboard</Link>
  </div>
);
