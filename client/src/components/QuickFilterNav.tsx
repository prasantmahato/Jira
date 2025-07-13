import React from 'react';
import { Task } from './types';
import { Filter, UserRoundSearch } from 'lucide-react';

interface Props {
  filter: 'all' | 'todo' | 'inprogress' | 'inreview' | 'done';
  setFilter: (value: 'all' | 'todo' | 'inprogress' | 'inreview' | 'done') => void;
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
    { key: 'inreview', label: 'In Review' },
    { key: 'done', label: 'Done' },
  ];

  const assignees = Array.from(new Set(tasks.map((task) => task.assignee))).filter(Boolean);

  return (
    <div className="flex flex-wrap justify-between items-center px-6 py-3 bg-white shadow-sm rounded-xl border border-gray-200 mb-6">
      {/* Status Filter */}
      <div className="flex items-center gap-4">
        <div className="flex items-center text-sm text-gray-500 font-medium gap-2">
          <Filter className="w-4 h-4" />
          Status:
        </div>
        <div className="flex gap-2">
          {statusOptions.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-3 py-1.5 rounded-full text-sm transition border font-medium ${
                filter === key
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'border-gray-300 text-gray-600 hover:bg-gray-100'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Assignee Filter */}
      <div className="flex items-center gap-3 mt-3 sm:mt-0">
        <div className="flex items-center text-sm text-gray-500 font-medium gap-2">
          <UserRoundSearch className="w-4 h-4" />
          Assignee:
        </div>
        <select
          value={selectedAssignee}
          onChange={(e) => setSelectedAssignee(e.target.value)}
          className="border border-gray-300 text-sm px-3 py-1.5 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="all">All</option>
          {assignees.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default QuickFilterNav;
