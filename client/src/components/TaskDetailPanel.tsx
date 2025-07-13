import React, { useState, useEffect, useRef } from 'react';
import { FiX } from 'react-icons/fi';
import dayjs from 'dayjs';
import { Task } from './types';

interface Props {
  task: Task;
  onClose: () => void;
  onUpdate: (task: Task) => void;
}

const TaskDetailPanel: React.FC<Props> = ({ task, onClose, onUpdate }) => {
  const [editedTask, setEditedTask] = useState<Task>({ ...task });
  const [isEditing, setIsEditing] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<{ text: string; time: string }[]>(
    Array.isArray(task.comments)
      ? task.comments.map((c) => ({
          text: c.text ?? '',
          time: c.time ?? new Date().toISOString(),
        }))
      : []
  );
  const panelRef = useRef<HTMLDivElement>(null);

  // Click-outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleFieldChange = (field: keyof Task, value: string | number) => {
    setEditedTask((prev) => ({ ...prev, [field]: value }));
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setEditedTask({ ...task });
    setComments(
      Array.isArray(task.comments)
        ? task.comments.map((c) => ({
            text: c.text ?? '',
            time: c.time ?? new Date().toISOString(),
          }))
        : []
    );
    setNewComment('');
    setIsEditing(false);
  };

  const saveAllFields = () => {
    const updated: Task = {
      ...editedTask,
      updatedAt: new Date().toISOString(),
      comments,
      labels: typeof editedTask.labels === 'string'
        ? editedTask.labels.split(',').map((l) => l.trim()).filter(Boolean)
        : editedTask.labels || [],
      sprintNo: editedTask.sprintNo !== undefined ? String(editedTask.sprintNo) : undefined,
      taskType: editedTask.taskType || undefined,
    };
    onUpdate(updated);
    setIsEditing(false);
  };

  const handleAddComment = () => {
    if (newComment.trim().length > 0) {
      const newEntry = {
        text: newComment,
        time: new Date().toISOString(),
      };
      const updatedComments = [...comments, newEntry];
      setComments(updatedComments);
      setNewComment('');
      const updated: Task = {
        ...editedTask,
        updatedAt: new Date().toISOString(),
        comments: updatedComments,
        labels: typeof editedTask.labels === 'string'
          ? editedTask.labels.split(',').map((l) => l.trim()).filter(Boolean)
          : editedTask.labels || [],
        sprintNo: editedTask.sprintNo !== undefined ? String(editedTask.sprintNo) : undefined,
        taskType: editedTask.taskType || undefined,
      };
      onUpdate(updated);
      setIsEditing(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent, action: () => void) => {
    if (event.key === 'Enter' || event.key === ' ') {
      action();
      event.preventDefault();
    }
  };

  const renderEditableField = (
    field: keyof Task,
    label: string,
    type: 'text' | 'textarea' | 'select' | 'number' = 'text',
    options?: string[]
  ) => {
    const value = field === 'labels'
      ? Array.isArray(editedTask.labels)
        ? editedTask.labels.join(', ')
        : (editedTask[field] as string) || ''
      : field === 'sprintNo'
      ? editedTask[field] ?? ''
      : (editedTask[field] as string) || '';

    return (
      <div className="group relative mb-6">
        <label className="text-sm font-medium text-gray-700" htmlFor={field}>
          {label}
        </label>
        <div className="mt-1">
          {type === 'textarea' ? (
            <textarea
              id={field}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all duration-200"
              value={value}
              onChange={(e) => handleFieldChange(field, e.target.value)}
              rows={4}
              placeholder={`Enter ${label.toLowerCase()}`}
              aria-label={label}
            />
          ) : type === 'select' && options ? (
            <select
              id={field}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all duration-200 appearance-none"
              value={value}
              onChange={(e) => handleFieldChange(field, e.target.value)}
              aria-label={label}
            >
              <option value="">Select {label.toLowerCase()}</option>
              {options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          ) : type === 'number' ? (
            <input
              id={field}
              type="number"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all duration-200"
              value={value}
              onChange={(e) => handleFieldChange(field, e.target.value)}
              placeholder={`Enter ${label.toLowerCase()}`}
              aria-label={label}
            />
          ) : (
            <input
              id={field}
              type="text"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all duration-200"
              value={value}
              onChange={(e) => handleFieldChange(field, e.target.value)}
              placeholder={`Enter ${label.toLowerCase()}`}
              aria-label={label}
            />
          )}
        </div>
      </div>
    );
  };

  return (
    <div
      ref={panelRef}
      className="fixed top-0 right-0 h-full w-full sm:w-[500px] bg-white shadow-2xl z-50 overflow-y-auto px-6 py-8 transform transition-transform duration-300 ease-in-out translate-x-0"
      role="dialog"
      aria-labelledby="task-detail-title"
    >
      <div className="flex justify-between items-center mb-8">
        <h2 id="task-detail-title" className="text-2xl font-bold text-gray-900">
          Task Details
        </h2>
        <button
          onClick={onClose}
          onKeyDown={(e) => handleKeyDown(e, onClose)}
          className="text-gray-500 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-300 rounded-full p-1 transition-colors duration-200"
          aria-label="Close task details"
        >
          <FiX size={24} />
        </button>
      </div>

      {renderEditableField('title', 'Title')}
      {renderEditableField('description', 'Description', 'textarea')}
      {renderEditableField('assignee', 'Assignee')}
      {renderEditableField('reporter', 'Reporter')}
      {renderEditableField('labels', 'Labels (comma separated)')}
      {renderEditableField('sprintNo', 'Sprint Number')}
      {renderEditableField('projectNo', 'Project Number')}
      {renderEditableField('acceptanceCriteria', 'Acceptance Criteria', 'textarea')}
      {renderEditableField('taskType', 'Task Type', 'select', ['Bug', 'Spike', 'Ticket'])}

      {isEditing && (
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={cancelEdit}
            onKeyDown={(e) => handleKeyDown(e, cancelEdit)}
            className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all duration-200"
            aria-label="Cancel edits"
          >
            Cancel
          </button>
          <button
            onClick={saveAllFields}
            onKeyDown={(e) => handleKeyDown(e, saveAllFields)}
            className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all duration-200"
            aria-label="Save changes"
          >
            Save
          </button>
        </div>
      )}

      <div className="mt-8">
        <label className="text-sm font-medium text-gray-700">Comments</label>
        <div className="mt-3 space-y-3">
          {comments.length === 0 ? (
            <p className="text-sm text-gray-500">No comments yet.</p>
          ) : (
            comments.map((c, i) => (
              <div
                key={i}
                className="bg-gray-50 p-3 rounded-lg text-gray-800 animate-fade-in"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-sm font-medium">
                    {c.text.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">{c.text}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {dayjs(c.time).format('MMM D, YYYY h:mm A')}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="mt-4 flex gap-3">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment"
            maxLength={500}
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all duration-200"
            aria-label="New comment"
          />
          <button
            onClick={handleAddComment}
            onKeyDown={(e) => handleKeyDown(e, handleAddComment)}
            className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200"
            disabled={!newComment.trim().length}
            aria-label="Add comment"
          >
            Add
          </button>
        </div>
      </div>

      <div className="mt-6 text-xs text-gray-500">
        <p>Created: {dayjs(task.createdAt).format('MMM D, YYYY')}</p>
        <p>Updated: {dayjs(task.updatedAt || task.createdAt).format('MMM D, YYYY')}</p>
      </div>
    </div>
  );
};

export default TaskDetailPanel;