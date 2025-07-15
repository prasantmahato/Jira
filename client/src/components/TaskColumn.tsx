import React from 'react';
import { Task } from './types';
import TaskCard from './TaskCard';
import { Droppable } from '@hello-pangea/dnd';

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
  const colorClasses: Record<string, string> = {
    yellow: 'bg-yellow-500',
    blue: 'bg-blue-600',
    purple: 'bg-purple-600',
    green: 'bg-green-500',
  };

  const isFiltered = currentFilter === droppableId;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onFilterByStatus(droppableId, currentFilter);
    }
  };

  return (
    <div
      className="flex-1 min-w-[250px] bg-white rounded-md p-1 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200"
      role="region"
      aria-label={`${title} column`}
    >
      <div className="flex items-center gap-3 mb-4 pl-3">
        <div className={`w-3 h-3 rounded-full ${colorClasses[color]}`} aria-hidden="true" />
        <button
          onClick={() => onFilterByStatus(droppableId, currentFilter)}
          onKeyDown={handleKeyDown}
          className={`text-xl font-bold transition-colors duration-200 rounded focus:outline-none ${
            isFiltered ? 'text-blue-600 hover:text-blue-700 text-decoration-line: underline': 'text-gray-900 hover:text-blue-600'
          }`}
          role="button"
          tabIndex={0}
          aria-label={isFiltered ? `Remove status filter` : `Filter by ${title} status`}
        >
          {title}
        </button>
      </div>

      <Droppable droppableId={droppableId}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`space-y-3 min-h-[100px] transition-all duration-200 ${
              snapshot.isDraggingOver ? 'bg-green-50 border-green-200' : 'bg-white'
            } rounded-md p-1`}
            tabIndex={0}
            aria-describedby={`column-title-${droppableId}`}
          >
            {tasks.length === 0 ? (
              <p className="text-sm text-gray-500 text-center">No tasks in this column.</p>
            ) : (
              tasks.map((task, index) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  index={index}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onDoubleClick={onDoubleClick}
                />
              ))
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default TaskColumn;