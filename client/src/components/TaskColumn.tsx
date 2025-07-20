// TaskColumn.tsx
import React from 'react';
import { Task } from './types';
import TaskCard from './TaskCard';
import { Droppable } from '@hello-pangea/dnd';
import { useAuth } from '../context/AuthContext';

interface Props {
  droppableId: Task['status'];
  title: string;
  color: string;
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
  onDoubleClick?: (task: Task) => void;
  onFilterByStatus: (status: Task['status'], currentFilter: Task['status'] | 'all') => void;
  currentFilter: Task['status'] | 'all';
}

const TaskColumn: React.FC<Props> = ({
  droppableId,
  title,
  color,
  tasks,
  onEdit,
  onDelete,
  onDoubleClick,
  onFilterByStatus,
  currentFilter,
}) => {
  const { hasRole } = useAuth();
  
  const colorClasses: Record<string, string> = {
    yellow: 'bg-yellow-500 text-yellow-50',
    blue: 'bg-blue-600 text-blue-50',
    purple: 'bg-purple-600 text-purple-50',
    green: 'bg-green-500 text-green-50',
  };

  const columnBorderClasses: Record<string, string> = {
    yellow: 'border-yellow-200',
    blue: 'border-blue-200',
    purple: 'border-purple-200',
    green: 'border-green-200',
  };

  const isFiltered = currentFilter === droppableId;
  const canEdit = hasRole('Admin') || hasRole('Project Manager') || hasRole('Developer');

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onFilterByStatus(droppableId, currentFilter);
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border-2 ${columnBorderClasses[color]} transition-all duration-200 h-full flex flex-col`}>
      {/* Column Header */}
      <div 
        className={`${colorClasses[color]} px-4 py-3 rounded-t-lg cursor-pointer transition-all duration-200 hover:opacity-90`}
        onClick={() => onFilterByStatus(droppableId, currentFilter)}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-label={isFiltered ? `Remove ${title} filter` : `Filter by ${title} status`}
      >
        <div className="flex items-center justify-between">
          <h3 className={`font-semibold text-lg ${isFiltered ? 'underline' : ''}`}>
            {title}
          </h3>
          <div className="flex items-center gap-2">
            <span className="bg-white bg-opacity-20 text-xs px-2 py-1 rounded-full font-medium">
              {tasks.length}
            </span>
            {isFiltered && (
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            )}
          </div>
        </div>
      </div>

      {/* Tasks Container */}
      <Droppable droppableId={droppableId} type="TASK">
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={`flex-1 p-4 space-y-3 min-h-[200px] transition-colors duration-200 ${
              snapshot.isDraggingOver 
                ? `bg-${color}-50 border-${color}-200` 
                : 'bg-gray-50'
            }`}
          >
            {tasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="text-4xl mb-3">📝</div>
                <p className="text-gray-500 text-sm font-medium">No tasks</p>
                <p className="text-gray-400 text-xs mt-1">
                  {droppableId === 'todo' ? 'Create new tasks to get started' : `Drag tasks here to mark as ${title.toLowerCase()}`}
                </p>
              </div>
            ) : (
              tasks.map((task, index) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  index={index}
                  onEdit={canEdit ? onEdit : undefined}
                  onDelete={canEdit ? onDelete : undefined}
                  onDoubleClick={onDoubleClick}
                />
              ))
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      {/* Column Footer */}
      <div className="px-4 py-2 bg-gray-100 rounded-b-lg">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <span>{tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}</span>
          {isFiltered && (
            <span className="text-blue-600 font-medium">Filtered</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskColumn;