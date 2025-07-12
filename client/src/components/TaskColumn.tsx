// TaskColumn.tsx
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
    yellow: 'text-yellow-600',
    blue: 'text-blue-600',
    green: 'text-green-600',
  };

  return (
    <div className="flex-1 bg-gray-50 rounded-xl p-4 border border-gray-200">
      <h2 className={`text-lg font-bold mb-4 ${colorClasses[color]}`}>{title}</h2>

      <Droppable droppableId={droppableId}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`space-y-4 min-h-[100px] transition-all ${
              snapshot.isDraggingOver ? 'bg-white/0' : ''
            }`}
          >
            {tasks.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                index={index}
                onEdit={onEdit}
                onDelete={onDelete}
                onDoubleClick={onDoubleClick}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default TaskColumn;
