import React from 'react';
import { motion } from 'motion/react';
import { Search, Loader2, ExternalLink } from 'lucide-react';
import { searchNews } from '../services/geminiService';
import { NewsItem } from '../types';

export const NewsPanel: React.FC = () => {
  const [query, setQuery] = React.useState('');
  const [results, setResults] = React.useState<NewsItem[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [status, setStatus] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    setStatus('Connecting to the web...');
    
    const timer1 = setTimeout(() => setStatus('Searching for latest chapters...'), 1500);
    const timer2 = setTimeout(() => setStatus('Parsing release data...'), 4000);
    
    try {
      const news = await searchNews(query);
      if (news.length === 0) {
        setError('No recent updates found. The series might be on hiatus or the search failed.');
      }
      setResults(news);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Search failed. Please check your internet or API key.');
    } finally {
      clearTimeout(timer1);
      clearTimeout(timer2);
      setLoading(false);
      setStatus('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Release Radar</h2>
        <p className="text-[var(--text-secondary)]">Check for latest chapters and news across the web.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Enter series name..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 p-4 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all"
        />
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleSearch}
          disabled={loading}
          className="px-8 py-4 bg-[var(--accent)] text-black font-bold rounded-2xl active:opacity-80 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50 w-full sm:w-auto sm:min-w-[160px]"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} />}
          {loading ? 'Searching...' : 'Search'}
        </motion.button>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <Loader2 className="animate-spin text-[var(--accent)]" size={40} />
          <p className="text-[var(--text-secondary)] font-medium animate-pulse">{status}</p>
        </div>
      )}

      {error && (
        <div className="space-y-4">
          <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-2xl text-center font-medium">
            {error}
          </div>
          {error.includes("limit") && (
            <div className="flex justify-center">
              <a 
                href={`https://www.google.com/search?q=${encodeURIComponent(query + ' manga news latest chapter')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[var(--accent)] hover:underline font-medium"
              >
                Search on Google instead <ExternalLink size={16} />
              </a>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {results.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="p-6 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl shadow-sm hover:shadow-md border-[var(--border-color)] transition-all flex flex-col gap-3"
          >
            <div className="flex justify-between items-start gap-4">
              <h3 className="text-lg font-bold leading-tight">{item.title}</h3>
              {item.link && (
                <a 
                  href={item.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 hover:bg-[var(--bg-secondary)] rounded-lg text-[var(--text-secondary)] hover:text-[var(--accent)] transition-all"
                >
                  <ExternalLink size={18} />
                </a>
              )}
            </div>
            <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
              {item.snippet}
            </p>
          </motion.div>
        ))}
        {!loading && results.length === 0 && query && (
          <div className="text-center py-12 text-[var(--text-secondary)]">
            No recent updates found for "{query}".
          </div>
        )}
      </div>
    </div>
  );
};
