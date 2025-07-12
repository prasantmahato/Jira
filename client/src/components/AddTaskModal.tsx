import React, { useEffect, useRef, useState } from 'react';
import { Task } from './types';
import { motion } from 'framer-motion';

interface Props {
  onAddOrUpdate: (task: Task) => void;
  onClose: () => void;
  initialTask?: Task;
}

const AddTaskModal: React.FC<Props> = ({ onAddOrUpdate, onClose, initialTask }) => {
  const isEdit = !!initialTask;

  const [title, setTitle] = useState(initialTask?.title || '');
  const [description, setDescription] = useState(initialTask?.description || '');
  const [status, setStatus] = useState<Task['status']>(initialTask?.status || 'todo');
  const [assignee, setAssignee] = useState(initialTask?.assignee || '');
  const [reporter, setReporter] = useState(initialTask?.reporter || '');
  const [labels, setLabels] = useState(initialTask?.labels?.join(', ') || '');

  const modalRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (e: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = () => {
    const now = new Date().toISOString();
    const newTask: Task = {
      id: initialTask?.id || Date.now(),
      title,
      status,
      description,
      assignee,
      reporter,
      labels: labels.split(',').map((l) => l.trim()).filter(Boolean),
      createdAt: initialTask?.createdAt || now,
      updatedAt: now,
    };
    onAddOrUpdate(newTask);
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
      <motion.div
        ref={modalRef}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md"
      >
        <h2 className="text-lg font-semibold mb-4">
          {isEdit ? 'Edit Task' : 'Add New Task'}
        </h2>

        <div className="space-y-3">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
          />

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as Task['status'])}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
          >
            <option value="todo">To Do</option>
            <option value="inprogress">In Progress</option>
            <option value="done">Done</option>
          </select>

          <input
            type="text"
            placeholder="Assignee"
            value={assignee}
            onChange={(e) => setAssignee(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
          />

          <input
            type="text"
            placeholder="Reporter"
            value={reporter}
            onChange={(e) => setReporter(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
          />

          <input
            type="text"
            placeholder="Labels (comma separated)"
            value={labels}
            onChange={(e) => setLabels(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
          />
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-black px-4 py-2 text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 text-sm rounded"
          >
            {isEdit ? 'Update' : 'Add'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AddTaskModal;
