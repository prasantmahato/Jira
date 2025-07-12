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
    <div className="relative bg-gray-100 p-3 border border-red-500 rounded shadow transition group">
  {/* Row: title + ellipsis */}
  <div className="flex justify-between items-start">
    <p className="text-sm font-medium">card - {task.title}</p>

    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="text-gray-0 hover:text-gray-0"
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
