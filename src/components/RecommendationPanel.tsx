import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Loader2, Plus } from 'lucide-react';
import { getRecommendations } from '../services/geminiService';
import { Recommendation } from '../types';

interface RecommendationPanelProps {
  onAdd: (title: string) => void;
}

export const RecommendationPanel: React.FC<RecommendationPanelProps> = ({ onAdd }) => {
  const [input, setInput] = React.useState('');
  const [results, setResults] = React.useState<Recommendation[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [status, setStatus] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);

  const handleGetRecommendations = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError(null);
    setStatus('Analyzing your taste...');
    
    const timer = setTimeout(() => setStatus('Finding perfect matches...'), 2000);
    
    try {
      const recs = await getRecommendations(input);
      if (recs.length === 0) {
        setError('No recommendations found. Try different tropes!');
      }
      setResults(recs);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to connect to AI. Please check your internet or API key.');
    } finally {
      clearTimeout(timer);
      setLoading(false);
      setStatus('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">AI Recommendations</h2>
        <p className="text-[var(--text-secondary)]">Tell Koma. what you love, and get curated suggestions.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="e.g. Solo Leveling, regression, tower climbing, romance..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-4 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all"
        />
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleGetRecommendations}
          disabled={loading}
          className="px-8 py-4 bg-[var(--accent)] text-black font-bold rounded-2xl active:opacity-80 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50 w-full sm:w-auto sm:min-w-[160px]"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
          {loading ? 'Thinking...' : 'Get Picks'}
        </motion.button>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <Loader2 className="animate-spin text-[var(--accent)]" size={40} />
          <p className="text-[var(--text-secondary)] font-medium animate-pulse">{status}</p>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-2xl text-center font-medium">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {results.map((rec, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="p-6 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl hover:border-[var(--accent)] transition-all group"
          >
            <div className="flex justify-between items-start gap-4 mb-2">
              <h3 className="text-xl font-bold">{rec.title}</h3>
              <button 
                onClick={() => onAdd(rec.title)}
                className="p-2 bg-[var(--bg-secondary)] hover:bg-[var(--accent)] hover:text-black rounded-xl transition-all opacity-0 group-hover:opacity-100"
                title="Add to Plan to Read"
              >
                <Plus size={18} />
              </button>
            </div>
            <p className="text-[var(--text-secondary)] leading-relaxed">{rec.synopsis}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
