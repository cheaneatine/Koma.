import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  Sparkles, 
  Search, 
  Moon, 
  Sun, 
  ChevronLeft, 
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isDark: boolean;
  toggleTheme: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isDark, toggleTheme }) => {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'recommendations', label: 'Recommendations', icon: Sparkles },
    { id: 'news', label: 'News Search', icon: Search },
  ];

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-[calc(4rem+env(safe-area-inset-top))] pt-[env(safe-area-inset-top)] bg-[var(--bg-primary)] border-b border-[var(--border-color)] flex items-center justify-between px-4 z-40">
        <div className="text-2xl font-bold tracking-tighter">
          K<span className="text-[var(--accent)]">.</span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 hover:bg-[var(--bg-secondary)] rounded-lg transition-colors"
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/50 z-30"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="lg:hidden fixed inset-y-0 left-0 w-72 max-w-[80vw] bg-[var(--bg-primary)] z-40 pt-6 px-6 shadow-2xl"
            >
              <div className="mb-8 flex items-center justify-between">
                <div className="text-2xl font-bold tracking-tighter">
                  Koma<span className="text-[var(--accent)]">.</span>
                </div>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 hover:bg-[var(--bg-secondary)] rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <nav className="space-y-4">
                {navItems.map((item) => (
                  <motion.button
                    key={item.id}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center gap-4 p-4 rounded-2xl transition-all",
                      activeTab === item.id 
                        ? "bg-[var(--accent)] text-black" 
                        : "active:bg-[var(--bg-secondary)] text-[var(--text-secondary)]"
                    )}
                  >
                    <item.icon size={24} />
                    <span className="font-medium text-lg">{item.label}</span>
                  </motion.button>
                ))}
              </nav>
              <div className="absolute bottom-10 left-6 right-6">
                <button
                  onClick={toggleTheme}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-[var(--bg-secondary)] transition-all"
                >
                  {isDark ? <Sun size={24} /> : <Moon size={24} />}
                  <span className="font-medium text-lg">{isDark ? 'Light Mode' : 'Dark Mode'}</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop/Tablet Sidebar (Rail + Overlay) */}
      <div className="hidden lg:block">
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCollapsed(true)}
              className="fixed inset-0 bg-black/20 z-30"
            />
          )}
        </AnimatePresence>

        <motion.aside
          initial={false}
          animate={{ width: isCollapsed ? 80 : 280 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed inset-y-0 left-0 flex flex-col bg-[var(--bg-primary)] border-r border-[var(--border-color)] overflow-hidden z-40 shadow-xl"
        >
          <div className="p-6 flex items-center justify-between">
            {!isCollapsed && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="text-2xl font-bold tracking-tighter"
              >
                Koma<span className="text-[var(--accent)]">.</span>
              </motion.div>
            )}
            {isCollapsed && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-2xl font-bold tracking-tighter mx-auto"
              >
                K<span className="text-[var(--accent)]">.</span>
              </motion.div>
            )}
            <button 
              onClick={() => setIsCollapsed(!isCollapsed)}
              className={cn(
                "p-2 hover:bg-[var(--bg-secondary)] rounded-lg transition-colors",
                !isCollapsed && "absolute right-4"
              )}
            >
              {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
          </div>

          <nav className="flex-1 px-4 mt-8 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (!isCollapsed) setIsCollapsed(true);
                }}
                className={cn(
                  "w-full flex items-center gap-4 p-3 rounded-xl transition-all relative group",
                  activeTab === item.id 
                    ? "bg-[var(--accent)] text-black" 
                    : "hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)]",
                  isCollapsed && "justify-center px-0"
                )}
              >
                <item.icon size={22} className="shrink-0" />
                {!isCollapsed && (
                  <motion.span 
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="font-medium whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
                {isCollapsed && (
                  <div className="absolute left-full ml-4 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                    {item.label}
                  </div>
                )}
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-[var(--border-color)]">
            <button
              onClick={toggleTheme}
              className={cn(
                "w-full flex items-center gap-4 p-3 rounded-xl hover:bg-[var(--bg-secondary)] transition-all group relative",
                isCollapsed && "justify-center px-0"
              )}
            >
              {isDark ? <Sun size={22} /> : <Moon size={22} />}
              {!isCollapsed && (
                <motion.span 
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="font-medium"
                >
                  {isDark ? 'Light Mode' : 'Dark Mode'}
                </motion.span>
              )}
              {isCollapsed && (
                <div className="absolute left-full ml-4 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                  {isDark ? 'Light Mode' : 'Dark Mode'}
                </div>
              )}
            </button>
          </div>
        </motion.aside>
      </div>
    </>
  );
};
