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
  const [sprintNo, setSprintNo] = useState(initialTask?.sprintNo || '');
  const [projectNo, setProjectNo] = useState(initialTask?.projectNo || '');
  const [acceptanceCriteria, setAcceptanceCriteria] = useState(initialTask?.acceptanceCriteria || '');
  const [taskType, setTaskType] = useState<Task['taskType']>(initialTask?.taskType || '');
  const [errors, setErrors] = useState<{ title?: string; taskType?: string }>({});
  const modalRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

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
      const focusableElements = modalRef.current?.querySelectorAll(
        'input, textarea, select, button, [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements) {
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
        if (e.key === 'Tab' && e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (e.key === 'Tab' && !e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    firstInputRef.current?.focus();

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const validateForm = () => {
    const newErrors: { title?: string; taskType?: string } = {};
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!taskType) {
      newErrors.taskType = 'Task type is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      console.log('Validation failed:', errors);
      return;
    }
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
      sprintNo: sprintNo ? String(sprintNo) : undefined,
      projectNo: projectNo.trim() || undefined,
      acceptanceCriteria: acceptanceCriteria.trim() || undefined,
      taskType: taskType || undefined,
    };
    console.log('Submitting task:', newTask);
    try {
      onAddOrUpdate(newTask);
      onClose();
    } catch (error) {
      console.error('Error in onAddOrUpdate:', error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      action();
      e.preventDefault();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-40">
      <motion.div
        ref={modalRef}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="bg-white p-6 rounded-lg shadow-2xl w-11/12 max-w-lg h-auto max-h-[80vh] flex flex-col z-50"
        role="dialog"
        aria-labelledby="modal-title"
        aria-modal="true"
      >
        <h2 id="modal-title" className="text-2xl font-bold text-gray-900 mb-6">
          {isEdit ? 'Edit Task' : 'Create New Task'}
        </h2>

        {/* Scrollable Form Content */}
        <div
          className="flex-1 overflow-y-auto pr-2 pl-2 space-y-4"
          aria-describedby="form-fields"
        >
          <div id="form-fields" className="sr-only">
            Task form fields
          </div>
          <div>
            <label htmlFor="title" className="text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              id="title"
              type="text"
              placeholder="Enter title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setErrors((prev) => ({ ...prev, title: undefined }));
              }}
              ref={firstInputRef}
              className={`mt-1 w-full border ${
                errors.title ? 'border-red-300' : 'border-gray-200'
              } rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline focus:ring-1 focus:ring-blue-300 focus:border-blue-300 transition-all duration-200`}
              aria-label="Task title"
              aria-describedby={errors.title ? 'title-error' : undefined}
            />
            {errors.title && (
              <p id="title-error" className="text-xs text-red-600 mt-1" aria-live="polite">
                {errors.title}
              </p>
            )}
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
              className={`mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition-all duration-200`}
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
              className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition-all duration-200"
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
              className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition-all duration-200"
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
              className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition-all duration-200"
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
              className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition-all duration-200"
              aria-label="Task labels"
            />
          </div>

          <div>
            <label htmlFor="sprintNo" className="text-sm font-medium text-gray-700">
              Sprint Number
            </label>
            <input
              id="sprintNo"
              type="text"
              placeholder="Enter sprint number"
              value={sprintNo}
              onChange={(e) => setSprintNo(e.target.value)}
              className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition-all duration-200"
              aria-label="Sprint number"
            />
          </div>

          <div>
            <label htmlFor="projectNo" className="text-sm font-medium text-gray-700">
              Project Number
            </label>
            <input
              id="projectNo"
              type="text"
              placeholder="Enter project number"
              value={projectNo}
              onChange={(e) => setProjectNo(e.target.value)}
              className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition-all duration-200"
              aria-label="Project number"
            />
          </div>

          <div>
            <label htmlFor="acceptanceCriteria" className="text-sm font-medium text-gray-700">
              Acceptance Criteria
            </label>
            <textarea
              id="acceptanceCriteria"
              placeholder="Enter acceptance criteria"
              value={acceptanceCriteria}
              onChange={(e) => setAcceptanceCriteria(e.target.value)}
              rows={4}
              className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition-all duration-200"
              aria-label="Acceptance criteria"
            />
          </div>

          <div>
            <label htmlFor="taskType" className="text-sm font-medium text-gray-700">
              Task Type
            </label>
            <select
              id="taskType"
              value={taskType}
              onChange={(e) => {
                setTaskType(e.target.value as Task['taskType']);
                setErrors((prev) => ({ ...prev, taskType: undefined }));
              }}
              className={`mt-1 w-full border ${
                errors.taskType ? 'border-red-300' : 'border-gray-200'
              } rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition-all duration-200`}
              aria-label="Task type"
              aria-describedby={errors.taskType ? 'taskType-error' : undefined}
            >
              <option value="">Select task type</option>
              <option value="Bug">Bug</option>
              <option value="Spike">Spike</option>
              <option value="Ticket">Ticket</option>
            </select>
            {errors.taskType && (
              <p id="taskType-error" className="text-xs text-red-600 mt-1" aria-live="polite">
                {errors.taskType}
              </p>
            )}
          </div>
        </div>

        {/* Fixed Footer with Buttons */}
        <div className="mt-6 flex justify-end gap-3 sticky bottom-0 bg-white pt-4 z-10">
          <button
            onClick={onClose}
            onKeyDown={(e) => handleKeyDown(e, onClose)}
            className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition-all duration-200"
            aria-label="Cancel task"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            onKeyDown={(e) => handleKeyDown(e, handleSubmit)}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200"
            disabled={!title.trim() || !taskType}
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