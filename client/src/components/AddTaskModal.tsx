import React, { useState } from 'react';
import { Task } from './types';

interface Props {
  onAddOrUpdate: (task: Task) => void;
  onClose: () => void;
  initialTask?: Task;
}

const AddTaskModal: React.FC<Props> = ({ onAddOrUpdate, onClose, initialTask }) => {
  const isEdit = !!initialTask;
  const [title, setTitle] = useState(initialTask?.title || '');
  const [status, setStatus] = useState<Task['status']>(initialTask?.status || 'todo');

  const handleSubmit = () => {
    if (!title.trim()) return;
    const newTask: Task = {
      id: initialTask?.id || Date.now(),
      title,
      status,
    };
    onAddOrUpdate(newTask);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-sm">
        <h2 className="text-xl font-semibold mb-4">{isEdit ? 'Edit Task' : 'Add New Task'}</h2>
        <input
          type="text"
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as Task['status'])}
          className="w-full p-2 border rounded mb-4"
        >
          <option value="todo">To Do</option>
          <option value="inprogress">In Progress</option>
          <option value="done">Done</option>
        </select>
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="text-gray-600 hover:underline">
            Cancel
          </button>
          <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-1 rounded">
            {isEdit ? 'Update' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddTaskModal;
