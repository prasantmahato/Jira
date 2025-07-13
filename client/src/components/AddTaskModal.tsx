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
  const firstInputRef = useRef<HTMLInputElement>(null);

  // Click-outside and focus trapping
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
      // Trap focus within modal
      if (e.key === 'Tab') {
        const focusableElements = modalRef.current?.querySelectorAll(
          'input, textarea, select, button, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements) {
          const firstElement = focusableElements[0] as HTMLElement;
          const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
          if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    firstInputRef.current?.focus(); // Focus on first input when modal opens

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const handleSubmit = () => {
    if (!title.trim()) return; // Prevent submission if title is empty
    const now = new Date().toISOString();
    const newTask: Task = {
      id: initialTask?.id || Date.now(),
      title: title.trim(),
      status,
      description: description.trim() || undefined,
      assignee: assignee.trim() || undefined,
      reporter: reporter.trim() || undefined,
      labels: labels.split(',').map((l) => l.trim()).filter(Boolean) || undefined,
      createdAt: initialTask?.createdAt || now,
      updatedAt: now,
      order: initialTask?.order || undefined,
      comments: initialTask?.comments || undefined,
    };
    onAddOrUpdate(newTask);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      action();
      e.preventDefault();
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-md bg-black/30 flex items-center justify-center z-50">
      <motion.div
        ref={modalRef}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="bg-white p-6 rounded-lg shadow-2xl w-11/12 max-w-lg"
        role="dialog"
        aria-labelledby="modal-title"
        aria-modal="true"
      >
        <h2 id="modal-title" className="text-2xl font-bold text-gray-900 mb-6">
          {isEdit ? 'Edit Task' : 'Add New Task'}
        </h2>

        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              id="title"
              type="text"
              placeholder="Enter title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              ref={firstInputRef}
              className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all duration-200"
              aria-label="Task title"
            />
          </div>

          <div>
            <label htmlFor="description" className="text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              placeholder="Enter description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all duration-200"
              aria-label="Task description"
            />
          </div>

          <div>
            <label htmlFor="status" className="text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as Task['status'])}
              className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all duration-200 appearance-none bg-white"
              aria-label="Task status"
            >
              <option value="todo">To Do</option>
              <option value="inprogress">In Progress</option>
              <option value="inreview">In Review</option>
              <option value="done">Done</option>
            </select>
          </div>

          <div>
            <label htmlFor="assignee" className="text-sm font-medium text-gray-700">
              Assignee
            </label>
            <input
              id="assignee"
              type="text"
              placeholder="Enter assignee"
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
              className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all duration-200"
              aria-label="Task assignee"
            />
          </div>

          <div>
            <label htmlFor="reporter" className="text-sm font-medium text-gray-700">
              Reporter
            </label>
            <input
              id="reporter"
              type="text"
              placeholder="Enter reporter"
              value={reporter}
              onChange={(e) => setReporter(e.target.value)}
              className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all duration-200"
              aria-label="Task reporter"
            />
          </div>

          <div>
            <label htmlFor="labels" className="text-sm font-medium text-gray-700">
              Labels (comma separated)
            </label>
            <input
              id="labels"
              type="text"
              placeholder="Enter labels"
              value={labels}
              onChange={(e) => setLabels(e.target.value)}
              className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all duration-200"
              aria-label="Task labels"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            onKeyDown={(e) => handleKeyDown(e, onClose)}
            className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all duration-200"
            aria-label="Cancel task"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            onKeyDown={(e) => handleKeyDown(e, handleSubmit)}
            className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200"
            disabled={!title.trim()}
            aria-label={isEdit ? 'Update task' : 'Add task'}
          >
            {isEdit ? 'Update' : 'Add'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AddTaskModal;