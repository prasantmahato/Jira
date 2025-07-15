import React from 'react';
import { Task } from './types';
import { UserRoundSearch } from 'lucide-react';

interface Props {
  selectedAssignee: string;
  setSelectedAssignee: (value: string) => void;
  tasks: Task[];
}

const QuickFilterNav: React.FC<Props> = ({
  selectedAssignee,
  setSelectedAssignee,
  tasks,
}) => {
  const assignees = Array.from(new Set(tasks.map((task) => task.assignee)))
  .filter((assignee): assignee is string => !!assignee)
  .sort((a, b) => a.localeCompare(b));

  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      action();
      e.preventDefault();
    }
  };

  return (
    <div className="flex flex-col gap-4 px-6 py-4 bg-white shadow-xs rounded-lg border border-gray-200 mb-6">
      {/* Assignee Filter */}
      <div className="flex items-center gap-3">
        <div className="flex items-center text-sm text-gray-700 font-medium gap-2">
          <UserRoundSearch className="w-4 h-4 text-gray-500" />
          Assignee:
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedAssignee('all')}
            onKeyDown={(e) => handleKeyDown(e, () => setSelectedAssignee('all'))}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition border ${
              selectedAssignee === 'all'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'border-gray-200 text-gray-600 hover:bg-gray-100'
            } focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2`}
            aria-label="Filter by all assignees"
            aria-pressed={selectedAssignee === 'all'}
          >
            All
          </button>
          {assignees.map((name) => (
            <button
              key={name}
              onClick={() => setSelectedAssignee(name)}
              onKeyDown={(e) => handleKeyDown(e, () => setSelectedAssignee(name))}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition border ${
                selectedAssignee === name
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-100'
              } focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2`}
              aria-label={`Filter by assignee ${name}`}
              aria-pressed={selectedAssignee === name}
            >
              {name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuickFilterNav;