import React, { useState, useEffect, useRef } from 'react';
import { FiX, FiSave, FiUser, FiCalendar } from 'react-icons/fi';
import dayjs from 'dayjs';
import { Task } from './types';
import { tasksApi } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

interface Props {
  task: Task;
  onClose: () => void;
  onUpdate: (task: Task) => void;
}

const TaskDetailPanel: React.FC<Props> = ({ task, onClose, onUpdate }) => {
  const { user } = useAuth();
  const [editedTask, setEditedTask] = useState({ ...task });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<{ text: string; time: string; author?: string }[]>(
    Array.isArray(task.comments)
      ? task.comments.map((c) => ({
          text: c.text ?? '',
          time: c.time ?? new Date().toISOString(),
          author: c.author || user?.username || 'Unknown',
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
            author: c.author || user?.username || 'Unknown',
          }))
        : []
    );
    setNewComment('');
    setIsEditing(false);
  };

  const saveAllFields = async () => {
    if (loading) return;

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

    try {
      setLoading(true);
      await tasksApi.update(task.id.toString(), updated);
      onUpdate(updated);
      setIsEditing(false);
      toast.success('Task updated successfully');
    } catch (error: any) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task');
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim().length || loading) return;

    const newEntry = {
      text: newComment,
      time: new Date().toISOString(),
      author: user?.username || 'Anonymous',
    };

    const updatedComments = [...comments, newEntry];
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

    try {
      setLoading(true);
      await tasksApi.update(task.id.toString(), updated);
      setComments(updatedComments);
      setNewComment('');
      onUpdate(updated);
      toast.success('Comment added successfully');
    } catch (error: any) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent, action: () => void) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      action();
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
        : Array.isArray(editedTask[field]) 
          ? (editedTask[field] as string[]).join(', ') 
          : (editedTask[field] as string) || ''
      : field === 'sprintNo'
      ? editedTask[field] ?? ''
      : (editedTask[field] as string) || '';

    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
        {type === 'textarea' ? (
          <textarea
            value={value}
            onChange={(e) => handleFieldChange(field, e.target.value)}
            rows={4}
            placeholder={`Enter ${label.toLowerCase()}`}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            disabled={loading}
          />
        ) : type === 'select' && options ? (
          <select
            value={value}
            onChange={(e) => handleFieldChange(field, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
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
            type="number"
            value={value}
            onChange={(e) => handleFieldChange(field, e.target.value)}
            placeholder={`Enter ${label.toLowerCase()}`}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
          />
        ) : (
          <input
            type="text"
            value={value}
            onChange={(e) => handleFieldChange(field, e.target.value)}
            placeholder={`Enter ${label.toLowerCase()}`}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
          />
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        ref={panelRef}
        className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <FiUser className="h-5 w-5 text-blue-600" />
            Task Details
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full p-2 transition-colors duration-200"
            disabled={loading}
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Task Fields */}
          {renderEditableField('title', 'Title')}
          {renderEditableField('description', 'Description', 'textarea')}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderEditableField('assignee', 'Assignee')}
            {renderEditableField('reporter', 'Reporter')}
          </div>
          
          {renderEditableField('labels', 'Labels (comma separated)')}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderEditableField('sprintNo', 'Sprint Number')}
            {renderEditableField('projectNo', 'Project Number')}
          </div>
          
          {renderEditableField('acceptanceCriteria', 'Acceptance Criteria', 'textarea')}
          {renderEditableField('taskType', 'Task Type', 'select', ['Bug', 'Spike', 'Ticket'])}

          {/* Action Buttons */}
          {isEditing && (
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={cancelEdit}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={saveAllFields}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Saving...
                  </div>
                ) : (
                  <>
                    <FiSave className="inline h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          )}

          {/* Comments Section */}
          <div className="pt-6 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Comments</h3>
            
            {comments.length === 0 ? (
              <p className="text-gray-500 text-center py-8 bg-gray-50 rounded-lg">
                No comments yet. Be the first to add one!
              </p>
            ) : (
              <div className="space-y-4 mb-4">
                {comments.map((comment, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-medium">
                        {comment.author ? comment.author[0].toUpperCase() : 'U'}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-gray-900">
                            {comment.author || 'Unknown User'}
                          </span>
                          <span className="text-xs text-gray-500">
                            {dayjs(comment.time).format('MMM D, YYYY h:mm A')}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">{comment.text}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add Comment */}
            <div className="flex gap-3">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, handleAddComment)}
                placeholder="Add a comment... (Press Enter to submit)"
                maxLength={500}
                rows={3}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                disabled={loading}
              />
              <button
                onClick={handleAddComment}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                disabled={!newComment.trim().length || loading}
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  'Add'
                )}
              </button>
            </div>
          </div>

          {/* Metadata */}
          <div className="pt-4 border-t border-gray-200 text-xs text-gray-500 space-y-1">
            <div className="flex items-center gap-2">
              <FiCalendar className="h-3 w-3" />
              <span>Created: {dayjs(task.createdAt).format('MMM D, YYYY h:mm A')}</span>
            </div>
            <div className="flex items-center gap-2">
              <FiCalendar className="h-3 w-3" />
              <span>Updated: {dayjs(task.updatedAt || task.createdAt).format('MMM D, YYYY h:mm A')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailPanel;