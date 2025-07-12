import React, { useState } from 'react';
import { Task } from './types';
import { FiEdit, FiTrash2, FiMoreHorizontal } from 'react-icons/fi';
import dayjs from 'dayjs';

interface Props {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
}

const TaskCard: React.FC<Props> = ({ task, onEdit, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);

  const statusColors: Record<Task['status'], string> = {
    todo: 'bg-yellow-100 text-yellow-800',
    inprogress: 'bg-blue-100 text-blue-800',
    done: 'bg-green-100 text-green-800',
  };

  return (
    <div className="relative bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 px-4 py-3">
      {/* Title + Menu */}
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-1">
          <p className="text-base font-medium text-gray-900">{task.title}</p>
          <p className="text-base font-medium text-gray-900">{task.desc}</p>
          <span className={`text-xs font-medium px-2 py-0.5 rounded w-fit ${statusColors[task.status]}`}>
            {task.status}
          </span>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="text-gray-400 hover:text-gray-600"
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
                className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 w-full"
              >
                <FiEdit size={14} /> Edit
              </button>
              <button
                onClick={() => onDelete(task.id)}
                className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 text-red-600 w-full"
              >
                <FiTrash2 size={14} /> Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Created At */}
      <div className="mt-3 text-xs text-gray-400">
        Created: {dayjs(task.createdAt).format('MMM D, YYYY')}
      </div>
    </div>
  );
};

export default TaskCard;
