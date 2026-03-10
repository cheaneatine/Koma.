import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Series } from '../types';

interface SortableItemProps {
  series: Series;
  onClick: (series: Series) => void;
}

import { GripVertical } from 'lucide-react';

export const SortableItem: React.FC<SortableItemProps> = ({ series, onClick }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: series.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group p-3 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl cursor-pointer hover:border-[var(--accent)] transition-all flex items-center gap-2 min-w-0"
      onClick={() => onClick(series)}
    >
      <div 
        {...attributes} 
        {...listeners} 
        className="text-[var(--accent-dark)] opacity-40 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing shrink-0"
      >
        <GripVertical size={16} />
      </div>
      
      <div className="flex-1 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 min-w-0 overflow-hidden">
        <div className="min-w-0 overflow-hidden">
          <span 
            className="font-bold text-[var(--text-primary)] leading-tight line-clamp-2 text-base m-0 p-0 break-words"
            title={series.title}
          >
            {series.title}
          </span>
        </div>
        <div className="shrink-0 text-right ml-2">
          <span className="text-sm font-bold text-[var(--accent-dark)] whitespace-nowrap m-0 p-0">
            Ch. {series.chapters}
          </span>
        </div>
      </div>
    </div>
  );
};
