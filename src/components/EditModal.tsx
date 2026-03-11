import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { Series } from '../types';

interface EditModalProps {
  series: Series | null;
  onClose: () => void;
  onSave: (updated: Series) => void;
  onDelete: (id: string) => void;
}

export const EditModal: React.FC<EditModalProps> = ({ series, onClose, onSave, onDelete }) => {
  const [formData, setFormData] = React.useState<Series | null>(series);

  React.useEffect(() => {
    setFormData(series);
  }, [series]);

  if (!series || !formData) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="w-full max-w-md bg-[var(--modal-bg)] shadow-2xl rounded-2xl overflow-hidden flex flex-col"
          style={{ backgroundColor: 'var(--modal-bg)' }} // Ensure solid background
        >
          <div className="p-6 flex justify-between items-center border-b border-[var(--border-color)]">
            <h2 className="text-xl font-semibold">Edit Series</h2>
            <button onClick={onClose} className="p-2 hover:bg-[var(--bg-secondary)] rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider mb-1">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full p-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider mb-1">Chapters Read</label>
              <input
                type="number"
                value={formData.chapters}
                onChange={(e) => setFormData({ ...formData, chapters: parseInt(e.target.value) || 0 })}
                className="w-full p-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider mb-1">Category</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full p-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all appearance-none cursor-pointer"
              >
                <option value="reading">Currently Reading</option>
                <option value="plan_to_read">Plan to Read</option>
                <option value="stacking">Stacking</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider mb-1">Notes</label>
              <textarea
                value={formData.notes || ''}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                className="w-full p-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all resize-none"
              />
            </div>
          </div>

          <div className="p-6 bg-[var(--bg-secondary)] flex gap-3">
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => onSave(formData)}
              className="flex-1 py-3 bg-[var(--accent)] text-black font-medium rounded-xl active:opacity-80 transition-opacity"
            >
              Save Changes
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => onDelete(series.id)}
              className="px-4 py-3 text-red-500 font-medium active:bg-red-50 dark:active:bg-red-900/20 rounded-xl transition-colors"
            >
              Delete
            </motion.button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
