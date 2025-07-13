import React from 'react';
import { Task } from './types';
import { Filter, UserRoundSearch } from 'lucide-react';

interface Props {
  filter: 'all' | 'todo' | 'inprogress' | 'review' | 'done';
  setFilter: (value: 'all' | 'todo' | 'inprogress' | 'review' | 'done') => void;
  selectedAssignee: string;
  setSelectedAssignee: (value: string) => void;
  tasks: Task[];
}

const QuickFilterNav: React.FC<Props> = ({
  filter,
  setFilter,
  selectedAssignee,
  setSelectedAssignee,
  tasks,
}) => {
  const statusOptions: { key: Props['filter']; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'todo', label: 'To Do' },
    { key: 'inprogress', label: 'In Progress' },
    { key: 'review', label: 'In Review' },
    { key: 'done', label: 'Done' },
  ];

  const assignees = Array.from(new Set(tasks.map((task) => task.assignee))).filter(
    (assignee): assignee is string => !!assignee
  );

  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      action();
      e.preventDefault();
    }
  };

  return (
    <div className="flex items-center justify-between px-6 py-4 bg-white shadow-sm rounded-lg border border-gray-200 mb-6">
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
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'border-gray-200 text-gray-600 hover:bg-gray-100'
            }`}
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
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-100'
              }`}
              aria-label={`Filter by assignee ${name}`}
              aria-pressed={selectedAssignee === name}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      {/* Status Filter */}
      <div className="flex items-center gap-3 ml-auto">
        <div className="flex items-center text-sm text-gray-700 font-medium gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          Status:
        </div>
        <select
          id="status-filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value as Props['filter'])}
          className="border border-gray-200 text-sm px-3 py-2 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all duration-200 appearance-none"
          aria-label="Filter tasks by status"
        >
          {statusOptions.map(({ key, label }) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default QuickFilterNav;