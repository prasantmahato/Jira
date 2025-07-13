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
}

const TaskColumn: React.FC<Props> = ({
  droppableId,
  title,
  color,
  tasks,
  onEdit,
  onDelete,
  onDoubleClick,
}) => {
  const colorClasses: Record<string, string> = {
    yellow: 'bg-yellow-500',
    blue: 'bg-indigo-600',
    purple: 'bg-purple-600',
    green: 'bg-green-500',
  };

  return (
    <div
      className="flex-1 min-w-[250px] bg-white rounded-lg p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200"
      role="region"
      aria-label={`${title} column`}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-3 h-3 rounded-full ${colorClasses[color]}`} aria-hidden="true" />
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
      </div>

      <Droppable droppableId={droppableId}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`space-y-3 min-h-[100px] transition-all duration-200 ${
              snapshot.isDraggingOver ? 'bg-indigo-50 border-indigo-300' : 'bg-white'
            } rounded-md p-2`}
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