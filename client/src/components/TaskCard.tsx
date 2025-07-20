// TaskCard.tsx
import React, { useState } from 'react';
import { Task } from './types';
import { FiEdit, FiTrash2, FiMoreHorizontal, FiUser, FiTag, FiClock } from 'react-icons/fi';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Draggable } from '@hello-pangea/dnd';
import { useAuth } from '../context/AuthContext';

dayjs.extend(relativeTime);

interface Props {
  task: Task;
  index: number;
  onEdit?: (task: Task) => void;
  onDelete?: (id: number) => void;
  onDoubleClick?: (task: Task) => void;
}

const TaskCard: React.FC<Props> = ({ task, index, onEdit, onDelete, onDoubleClick }) => {
  const { user, hasRole } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  const taskTypeBorders: Record<string, string> = {
    Bug: 'border-l-4 border-l-red-500',
    Spike: 'border-l-4 border-l-orange-500',
    Ticket: 'border-l-4 border-l-green-500',
  };

  const taskTypeColors: Record<string, string> = {
    Bug: 'bg-red-100 text-red-800',
    Spike: 'bg-orange-100 text-orange-800',
    Ticket: 'bg-green-100 text-green-800',
  };

  const priorityColors: Record<string, string> = {
    highest: 'text-red-600',
    high: 'text-orange-600',
    medium: 'text-yellow-600',
    low: 'text-green-600',
    lowest: 'text-gray-600',
  };

  const borderClass = task.taskType ? taskTypeBorders[task.taskType] : 'border-l-4 border-l-gray-300';
  const canEdit = hasRole('Admin') || hasRole('Project Manager') || hasRole('Developer');
  const canDelete = hasRole('Admin') || hasRole('Project Manager');
  const isAssignedToUser = task.assignee === user?.username;

  const getUserInitials = (name?: string) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <Draggable draggableId={task.id ? task.id.toString() : `missing-id-${index}`} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`bg-white rounded-lg shadow-sm border hover:shadow-md transition-all duration-200 cursor-pointer relative group ${borderClass} ${
            snapshot.isDragging ? 'shadow-lg scale-105' : ''
          } ${isAssignedToUser ? 'ring-2 ring-blue-100' : ''}`}
          onDoubleClick={() => onDoubleClick?.(task)}
        >
          {/* Header */}
          <div className="p-4">
            <div className="flex items-start justify-between gap-3">
              <h4 className="font-medium text-gray-900 text-sm flex-1 line-clamp-2">
                {task.title}
              </h4>
              
              {/* Actions Menu */}
              {(canEdit || canDelete) && (
                <div className="relative opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowMenu(!showMenu);
                    }}
                    className="text-gray-400 hover:text-gray-600 p-1 rounded"
                    aria-label="Task options"
                  >
                    <FiMoreHorizontal className="h-4 w-4" />
                  </button>
                  
                  {showMenu && (
                    <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-md shadow-lg border z-10">
                      <div
                        className="absolute inset-0"
                        onClick={() => setShowMenu(false)}
                      />
                      <div className="py-1">
                        {canEdit && onEdit && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onEdit(task);
                              setShowMenu(false);
                            }}
                            className="flex items-center gap-2 px-3 py-2 text-xs hover:bg-gray-100 w-full text-left text-gray-700"
                          >
                            <FiEdit className="h-3 w-3" />
                            Edit
                          </button>
                        )}
                        {canDelete && onDelete && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDelete(task.id);
                              setShowMenu(false);
                            }}
                            className="flex items-center gap-2 px-3 py-2 text-xs hover:bg-gray-100 w-full text-left text-red-600"
                          >
                            <FiTrash2 className="h-3 w-3" />
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Task Type Badge */}
            {task.taskType && (
              <div className="mt-2">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${taskTypeColors[task.taskType]}`}>
                  {task.taskType}
                </span>
              </div>
            )}

            {/* Description */}
            {task.description && (
              <p className="text-xs text-gray-600 mt-2 line-clamp-2">
                {task.description}
              </p>
            )}

            {/* Labels */}
            {task.labels && task.labels.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-3">
                {task.labels.slice(0, 2).map((label, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    <FiTag className="h-2 w-2 mr-1" />
                    {label}
                  </span>
                ))}
                {task.labels.length > 2 && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                    +{task.labels.length - 2} more
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-gray-100 bg-gray-50 rounded-b-lg">
            <div className="flex items-center justify-between">
              {/* Assignee */}
              <div className="flex items-center gap-2">
                {task.assignee ? (
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium ${
                      isAssignedToUser ? 'bg-blue-600' : 'bg-gray-600'
                    }`}>
                      {getUserInitials(task.assignee)}
                    </div>
                    <span className={`text-xs ${isAssignedToUser ? 'text-blue-600 font-medium' : 'text-gray-600'}`}>
                      {task.assignee}
                    </span>
                  </div>
                ) : (
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <FiUser className="h-3 w-3" />
                    Unassigned
                  </span>
                )}
              </div>

              {/* Time info */}
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <FiClock className="h-3 w-3" />
                <span title={dayjs(task.updatedAt || task.createdAt).format('MMM D, YYYY h:mm A')}>
                  {dayjs(task.updatedAt || task.createdAt).fromNow()}
                </span>
              </div>
            </div>

            {/* Sprint and Project info */}
            {(task.sprintNo || task.projectNo) && (
              <div className="flex items-center gap-2 mt-2">
                {task.sprintNo && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                    Sprint {task.sprintNo}
                  </span>
                )}
                {task.projectNo && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                    Project {task.projectNo}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Drag indicator */}
          {snapshot.isDragging && (
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-600 rounded-full animate-pulse"></div>
          )}
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;