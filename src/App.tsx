import React from 'react';
import { motion } from 'motion/react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { RecommendationPanel } from './components/RecommendationPanel';
import { NewsPanel } from './components/NewsPanel';
import { EditModal } from './components/EditModal';
import { Series } from './types';
import { Plus } from 'lucide-react';

const INITIAL_LIBRARY: Series[] = [
  { id: '1', title: 'Solo Leveling', chapters: 179, status: 'completed' },
  { id: '2', title: 'Omniscient Reader\'s Viewpoint', chapters: 210, status: 'reading' },
  { id: '3', title: 'The Beginning After The End', chapters: 175, status: 'stacking' },
  { id: '4', title: 'Tower of God', chapters: 600, status: 'reading' },
  { id: '5', title: 'The S-Classes That I Raised', chapters: 0, status: 'plan_to_read' },
];

export default function App() {
  const [activeTab, setActiveTab] = React.useState('dashboard');
  const [isDark, setIsDark] = React.useState(false);
  const [library, setLibrary] = React.useState<Series[]>(INITIAL_LIBRARY);
  const [editingSeries, setEditingSeries] = React.useState<Series | null>(null);

  React.useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  const handleAddSeries = () => {
    const newSeries: Series = {
      id: Math.random().toString(36).substr(2, 9),
      title: 'New Series',
      chapters: 0,
      status: 'plan_to_read',
    };
    setLibrary([...library, newSeries]);
    setEditingSeries(newSeries);
  };

  const handleAddToLibrary = (title: string) => {
    const newSeries: Series = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      chapters: 0,
      status: 'plan_to_read',
    };
    setLibrary([...library, newSeries]);
    setActiveTab('dashboard');
  };

  const handleSaveSeries = (updated: Series) => {
    setLibrary(library.map(s => s.id === updated.id ? updated : s));
    setEditingSeries(null);
  };

  const handleDeleteSeries = (id: string) => {
    setLibrary(library.filter(s => s.id !== id));
    setEditingSeries(null);
  };

  return (
    <div className="flex min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isDark={isDark} 
        toggleTheme={toggleTheme} 
      />
      
      <main className="flex-1 lg:pt-0 pt-16 lg:pl-20">
        <div className="max-w-7xl mx-auto">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <header className="p-6 flex justify-between items-center">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">Library</h1>
                  <p className="text-[var(--text-secondary)]">Organize your reading journey.</p>
                </div>
                <motion.button 
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAddSeries}
                  className="p-3 bg-[var(--accent)] text-black rounded-2xl active:opacity-80 transition-opacity flex items-center gap-2 font-bold"
                >
                  <Plus size={20} />
                  <span className="hidden sm:inline">Add Series</span>
                </motion.button>
              </header>
              <Dashboard 
                library={library} 
                setLibrary={setLibrary} 
                onEdit={setEditingSeries} 
              />
            </div>
          )}

          {activeTab === 'recommendations' && (
            <RecommendationPanel onAdd={handleAddToLibrary} />
          )}
          {activeTab === 'news' && <NewsPanel />}
        </div>
      </main>

      <EditModal 
        series={editingSeries} 
        onClose={() => setEditingSeries(null)} 
        onSave={handleSaveSeries}
        onDelete={handleDeleteSeries}
      />
    </div>
  );
}
