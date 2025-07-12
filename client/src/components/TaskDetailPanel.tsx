// TaskDetailPanel.tsx
import React, { useState } from 'react';
import { Task } from './types';
import dayjs from 'dayjs';
import { FiX, FiEdit3 } from 'react-icons/fi';

interface Props {
  task: Task;
  onClose: () => void;
  onUpdate: (task: Task) => void;
}

const TaskDetailPanel: React.FC<Props> = ({ task, onClose, onUpdate }) => {
  const [editedTask, setEditedTask] = useState<Task>({ ...task });
  const [isEditing, setIsEditing] = useState(false);

  const handleFieldChange = (field: keyof Task, value: string) => {
    setEditedTask((prev) => ({ ...prev, [field]: value }));
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setEditedTask({ ...task });
    setIsEditing(false);
  };

  const saveAllFields = () => {
    const updated: Task = {
      ...editedTask,
      updatedAt: new Date().toISOString(),
      labels: typeof editedTask.labels === 'string'
        ? (editedTask.labels as string).split(',').map((l) => l.trim()).filter(Boolean)
        : editedTask.labels,
    };

    onUpdate(updated);
    setIsEditing(false);
  };

  const renderEditableField = (field: keyof Task, label: string, multiline = false) => {
    const value = field === 'labels'
      ? Array.isArray(editedTask.labels) ? editedTask.labels.join(', ') : (editedTask.labels as string)
      : (editedTask[field] as string);

    return (
      <div className="group relative mb-4">
        <label className="text-sm font-medium text-gray-500">{label}</label>
        <div className="mt-1">
          {multiline ? (
            <textarea
              className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
              value={value}
              onChange={(e) => handleFieldChange(field, e.target.value)}
              rows={3}
            />
          ) : (
            <input
              type="text"
              className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
              value={value}
              onChange={(e) => handleFieldChange(field, e.target.value)}
            />
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white shadow-xl z-50 overflow-y-auto px-6 py-6 border-l border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Task Details</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <FiX size={22} />
        </button>
      </div>

      {renderEditableField('title', 'Title')}
      {renderEditableField('description', 'Description', true)}
      {renderEditableField('assignee', 'Assignee')}
      {renderEditableField('reporter', 'Reporter')}
      {renderEditableField('labels', 'Labels (comma separated)')}

      <div className="mt-6 text-xs text-gray-400">
        Created: {dayjs(task.createdAt).format('MMM D, YYYY')} <br />
        Updated: {dayjs(task.updatedAt || task.createdAt).format('MMM D, YYYY')}
      </div>

      {isEditing && (
        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={cancelEdit}
            className="px-4 py-2 text-sm text-gray-600 hover:text-black border border-gray-300 rounded"
          >
            Cancel
          </button>
          <button
            onClick={saveAllFields}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded"
          >
            Update
          </button>
        </div>
      )}
    </div>
  );
};

export default TaskDetailPanel;
