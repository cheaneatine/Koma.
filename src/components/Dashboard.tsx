import React from 'react';
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragEndEvent,
  DragOverEvent,
  defaultDropAnimationSideEffects,
  DropAnimation
} from '@dnd-kit/core';
import { 
  arrayMove, 
  SortableContext, 
  sortableKeyboardCoordinates, 
  verticalListSortingStrategy 
} from '@dnd-kit/sortable';
import { Series, ListType } from '../types';
import { SortableItem } from './SortableItem';

interface DashboardProps {
  library: Series[];
  setLibrary: React.Dispatch<React.SetStateAction<Series[]>>;
  onEdit: (series: Series) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ library, setLibrary, onEdit }) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const lists: { id: ListType; label: string; color: string }[] = [
    { id: 'plan_to_read', label: 'Plan to Read', color: 'bg-indigo-500' },
    { id: 'reading', label: 'Currently Reading', color: 'bg-emerald-500' },
    { id: 'stacking', label: 'Stacking Chapters', color: 'bg-amber-500' },
    { id: 'completed', label: 'Completed', color: 'bg-slate-500' },
  ];

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeItem = library.find(item => item.id === activeId);
    if (!activeItem) return;

    // Find if we are dragging over a container or an item
    const isOverAContainer = lists.some(list => list.id === overId);
    
    if (isOverAContainer) {
      const overContainerId = overId as ListType;
      if (activeItem.status !== overContainerId) {
        setLibrary(prev => prev.map(item => 
          item.id === activeId ? { ...item, status: overContainerId } : item
        ));
      }
    } else {
      const overItem = library.find(item => item.id === overId);
      if (overItem && activeItem.status !== overItem.status) {
        setLibrary(prev => prev.map(item => 
          item.id === activeId ? { ...item, status: overItem.status } : item
        ));
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    if (active.id !== over.id) {
      const activeIndex = library.findIndex(item => item.id === active.id);
      const overIndex = library.findIndex(item => item.id === over.id);
      
      if (overIndex !== -1) {
        setLibrary((items) => arrayMove(items, activeIndex, overIndex));
      }
    }
  };

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DndContext 
          sensors={sensors} 
          collisionDetection={closestCenter}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
        {lists.map((list) => (
          <div key={list.id} className="flex flex-col gap-4 min-w-0 w-full">
            <div className="flex items-center justify-between px-2 h-10">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full shrink-0 ${list.color}`} />
                <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--text-primary)]">
                  {list.label}
                </h3>
              </div>
              <span className="text-xs font-bold bg-[var(--bg-secondary)] px-2 py-0.5 rounded-full border border-[var(--border-color)] shrink-0">
                {library.filter(s => s.status === list.id).length}
              </span>
            </div>
            
            <SortableContext 
              id={list.id}
              items={library.filter(s => s.status === list.id).map(s => s.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="flex flex-col gap-3 min-h-[300px] p-2 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
                {library
                  .filter(s => s.status === list.id)
                  .map((series) => (
                    <SortableItem key={series.id} series={series} onClick={onEdit} />
                  ))}
              </div>
            </SortableContext>
          </div>
        ))}
      </DndContext>
    </div>
  </div>
);
};
