import React, { useState } from 'react';
import { Task } from './types';
import { FiEdit, FiTrash2, FiMoreHorizontal } from 'react-icons/fi';
import dayjs from 'dayjs';
import { Draggable } from '@hello-pangea/dnd';

interface Props {
  task: Task;
  index: number;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
  onDoubleClick?: (task: Task) => void;
}

const TaskCard: React.FC<Props> = ({ task, index, onEdit, onDelete, onDoubleClick }) => {
  const [showMenu, setShowMenu] = useState(false);

  const taskTypeBorders: Record<NonNullable<Task['taskType']>, string> = {
    Bug: 'border-b-3 border-red-500',
    Spike: 'border-b-3 border-orange-500',
    Ticket: 'border-b-3 border-green-500',
  };

  const borderClass = task.taskType ? taskTypeBorders[task.taskType] : '';

  return (
    <Draggable draggableId={task.id.toString()} index={index}>
      {(provided) => (
        <div
          className={`w-full mb-3 rounded-md shadow-sm hover:shadow-md transition-shadow duration-200 ${borderClass}`}
        >
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className="relative w-full bg-white border border-gray-100 rounded-t-md px-4 py-3"
            onDoubleClick={() => onDoubleClick?.(task)}
          >
            {/* Title + Menu */}
            <div className="flex justify-between items-start">
              <div>
                <p className="text-base font-semibold text-gray-900">{task.title}</p>
                {task.taskType && (
                  <p className="text-xs text-gray-500 mt-1">{task.taskType}</p>
                )}
              </div>

              {/* Ellipsis Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="text-gray-400 hover:text-gray-600"
                  aria-label="Task options"
                >
                  <FiMoreHorizontal size={18} />
                </button>
                {showMenu && (
                  <div
                    className="absolute right-0 mt-2 w-28 bg-white border border-gray-200 rounded-md shadow z-10"
                    onMouseLeave={() => setShowMenu(false)}
                  >
                    <button
                      onClick={() => onEdit(task)}
                      className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 w-full text-left"
                      aria-label={`Edit task ${task.title}`}
                    >
                      <FiEdit size={14} /> Edit
                    </button>
                    <button
                      onClick={() => onDelete(task.id)}
                      className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 text-red-600 w-full text-left"
                      aria-label={`Delete task ${task.title}`}
                    >
                      <FiTrash2 size={14} /> Delete
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            {task.description && (
              <p className="mt-2 text-gray-700 line-clamp-3 text-sm">{task.description}</p>
            )}

            {/* Labels */}
            {task.labels && task.labels.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {task.labels.map((label, idx) => (
                  <span
                    key={idx}
                    className="bg-gray-200 text-gray-800 px-2 py-0.5 text-xs rounded-full"
                  >
                    {label}
                  </span>
                ))}
              </div>
            )}

            {/* Assignee/Reporter */}
            {(task.assignee || task.reporter) && (
              <div className="mt-3 flex flex-col text-xs text-gray-500">
                {task.assignee && (
                  <div>
                    👤 Assigned: <span className="font-medium">{task.assignee}</span>
                  </div>
                )}
                {task.reporter && (
                  <div>
                    📝 Reported by: <span className="font-medium">{task.reporter}</span>
                  </div>
                )}
              </div>
            )}

            {/* Dates */}
            <div className="mt-2 text-xs text-gray-400">
              📅 Last Updated: {dayjs(task.updatedAt || task.createdAt).format('MMM D, YYYY')}
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;
