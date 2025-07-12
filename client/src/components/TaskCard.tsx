import React, { useState } from 'react';
import { Task } from './types';
import { FiEdit, FiTrash2, FiMoreHorizontal } from 'react-icons/fi';

interface Props {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
}

const TaskCard: React.FC<Props> = ({ task, onEdit, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="relative bg-white border border-red-500 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-200 p-4">
      {/* Title + Menu */}
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-1">
          <p className="text-base font-semibold text-gray-800">{task.title}</p>
          {/* Optional status tag */}
          <span className="text-xs inline-block px-2 py-1 bg-red-100 text-red-600 rounded-full w-fit capitalize">
            {task.status}
          </span>
        </div>

        {/* Ellipsis Button */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="text-gray-400 hover:text-gray-600"
          >
            <FiMoreHorizontal size={18} />
          </button>

          {showMenu && (
            <div
              className="absolute right-0 mt-2 w-28 bg-white border border-gray-200 rounded shadow z-10"
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
    </div>
  );
};

export default TaskCard;
